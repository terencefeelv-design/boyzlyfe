/* ============================================================
   FEELV — bOYz Lyf£ · script.js
   Interactions minimalistes. Hook prêt pour Three.js futur.
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Smooth scroll pour les ancres internes ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Tracks : navigation vers la fiche A.VIB si dispo ---------- */
  document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', (e) => {
      // évite double-déclenchement quand on clique sur le lien A.VIB lui-même
      if (e.target.closest('.track__link')) return;
      const slug = track.dataset.slug;
      if (slug) {
        window.location.href = `sons/${slug}.html`;
      }
    });
  });

  /* ---------- Reveal on scroll (apparition douce) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section, .track, .avib-card, .stat').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  /* Inject reveal CSS dynamically — keeps styles.css focused on layout */
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1); }
    .reveal.is-in { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  /* ============================================================
     GATE — Stats privées aux fans
     ------------------------------------------------------------
     Phase 1 (V1, lancement) : honor system.
       L'utilisateur déclare sa plateforme → unlock + mémoire localStorage.

     Phase 2 (V2, post-lancement) : vérification réelle via Spotify OAuth.
       Voir doc complète tout en bas de ce fichier (// VERIFICATION SPOTIFY).
     ============================================================ */

  const GATE_KEY = 'feelv_fan_platform';

  const gate = document.getElementById('stats-gate');
  const content = document.getElementById('stats-content');

  if (gate && content) {
    const panelLock = gate.querySelector('.gate__panel--lock');
    const panelConfirm = gate.querySelector('.gate__panel--confirm');
    const platformLabel = document.getElementById('gate-platform-label');

    const PLATFORMS = {
      spotify: 'Spotify',
      apple: 'Apple Music',
      deezer: 'Deezer',
    };

    function unlock(platform) {
      try { localStorage.setItem(GATE_KEY, platform); } catch (e) { }
      if (platformLabel && PLATFORMS[platform]) {
        platformLabel.textContent = PLATFORMS[platform];
      }
      gate.hidden = true;
      content.hidden = false;
    }

    function lock() {
      try { localStorage.removeItem(GATE_KEY); } catch (e) { }
      gate.hidden = false;
      content.hidden = true;
      // remet l'étape "lock" au premier plan
      panelLock.hidden = false;
      panelConfirm.hidden = true;
      gate.setAttribute('data-state', 'lock');
    }

    function showConfirm() {
      panelLock.hidden = true;
      panelConfirm.hidden = false;
      gate.setAttribute('data-state', 'confirm');
    }

    function showLock() {
      panelLock.hidden = false;
      panelConfirm.hidden = true;
      gate.setAttribute('data-state', 'lock');
    }

    // 1) au chargement : si l'user a déjà claim, on unlock direct
    let savedPlatform = null;
    try { savedPlatform = localStorage.getItem(GATE_KEY); } catch (e) { }
    if (savedPlatform && PLATFORMS[savedPlatform]) {
      unlock(savedPlatform);
    }

    // 2) clic sur "Je suis déjà abonné →"
    gate.addEventListener('click', (e) => {
      const claimBtn = e.target.closest('[data-action]');
      if (claimBtn) {
        e.preventDefault();
        const action = claimBtn.dataset.action;
        if (action === 'claim') showConfirm();
        else if (action === 'back') showLock();
        return;
      }
      // 3) clic sur une plateforme de confirmation
      const confirmBtn = e.target.closest('[data-confirm]');

      if (confirmBtn) {
        e.preventDefault();

        const platform = confirmBtn.dataset.confirm;
        const url = confirmBtn.getAttribute('href');

        if (url) {
          window.open(url, '_blank', 'noopener');
        }

        setTimeout(() => {
          unlock(platform);
        }, 1500);
      }
    });

    // 4) clic sur le × dans le badge (revenir au gate)
    content.addEventListener('click', (e) => {
      const resetBtn = e.target.closest('[data-action="reset"]');
      if (resetBtn) {
        e.preventDefault();
        lock();
      }
    });
  }

  /* ---------- Console signature ---------- */
  console.log('%cFEELV · bOYz Lyf£', 'color:#D32F2F;font:600 22px sans-serif;letter-spacing:0.1em');
  console.log('%c01 — 06 — 2026', 'color:#888;font:300 12px monospace;letter-spacing:0.2em');

  /* ============================================================
     THREE.JS — Particle field discret sur le hero
     ------------------------------------------------------------
     Field de ~200 particules rouges qui dérivent lentement,
     avec parallaxe à la souris. Effet "vibration" subtile,
     ne dépasse jamais le texte (z-index, opacity).
     ============================================================ */

  function initThreeStage() {
    const canvas = document.getElementById('three-stage');
    if (!canvas || typeof THREE === 'undefined') return;

    // Respect du choix utilisateur "réduire les animations"
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const hero = canvas.parentElement;
    let W = hero.clientWidth, H = hero.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 1, 1000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);

    // ---- Particles ----
    const COUNT = 220;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
      velocities[i * 3] = (Math.random() - 0.5) * 0.08;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05 + 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xD32F2F,
      size: 1.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geom, mat);
    scene.add(points);

    // ---- Mouse parallax ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 30;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 20;
    }, { passive: true });

    // ---- Resize ----
    function onResize() {
      W = hero.clientWidth;
      H = hero.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // ---- Animation loop ----
    let frame = 0;
    function animate() {
      frame++;
      const pos = geom.attributes.position.array;

      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        // wrap around
        if (pos[i * 3] > 300) pos[i * 3] = -300;
        if (pos[i * 3] < -300) pos[i * 3] = 300;
        if (pos[i * 3 + 1] > 200) pos[i * 3 + 1] = -200;
        if (pos[i * 3 + 1] < -200) pos[i * 3 + 1] = 200;
        if (pos[i * 3 + 2] > 150) pos[i * 3 + 2] = -150;
        if (pos[i * 3 + 2] < -150) pos[i * 3 + 2] = 150;
      }
      geom.attributes.position.needsUpdate = true;

      // Pulse global subtil (rythme vibratoire)
      mat.opacity = 0.55 + Math.sin(frame * 0.01) * 0.12;

      // Smooth parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      camera.position.x = mouse.x;
      camera.position.y = -mouse.y;
      camera.lookAt(0, 0, 0);

      // Auto-rotate slow
      points.rotation.y += 0.0008;
      points.rotation.x += 0.0003;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);

      window.open(url, '_blank');


    }
    animate();
  }

  // THREE est chargé en defer — on attend qu'il soit dispo
  if (typeof THREE !== 'undefined') {
    initThreeStage();
  } else {
    window.addEventListener('load', initThreeStage);
  }

})();

