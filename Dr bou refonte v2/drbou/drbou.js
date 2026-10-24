/* Dr Bou : lecteur d'animations. JavaScript natif, aucune dépendance. Mode d'emploi : LISEZMOI.html.

   const bou = await DrBou.creer("#drbou", {animations: "drbou/animations.json", taille: 200});
   bou.jouer("parler");                      // file d'attente : chaque appel attend la fin du précédent
   bou.jouer("montrer_gauche", {tours: 5});  // tours de l'étape réglable
   bou.voler(document.querySelector("#cible"));   // décolle, vole jusqu'à l'élément, atterrit
   bou.vitesse(1.5);                         // réglage global
   bou.on("fin", e => console.log(e.nom));   // événements : pret, debut, clip, fin, repos
*/
(function (global) {
  "use strict";
  const VIDE = "data:image/gif";            // ce que window.__PH renvoie pour une image db_ pas encore arrivée
  const pause = ms => new Promise(r => setTimeout(r, ms));
  const nomImage = (c, k) => c.prefixe + String(k).padStart(3, "0") + ".webp";
  const adoucir = p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

  function lireDataUrl(u) {
    const i = u.indexOf(","), tete = u.slice(0, i), corps = u.slice(i + 1);
    if (/;base64$/.test(tete)) {
      const b = atob(corps), o = new Uint8Array(b.length);
      for (let k = 0; k < b.length; k++) o[k] = b.charCodeAt(k);
      return new TextDecoder().decode(o);
    }
    return decodeURIComponent(corps);
  }

  // demande l'adresse d'une image à la fonction fournie, en attendant tant qu'elle renvoie l'image vide
  async function resoudre(fn, nom, version, delaiMax) {
    const t0 = Date.now();
    for (;;) {
      const u = fn(nom, version);
      if (u && !String(u).startsWith(VIDE)) return String(u);
      if (Date.now() - t0 > delaiMax) throw new Error("Dr Bou : image introuvable : " + nom);
      await pause(250);
    }
  }

  function chargerImage(url) {
    return new Promise((ok, ko) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => ok(im);
      im.onerror = () => ko(new Error("Dr Bou : image illisible : " + url.slice(0, 80)));
      im.src = url;
    });
  }

  class DrBou {
    /* conteneur : élément ou sélecteur ; il devient le cadre de la neutre (taille x taille px), Dr Bou en déborde.
       options : animations (adresse du JSON, ou l'objet lui-même), image (fonction nom, version -> adresse ; par défaut le
       fichier à côté du JSON ; sur le site : n => window.__PH(n)), version (1x, 2x, site ; par défaut selon l'écran),
       taille (px CSS du cadre de la neutre), vitesse, repos (true/false), prechargerTout, delaiMax (ms). */
    static async creer(conteneur, options) {
      const o = Object.assign({animations: "animations.json", image: null, version: null, taille: 200, vitesse: 1,
                               repos: true, prechargerTout: true, delaiMax: 120000}, options || {});
      let d = o.animations, base = "";
      if (typeof d === "string") {
        if (o.image) {           // le JSON passe par la même fonction que les images (db_animations.json sur le site)
          const u = await resoudre(o.image, d, null, o.delaiMax);
          d = u.startsWith("data:") ? JSON.parse(lireDataUrl(u)) : await (await fetch(u)).json();
        } else {
          base = d.slice(0, d.lastIndexOf("/") + 1);
          try {
            const r = await fetch(d, {cache: "no-cache"});
            if (!r.ok) throw new Error("HTTP " + r.status);
            d = await r.json();
          } catch (e) {
            if (global.DRBOU_ANIMATIONS) d = global.DRBOU_ANIMATIONS;   // ouverture par double-clic : animations.js
            else throw new Error("Dr Bou : lecture impossible de " + o.animations + " (" + e.message + ")");
          }
        }
      }
      if (!o.image) o.image = (nom, v) => base + d.versions[v].dossier + "/" + nom;
      const bou = new DrBou(conteneur, d, o);
      await bou.precharger(["neutre"]);
      bou._dessiner("neutre", 0);
      bou._emettre("pret", {version: bou.version});
      bou._planifierRepos();
      if (o.prechargerTout) bou.precharger(Object.keys(d.clips)).catch(e => console.warn(e));
      return bou;
    }

    constructor(conteneur, d, o) {
      this.el = typeof conteneur === "string" ? document.querySelector(conteneur) : conteneur;
      if (!this.el) throw new Error("Dr Bou : conteneur introuvable");
      this.d = d; this.o = o; this.reglage = o.vitesse; this.images = {}; this.chargements = {}; this.ecouteurs = {};
      this._file = []; this._encours = null; this._couper = false; this.pose = "neutre"; this._tx = 0; this._ty = 0;
      const R = d.repere, vs = d.versions, dpr = global.devicePixelRatio || 1;
      this.echelle = o.taille / R.hauteur;                       // px CSS par px du repère
      this.version = o.version || d.version_par_defaut || (this.echelle * dpr > 1.05 && vs["2x"] ? "2x" : "1x");
      if (!vs[this.version]) throw new Error("Dr Bou : version inconnue : " + this.version);
      let x0 = 0, y0 = 0, x1 = R.largeur, y1 = R.hauteur;       // zone couverte par tous les clips, dans le repère
      for (const c of Object.values(d.clips)) {
        const e = c.ancre.echelle || 1, l = -c.ancre.x / e, t = -c.ancre.y / e;
        x0 = Math.min(x0, l); y0 = Math.min(y0, t); x1 = Math.max(x1, l + c.largeur / e); y1 = Math.max(y1, t + c.hauteur / e);
      }
      this.zone = {x0, y0, x1, y1};
      if (getComputedStyle(this.el).position === "static") this.el.style.position = "relative";
      this.el.style.width = R.largeur * this.echelle + "px";
      this.el.style.height = R.hauteur * this.echelle + "px";
      const cv = this.canvas = document.createElement("canvas");
      this.r = Math.min(this.echelle * dpr, vs[this.version].facteur);   // px du canvas par px du repère
      cv.width = Math.ceil((x1 - x0) * this.r);
      cv.height = Math.ceil((y1 - y0) * this.r);
      Object.assign(cv.style, {position: "absolute", left: x0 * this.echelle + "px", top: y0 * this.echelle + "px",
        width: (x1 - x0) * this.echelle + "px", height: (y1 - y0) * this.echelle + "px", pointerEvents: "none", maxWidth: "none"});
      cv.setAttribute("role", "img");
      cv.setAttribute("aria-label", "Dr Bou");
      this.el.appendChild(cv);
      this.ctx = cv.getContext("2d");
    }

    precharger(noms) {
      return Promise.all(noms.map(n => {
        if (!this.chargements[n]) {
          const c = this.d.clips[n];
          if (!c) return Promise.reject(new Error("Dr Bou : clip inconnu : " + n));
          this.images[n] = new Array(c.images);
          this.chargements[n] = Promise.all(Array.from({length: c.images}, (_, k) =>
            resoudre(this.o.image, nomImage(c, k), this.version, this.o.delaiMax).then(chargerImage).then(im => { this.images[n][k] = im; })));
        }
        return this.chargements[n];
      }));
    }

    _dessiner(n, k) {
      const c = this.d.clips[n], im = this.images[n] && this.images[n][k];
      if (!im) return;
      const e = c.ancre.echelle || 1, ctx = this.ctx, cv = this.canvas;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(this.r, 0, 0, this.r, -this.zone.x0 * this.r, -this.zone.y0 * this.r);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(im, -c.ancre.x / e, -c.ancre.y / e, c.largeur / e, c.hauteur / e);
      this.image = {clip: n, k};
    }

    // joue un enchaînement nommé ; options : tours, vitesse, repetitions. Renvoie une promesse tenue à la fin.
    jouer(nom, opts) {
      if (!this.d.enchainements[nom]) return Promise.reject(new Error("Dr Bou : enchaînement inconnu : " + nom));
      return new Promise(ok => { this._file.push({nom, opts: opts || {}, ok}); this._suivant(); });
    }

    // met plusieurs enchaînements en file : ["parler", {nom: "montrer_droite", tours: 2}]
    enchainer(liste) {
      return Promise.all(liste.map(x => typeof x === "string" ? this.jouer(x) : this.jouer(x.nom, x))).then(() => undefined);
    }

    /* vole jusqu'à une cible : un élément de la page (Dr Bou se pose centré dessus) ou {x, y} (coin haut gauche du cadre
       de la neutre, en px de la page). options : nom (voler_gauche ou voler_droite ; par défaut selon le sens du trajet),
       duree (s, durée du trajet : le nombre de tours de battement en découle) ou tours, vitesse. */
    voler(cible, opts) {
      return new Promise(ok => { this._file.push({nom: null, opts: Object.assign({}, opts, {cible}), ok}); this._suivant(); });
    }

    // vide la file ; l'enchaînement en cours s'arrête dès que Dr Bou est revenu sur la neutre (un vol va jusqu'au bout)
    arreter() {
      this._file.splice(0).forEach(t => t.ok());
      this._couper = !!this._encours;
    }

    vitesse(v) { if (v != null) this.reglage = Math.max(0.05, Number(v)); return this.reglage; }
    repos(actif) { this.o.repos = !!actif; this._planifierRepos(); }
    remettreEnPlace() { this._tx = this._ty = 0; this.el.style.transform = ""; }
    etat() { return {enchainement: this._encours && this._encours.nom, file: this._file.length, pose: this.pose, version: this.version, vitesse: this.reglage}; }
    on(evt, fn) { (this.ecouteurs[evt] = this.ecouteurs[evt] || []).push(fn); return this; }
    off(evt, fn) { this.ecouteurs[evt] = (this.ecouteurs[evt] || []).filter(f => f !== fn); return this; }
    detruire() { clearTimeout(this._horloge); clearTimeout(this._minuterie); this._file = []; this.canvas.remove(); }

    _emettre(evt, det) {
      (this.ecouteurs[evt] || []).forEach(f => { try { f(det); } catch (e) { console.error(e); } });
      this.el.dispatchEvent(new CustomEvent("drbou:" + evt, {detail: det}));
    }

    async _suivant() {
      if (this._encours) return;
      const t = this._file.shift();
      if (!t) { this._auRepos(); return; }
      clearTimeout(this._minuterie);
      this._encours = t;
      try {
        let dep = null;
        if (t.opts.cible) {
          const r = this.el.getBoundingClientRect(), c = t.opts.cible;
          let x, y;
          if (c instanceof Element) {
            const q = c.getBoundingClientRect();
            x = q.left + (q.width - r.width) / 2; y = q.top + (q.height - r.height) / 2;
          } else { x = c.x - global.scrollX; y = c.y - global.scrollY; }
          dep = {dx: x - r.left, dy: y - r.top, x0: this._tx, y0: this._ty};
          t.nom = t.opts.nom || (dep.dx >= 0 ? "voler_droite" : "voler_gauche");
        }
        const plan = this._plan(t.nom, t.opts, dep);
        await this.precharger(plan.clips);
        this._emettre("debut", {nom: t.nom, repos: !!t.opts.repos});
        await this._lire(plan);
        this._emettre("fin", {nom: t.nom, repos: !!t.opts.repos});
      } catch (e) { console.error(e); }
      this._encours = null;
      t.ok();
      this._suivant();
    }

    _ips(c, vit) { return this.d.images_par_seconde * (this.d.vitesse || 1) * this.reglage * vit * (c.vitesse || 1); }

    _plan(nom, opts, dep) {
      const E = this.d.enchainements[nom];
      if (!E) throw new Error("Dr Bou : enchaînement inconnu : " + nom);
      const images = [], clips = new Set(), vit = opts.vitesse != null ? opts.vitesse : (E.vitesse || 1);
      let pose = this.pose;
      for (let r = 0; r < (opts.repetitions || E.repetitions || 1); r++) {
        for (const e of E.etapes) {
          const n = e.clip || e.choix[Math.floor(Math.random() * e.choix.length)], c = this.d.clips[n];
          if (!c) throw new Error("Dr Bou : clip inconnu : " + n);
          let tours = e.tours || 1;
          if (e.tours_variables && opts.tours != null) tours = Math.max(1, Math.round(opts.tours));
          if (e.deplacement && dep && opts.duree) tours = Math.max(1, Math.round(opts.duree * this._ips(c, vit) / c.images));
          if (pose && c.debut !== pose) console.warn("Dr Bou : " + n + " commence sur " + c.debut + ", la pose courante est " + pose);
          clips.add(n);
          for (let t = 0; t < tours; t++) for (let k = 0; k < c.images; k++) images.push({clip: n, k, dep: !!(e.deplacement && dep)});
          pose = c.fin;
        }
      }
      const idx = [];
      images.forEach((f, i) => { if (f.dep) idx.push(i); });
      idx.forEach((i, j) => { images[i].p = (j + 1) / idx.length; });
      return {nom, images, clips: [...clips], vitesse: vit, dep};
    }

    _placer(dep, p) {
      const e = adoucir(p);
      this._tx = dep.x0 + dep.dx * e; this._ty = dep.y0 + dep.dy * e;
      this.el.style.transform = "translate(" + this._tx + "px, " + this._ty + "px)";
    }

    // horloge réelle : si le navigateur prend du retard, des images sont sautées pour garder la durée exacte
    _lire(plan) {
      return new Promise(fin => {
        let i = 0, echeance = performance.now();
        const N = plan.images.length;
        const tic = () => {
          const now = performance.now();
          let f = null;
          while (now >= echeance) {
            if (i >= N || (this._couper && !plan.dep && this.pose === "neutre" && i > 0)) {
              this._couper = false;
              if (plan.dep) this._placer(plan.dep, 1);
              fin();
              return;
            }
            f = plan.images[i];
            const c = this.d.clips[f.clip];
            if (f.k === 0) this._emettre("clip", {nom: plan.nom, clip: f.clip});
            this.pose = f.k === c.images - 1 ? c.fin : null;
            echeance += 1000 / this._ips(c, plan.vitesse);
            i++;
          }
          if (f) { this._dessiner(f.clip, f.k); if (f.dep) this._placer(plan.dep, f.p); }
          this._horloge = setTimeout(tic, Math.max(0, echeance - performance.now()));
        };
        tic();
      });
    }

    _auRepos() {
      this._dessiner("neutre", 0);
      this.pose = "neutre";
      this._emettre("repos", {});
      this._planifierRepos();
    }

    _planifierRepos() {
      clearTimeout(this._minuterie);
      const R = this.d.repos;
      if (!this.o.repos || !R || R.actif === false || this._encours || this._file.length) return;
      const s = R.pause_min_s + Math.random() * Math.max(0, R.pause_max_s - R.pause_min_s);
      this._minuterie = setTimeout(() => { if (!this._encours && !this._file.length) this.jouer(R.enchainement, {repos: true}); }, s * 1000);
    }
  }

  global.DrBou = DrBou;
})(typeof window !== "undefined" ? window : this);
