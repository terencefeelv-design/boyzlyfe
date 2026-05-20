/* ============================================================
   FEELV — bOYz Lyf£ · script.js
   Interactions minimalistes. Hook prêt pour Three.js futur.
   ============================================================ */

(() => {
  'use strict';

  /* ============================================================
     I18N — FR (défaut) / DE / EN
     ------------------------------------------------------------
     Toute string traduisible porte data-i18n="<key>" dans le HTML.
     Au chargement, applyI18n(lang) parcourt et remplace.
     Choix utilisateur persisté dans localStorage("feelv_lang").
     ============================================================ */

  const I18N = {
    fr: {
      'nav.album': 'Album', 'nav.avib': 'A.VIB', 'nav.discog': 'Discographie',
      'nav.stats': 'Stats', 'nav.presskit': 'Press kit', 'nav.contact': 'Contact',

      'hero.tagline.pre': '« À travers le monde, pour la culture » · ',
      'hero.meta': 'Pre-save 01 — 06 — 2026 · Drop 05 — 06 — 2026',
      'hero.sub': 'Feel Vlone · singer / producer / beatmaker · biel-bienne, suisse',
      'hero.cta': 'Écouter le projet',
      'hero.quote': '« comme une impression d\'être fait pour ça, un controle sur rien »',

      'album.label': '01 — Le projet',
      'album.progressive': 'Sortie progressive — un nouveau titre toutes les deux semaines.',
      'album.stats.presave': 'Pre-save',
      'album.stats.drop': 'Drop',
      'album.stats.distri': 'Distribution',
      'album.stats.platforms': 'Choisis ta plateforme d\'écoute',
      'album.progressive.label': 'Visuel · sorties progressives',
      'album.progressive.sub': 'Utilisé toute l\'année 2025/2026 pour les drops bi-mensuels',

      'avib.label': '02 — Analyses A.VIB',
      'avib.intro': 'Concept propriétaire FEELV. Chaque morceau est scanné sur l\'échelle Power vs Force (0–1000) — la fréquence émotionnelle dominante au moment de la composition.',
      'avib.graph.caption': 'Trajectoire de l\'album · 16 tracks',
      'avib.graph.hint': '— passe la souris ou tape pour voir le détail · clic = fiche A.VIB',

      'discog.label': '03 — Discographie',
      'discog.tag.upcoming': 'À venir',
      'discog.tag.album': 'Album',

      'stats.label': '04 — Spotify · avril/mai 2026',
      'crew.label': '05 — Crew',
      'crew.role.artist': 'Rapper / Producer / Beatmaker',
      'crew.role.aka': 'aka Feel Vlone',
      'crew.role.ad': 'Artistic Direction',
      'crew.role.styling': 'Styling',
      'crew.role.mgmt': 'Management',

      'contact.label': '06 — Contact',
      'contact.download': 'Télécharger le press kit',

      'gate.title.lock': 'Stats réservées aux fans.',
      'gate.sub.lock': 'Pour découvrir les chiffres derrière FEELV, suis-moi sur ta plateforme préférée. Tu pourras ensuite débloquer la section.',
      'gate.follow': 'Suivre ↗',
      'gate.claim': 'Je suis déjà abonné →',
      'gate.note': '◇ Vérification automatique via Spotify (OAuth) — bientôt disponible.',
      'gate.title.confirm': 'Sur quelle plateforme me suis-tu ?',
      'gate.sub.confirm': 'Sélectionne où tu m\'écoutes — pour cette session, ta réponse débloque les stats. (Vérification automatique en V2.)',
      'gate.confirm': 'Confirmer →',
      'gate.back': '← Retour',
      'gate.verified.prefix': 'Vérifié — fan',

      'pk.back': '← Retour',
      'pk.stats': 'Statistiques Spotify', 'pk.audience': 'Audience',
      'pk.listeners-monthly': 'Listeners / mois',
      'pk.streams-28': 'Streams / 28 jours',
      'pk.followers': 'Followers',
      'pk.listeners-all': 'Listeners all-time',
      'pk.streams-peak': 'Streams / mois (peak)',
      'pk.tracks': 'Titres distribués',
      'pk.via-playlists': 'Découverte via playlists users',
      'pk.gender': 'Genre', 'pk.age': 'Âge dominant', 'pk.years': 'ans',
      'pk.top-country': 'Top pays #1',
      'pk.country.ch': 'Suisse', 'pk.country.it': 'Italie', 'pk.country.za': 'Afrique du Sud',
      'pk.discography': 'Discographie',

      'consent.title': 'Données & confidentialité.',
      'consent.body': 'feelv.ch est un site statique sans cookies de tracking ni analytics. Seules tes préférences (langue, gate fan) sont stockées dans ton navigateur.',
      'consent.learnmore': 'En savoir plus →',
      'consent.accept': 'J\'ai compris',
    },

    en: {
      'nav.album': 'Album', 'nav.avib': 'A.VIB', 'nav.discog': 'Discography',
      'nav.stats': 'Stats', 'nav.presskit': 'Press kit', 'nav.contact': 'Contact',

      'hero.tagline.pre': '« Across the world, for the culture » · ',
      'hero.meta': 'Pre-save 06.01.2026 · Drop 06.05.2026',
      'hero.sub': 'Feel Vlone · singer / producer / beatmaker · biel-bienne, switzerland',
      'hero.cta': 'Listen to the project',
      'hero.quote': '« like the impression of being made for this, a control on nothing »',

      'album.label': '01 — The project',
      'album.progressive': 'Progressive release — a new track every two weeks.',
      'album.stats.presave': 'Pre-save',
      'album.stats.drop': 'Drop',
      'album.stats.distri': 'Distribution',
      'album.stats.platforms': 'Choose your platform',
      'album.progressive.label': 'Visual · progressive releases',
      'album.progressive.sub': 'Used throughout 2025/2026 for bi-monthly drops',

      'avib.label': '02 — A.VIB Analyses',
      'avib.intro': 'Proprietary FEELV concept. Each track is scanned on the Power vs Force scale (0–1000) — the dominant emotional frequency at the moment of composition.',
      'avib.graph.caption': 'Album trajectory · 16 tracks',
      'avib.graph.hint': '— hover or tap to see details · click = A.VIB sheet',

      'discog.label': '03 — Discography',
      'discog.tag.upcoming': 'Upcoming',
      'discog.tag.album': 'Album',

      'stats.label': '04 — Spotify · April/May 2026',
      'crew.label': '05 — Crew',
      'crew.role.artist': 'Rapper / Producer / Beatmaker',
      'crew.role.aka': 'aka Feel Vlone',
      'crew.role.ad': 'Artistic Direction',
      'crew.role.styling': 'Styling',
      'crew.role.mgmt': 'Management',

      'contact.label': '06 — Contact',
      'contact.download': 'Download press kit',

      'gate.title.lock': 'Stats reserved for fans.',
      'gate.sub.lock': 'To discover the numbers behind FEELV, follow me on your favorite platform. You can then unlock this section.',
      'gate.follow': 'Follow ↗',
      'gate.claim': 'I\'m already subscribed →',
      'gate.note': '◇ Auto-verification via Spotify (OAuth) — coming soon.',
      'gate.title.confirm': 'Which platform are you following on?',
      'gate.sub.confirm': 'Select where you listen to me — your answer unlocks the stats. (Auto-verification in V2.)',
      'gate.confirm': 'Confirm →',
      'gate.back': '← Back',
      'gate.verified.prefix': 'Verified — fan',

      'pk.back': '← Back',
      'pk.stats': 'Spotify Statistics', 'pk.audience': 'Audience',
      'pk.listeners-monthly': 'Monthly listeners',
      'pk.streams-28': 'Streams / 28 days',
      'pk.followers': 'Followers',
      'pk.listeners-all': 'Listeners all-time',
      'pk.streams-peak': 'Monthly streams (peak)',
      'pk.tracks': 'Tracks distributed',
      'pk.via-playlists': 'Discovery via user playlists',
      'pk.gender': 'Gender', 'pk.age': 'Dominant age', 'pk.years': 'years',
      'pk.top-country': 'Top country #1',
      'pk.country.ch': 'Switzerland', 'pk.country.it': 'Italy', 'pk.country.za': 'South Africa',
      'pk.discography': 'Discography',

      'consent.title': 'Data & privacy.',
      'consent.body': 'feelv.ch is a static site without tracking cookies or analytics. Only your preferences (language, fan gate) are stored in your browser.',
      'consent.learnmore': 'Learn more →',
      'consent.accept': 'Got it',
    },

    de: {
      'nav.album': 'Album', 'nav.avib': 'A.VIB', 'nav.discog': 'Diskografie',
      'nav.stats': 'Stats', 'nav.presskit': 'Pressemappe', 'nav.contact': 'Kontakt',

      'hero.tagline.pre': '« Durch die Welt, für die Kultur » · ',
      'hero.meta': 'Pre-save 01.06.2026 · Drop 05.06.2026',
      'hero.sub': 'Feel Vlone · Sänger / Produzent / Beatmaker · biel-bienne, schweiz',
      'hero.cta': 'Das Projekt hören',
      'hero.quote': '« wie der Eindruck, dafür gemacht zu sein, eine Kontrolle über nichts »',

      'album.label': '01 — Das Projekt',
      'album.progressive': 'Progressive Release — alle zwei Wochen ein neuer Track.',
      'album.stats.presave': 'Pre-save',
      'album.stats.drop': 'Drop',
      'album.stats.distri': 'Distribution',
      'album.stats.platforms': 'Wähle deine Plattform',
      'album.progressive.label': 'Visual · Progressive Releases',
      'album.progressive.sub': '2025/2026 für die zweiwöchentlichen Drops verwendet',

      'avib.label': '02 — A.VIB Analysen',
      'avib.intro': 'FEELV-eigenes Konzept. Jeder Track wird auf der Power vs Force-Skala (0–1000) gescannt — die dominante emotionale Frequenz im Moment der Komposition.',
      'avib.graph.caption': 'Album-Trajektorie · 16 Tracks',
      'avib.graph.hint': '— Maus drüber oder tippen für Details · Klick = A.VIB-Karte',

      'discog.label': '03 — Diskografie',
      'discog.tag.upcoming': 'Kommend',
      'discog.tag.album': 'Album',

      'stats.label': '04 — Spotify · April/Mai 2026',
      'crew.label': '05 — Crew',
      'crew.role.artist': 'Rapper / Produzent / Beatmaker',
      'crew.role.aka': 'alias Feel Vlone',
      'crew.role.ad': 'Artistic Direction',
      'crew.role.styling': 'Styling',
      'crew.role.mgmt': 'Management',

      'contact.label': '06 — Kontakt',
      'contact.download': 'Pressemappe herunterladen',

      'gate.title.lock': 'Stats für Fans reserviert.',
      'gate.sub.lock': 'Um die Zahlen hinter FEELV zu entdecken, folge mir auf deiner bevorzugten Plattform. Du kannst dann diesen Bereich freischalten.',
      'gate.follow': 'Folgen ↗',
      'gate.claim': 'Ich folge bereits →',
      'gate.note': '◇ Automatische Überprüfung via Spotify (OAuth) — bald verfügbar.',
      'gate.title.confirm': 'Auf welcher Plattform folgst du mir?',
      'gate.sub.confirm': 'Wähle, wo du mich hörst — deine Antwort schaltet die Stats frei. (Automatische Überprüfung in V2.)',
      'gate.confirm': 'Bestätigen →',
      'gate.back': '← Zurück',
      'gate.verified.prefix': 'Verifiziert — Fan',

      'pk.back': '← Zurück',
      'pk.stats': 'Spotify-Statistiken', 'pk.audience': 'Publikum',
      'pk.listeners-monthly': 'Listener / Monat',
      'pk.streams-28': 'Streams / 28 Tage',
      'pk.followers': 'Followers',
      'pk.listeners-all': 'Listener gesamt',
      'pk.streams-peak': 'Streams / Monat (Peak)',
      'pk.tracks': 'Verteilte Tracks',
      'pk.via-playlists': 'Entdeckung via User-Playlisten',
      'pk.gender': 'Geschlecht', 'pk.age': 'Dominantes Alter', 'pk.years': 'Jahre',
      'pk.top-country': 'Top-Land #1',
      'pk.country.ch': 'Schweiz', 'pk.country.it': 'Italien', 'pk.country.za': 'Südafrika',
      'pk.discography': 'Diskografie',

      'consent.title': 'Daten & Datenschutz.',
      'consent.body': 'feelv.ch ist eine statische Seite ohne Tracking-Cookies oder Analytics. Nur deine Präferenzen (Sprache, Fan-Gate) werden in deinem Browser gespeichert.',
      'consent.learnmore': 'Mehr erfahren →',
      'consent.accept': 'Verstanden',
    },
  };

  const LANG_KEY = 'feelv_lang';

  function getLang() {
    let lang = null;
    try { lang = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (lang && I18N[lang]) return lang;
    // détection navigateur en fallback
    const nav = (navigator.language || 'fr').toLowerCase().slice(0, 2);
    return I18N[nav] ? nav : 'fr';
  }

  function applyI18n(lang) {
    if (!I18N[lang]) lang = 'fr';
    const dict = I18N[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  // Init au plus tôt
  applyI18n(getLang());

  // Click handlers
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => applyI18n(btn.dataset.lang));
  });

  /* ============================================================
     CONSENT BANNER (RGPD / nLPD)
     ------------------------------------------------------------
     Affiché au 1er visit. L'acceptation est stockée dans
     localStorage('feelv_consent'). Vu que le site n'utilise PAS
     de cookies tracking, c'est purement informatif + obligatoire.
     ============================================================ */

  const CONSENT_KEY = 'feelv_consent';

  function hasConsented() {
    try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; }
    catch (e) { return false; }
  }

  function setConsented() {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
  }

  function buildConsentBanner() {
    const dict = I18N[getLang()] || I18N.fr;
    const isLegal = window.location.pathname.includes('/legal/');
    const prefix = isLegal ? '' : (window.location.pathname.includes('/sons/') || window.location.pathname.includes('/press-kit/') ? '../' : '');

    const div = document.createElement('aside');
    div.className = 'consent';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Consentement aux données');
    div.innerHTML = `
      <div class="consent__icon">◐</div>
      <div class="consent__body">
        <strong data-i18n="consent.title">Données &amp; confidentialité.</strong>
        <span data-i18n="consent.body">
          feelv.ch est un site statique sans cookies de tracking ni analytics.
          Seules tes préférences (langue, gate fan) sont stockées dans ton navigateur.
        </span>
        <a href="${prefix}legal/privacy.html" data-i18n="consent.learnmore">En savoir plus →</a>
      </div>
      <div class="consent__actions">
        <button class="consent__btn consent__btn--primary" data-consent="accept" data-i18n="consent.accept">J'ai compris</button>
      </div>
    `;
    return div;
  }

  function showConsentIfNeeded() {
    if (hasConsented()) return;
    const banner = buildConsentBanner();
    document.body.appendChild(banner);
    // Re-applique i18n maintenant que le banner est dans le DOM
    applyI18n(getLang());

    banner.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-consent]');
      if (btn && btn.dataset.consent === 'accept') {
        setConsented();
        banner.classList.add('is-hiding');
        setTimeout(() => banner.remove(), 400);
      }
    });
  }

  // Affiche le banner après que la page soit chargée pour ne pas casser le rendu initial
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showConsentIfNeeded);
  } else {
    showConsentIfNeeded();
  }

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