/* ============================================================
   VERIFICATION SPOTIFY OAUTH — Plan technique V2
   ============================================================

   OBJECTIF : remplacer l'honor system du gate par une vérification
   réelle "est-ce que cet utilisateur suit Feel Vlone sur Spotify ?"

   ARCHITECTURE (zero backend — tout côté client via PKCE)
   --------------------------------------------------------
   1. Créer une app Spotify Developer
      → https://developer.spotify.com/dashboard
      → Récupérer le CLIENT_ID
      → Ajouter https://feelv.ch/ et https://feelv.ch/callback comme Redirect URIs
      → Scope nécessaire : "user-follow-read"

   2. Récupérer l'ARTIST_ID Feel Vlone
      → https://api.spotify.com/v1/search?q=Feel+Vlone&type=artist
      → noter l'id (ex: "1abc2def3ghi...")

   3. Flow PKCE (Proof Key for Code Exchange) — sécurisé sans backend :
      a) Générer un code_verifier aléatoire (43-128 char)
      b) En dériver un code_challenge (SHA256 + base64url)
      c) Rediriger user vers :
         https://accounts.spotify.com/authorize?
           client_id=CLIENT_ID
           &response_type=code
           &redirect_uri=https://feelv.ch/callback
           &scope=user-follow-read
           &code_challenge_method=S256
           &code_challenge=CODE_CHALLENGE
      d) Au retour, échanger le code contre un access_token via POST
         https://accounts.spotify.com/api/token (avec code_verifier)
      e) Avec l'access_token, appeler :
         https://api.spotify.com/v1/me/following/contains?type=artist&ids=ARTIST_ID
         → renvoie [true] ou [false]

   4. Si [true] → unlock("spotify-verified"). Sinon, message "tu ne me suis pas encore".

   CODE STARTER (à intégrer plus tard) :
   --------------------------------------------------------
   // const SPOTIFY_CLIENT_ID = 'xxxxxxxx';
   // const SPOTIFY_ARTIST_ID = 'yyyyyyyy';
   // const REDIRECT_URI = 'https://feelv.ch/callback';
   //
   // async function spotifyLogin() {
   //   const verifier = generateCodeVerifier(64);
   //   const challenge = await generateCodeChallenge(verifier);
   //   sessionStorage.setItem('spotify_verifier', verifier);
   //   const params = new URLSearchParams({
   //     client_id: SPOTIFY_CLIENT_ID,
   //     response_type: 'code',
   //     redirect_uri: REDIRECT_URI,
   //     scope: 'user-follow-read',
   //     code_challenge_method: 'S256',
   //     code_challenge: challenge,
   //   });
   //   location.href = `https://accounts.spotify.com/authorize?${params}`;
   // }
   //
   // async function spotifyCheck(token) {
   //   const r = await fetch(
   //     `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${SPOTIFY_ARTIST_ID}`,
   //     { headers: { 'Authorization': `Bearer ${token}` } }
   //   );
   //   const [follows] = await r.json();
   //   return follows; // true / false
   // }

   APPLE MUSIC & DEEZER
   --------------------------------------------------------
   - Apple Music : pas d'API publique pour "is this user following artist X".
     → Reste sur l'honor system pour cette plateforme.
   - Deezer : API "GET /user/me/artists" possible avec OAuth Deezer.
     → Même schéma que Spotify, doc : https://developers.deezer.com/api/oauth

   COÛTS
   --------------------------------------------------------
   Spotify Developer App : gratuit, illimité pour les use cases personnels.
   Deezer API : gratuit aussi.
   ============================================================ */

