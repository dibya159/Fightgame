/**
 * ============================================================================
 * DOSTO SHOWDOWN - ULTIMATE MODULAR BRIDGE SYSTEM v2.5 (dosto-bridge.js)
 * ============================================================================
 * Features:
 * - Firebase Realtime Database Config (Room Code multiplayer anywhere on Web/GitHub)
 * - Naye characters & PNG sprites override
 * - Arenas & Event system
 */

window.DostoBridge = {
  version: "2.5.0",
  devMode: false,

  // ==========================================
  // 1. FIREBASE REALTIME DATABASE CONFIG
  // ==========================================
  // Apne Firebase Console (https://console.firebase.google.com/) se
  // Project Settings -> Web App banakar config copy karke yahan paste karein:
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },

  // ==========================================
  // 2. CHARACTER REGISTRY & CUSTOMIZATIONS
  // ==========================================
  characters: {
    0: {
      n: 'DIBYA',
      skin: '#d49e72',
      top: '#f4ede4',
      pants: '#252936',
      hair: '#121110',
      h: 1.02,
      sp: 168,
      sup: '133 Push-Up Boom',
      spriteUrl: null // Example: "assets/dibya.png"
    },
    1: {
      n: 'AJAY',
      skin: '#c68c62',
      top: '#14171d',
      pants: '#090c10',
      hair: '#141212',
      acc: 'tall',
      h: 1.20,
      sp: 152,
      sup: 'Sky-Drop Roast',
      spriteUrl: null // Example: "assets/ajay.png"
    }
  },

  // Extra Characters slots (Future characters inject karne ke liye)
  customNewCharacters: [],

  // Custom Stages
  customStages: [],

  // Preloaded sprites
  sprites: {},

  init() {
    console.log(`%c[DostoBridge v${this.version}] Active & Ready`, "color:#fbbf24;font-weight:bold;font-size:12px;");
    this.preloadSprites();
  },

  preloadSprites() {
    for (const id in this.characters) {
      const char = this.characters[id];
      if (char.spriteUrl) this.loadSprite(id, char.spriteUrl);
    }
    this.customNewCharacters.forEach((char, idx) => {
      if (char.spriteUrl) this.loadSprite('custom_' + idx, char.spriteUrl);
    });
  },

  loadSprite(id, url) {
    const img = new Image();
    img.src = url;
    this.sprites[id] = img;
  },

  patchEngine(CH, ST) {
    for (const id in this.characters) {
      if (CH[id]) Object.assign(CH[id], this.characters[id]);
    }
    if (this.customNewCharacters.length > 0) {
      this.customNewCharacters.forEach(c => CH.push(c));
    }
    if (this.customStages.length > 0) {
      this.customStages.forEach(s => ST.push(s));
    }
  },

  renderCustomSprite(ctx, fighter, x, y, time) {
    const charId = fighter.ci;
    const sprite = this.sprites[charId];
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      const s = fighter.ch.h * 0.9;
      ctx.save();
      ctx.translate(x, y - fighter.j);
      ctx.scale(fighter.dir * s, s);
      if (fighter.st === 'hit') ctx.filter = 'brightness(2.2) contrast(1.2)';
      else if (fighter.st === 'super') ctx.filter = 'drop-shadow(0 0 14px #f59e0b) brightness(1.2)';
      else if (fighter.st === 'ko') ctx.filter = 'grayscale(0.8) opacity(0.8)';

      const w = 90, h = 130;
      ctx.drawImage(sprite, -w / 2, -h, w, h);
      ctx.restore();
      return true;
    }
    return false;
  },

  events: {
    onRoundStart(roundNum) {},
    onHit(attacker, victim, damage) {},
    onSuperMove(fighter, moveName) {},
    onKOScreen(winner, loser) {}
  }
};

window.DostoBridge.init();
