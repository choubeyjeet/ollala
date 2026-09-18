/* =========================================================
   GLOBAL GAME VARIABLES
========================================================= */

let game = null;
let gameScene = null;

let targetImageURL = null;

/* =========================================================
   GAME STATE
========================================================= */

const gameState = {
  score: 0,

  combo: 0,

  health: 100,

  attacking: false,
};

/* =========================================================
   PHASER SCENE
========================================================= */

class FightScene extends Phaser.Scene {
  constructor() {
    super({
      key: "FightScene",
    });
  }

  /* =====================================================
       PRELOAD
    ===================================================== */

  preload() {
    if (targetImageURL) {
      this.load.image("uploadedTarget", targetImageURL);
    }
  }

  /* =====================================================
       CREATE
    ===================================================== */

  create() {
    gameScene = this;

    gameState.score = 0;
    gameState.combo = 0;
    gameState.health = 100;
    gameState.attacking = false;

    this.createBackground();

    this.createTarget();

    this.createWeapons();

    this.createEffects();

    this.updateUI();

    this.setupKeyboard();
  }

  /* =====================================================
       BACKGROUND
    ===================================================== */

  createBackground() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Main background

    this.add.rectangle(
      width / 2,
      height / 2,

      width,
      height,

      0x111827,
    );

    // Background glow

    this.add.circle(
      width / 2,
      height / 2,

      280,

      0x1e3a5f,

      0.18,
    );

    // Court floor

    this.add.rectangle(
      width / 2,
      height - 75,

      width,
      150,

      0x172033,
    );

    // Floor line

    this.add.rectangle(
      width / 2,
      height - 150,

      width,
      3,

      0x475569,
    );

    // Center court circle

    this.add
      .circle(
        width / 2,
        height - 75,

        145,

        0xffffff,
        0,
      )
      .setStrokeStyle(3, 0x475569, 0.65);

    // Basketball decorations

    this.add
      .text(
        90,
        height - 90,

        "🏀",

        {
          fontSize: "55px",
        },
      )
      .setAlpha(0.35);

    this.add
      .text(
        width - 90,
        height - 90,

        "🏀",

        {
          fontSize: "55px",
        },
      )
      .setAlpha(0.35);

    // Shoes decoration

    this.add
      .text(
        width / 2 - 50,
        height - 55,

        "👟",

        {
          fontSize: "38px",
        },
      )
      .setAlpha(0.25);
  }

  /* =====================================================
       TARGET
    ===================================================== */

  createTarget() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.targetX = width / 2;

    this.targetY = height / 2 + 35;

    if (targetImageURL) {
      this.target = this.add.image(
        this.targetX,
        this.targetY,

        "uploadedTarget",
      );

      this.resizeTarget();
    } else {
      this.target = this.add
        .text(
          this.targetX,
          this.targetY,

          "👤",

          {
            fontSize: "230px",
          },
        )
        .setOrigin(0.5);
    }

    this.target.setDepth(10);
  }

  /* =====================================================
       TARGET SIZE
    ===================================================== */

  resizeTarget() {
    const maxWidth = 320;

    const maxHeight = 410;

    const scaleX = maxWidth / this.target.width;

    const scaleY = maxHeight / this.target.height;

    const scale = Math.min(scaleX, scaleY, 1);

    this.target.setScale(scale);
  }

  /* =====================================================
       WEAPONS
    ===================================================== */

  createWeapons() {
    const width = this.scale.width;
    const height = this.scale.height;

    /* -----------------------------
           FIST
        ----------------------------- */

    this.fist = this.add
      .text(
        width / 2 - 330,
        this.targetY,

        "👊",

        {
          fontSize: "100px",
        },
      )
      .setOrigin(0.5)
      .setDepth(30)
      .setAlpha(0);

    /* -----------------------------
           KICK
        ----------------------------- */

    this.foot = this.add
      .text(
        width / 2 - 280,
        height - 150,

        "🦵",

        {
          fontSize: "110px",
        },
      )
      .setOrigin(0.5)
      .setDepth(30)
      .setAlpha(0);

    /* -----------------------------
           SHOES
        ----------------------------- */

    this.shoe = this.add
      .text(
        width / 2 - 280,
        height - 150,

        "👟",

        {
          fontSize: "115px",
        },
      )
      .setOrigin(0.5)
      .setDepth(30)
      .setAlpha(0);

    /* -----------------------------
           BASKETBALL
        ----------------------------- */

    this.ball = this.add
      .text(
        width / 2 - 330,
        this.targetY - 100,

        "🏀",

        {
          fontSize: "100px",
        },
      )
      .setOrigin(0.5)
      .setDepth(30)
      .setAlpha(0);

    /* -----------------------------
           STICK
        ----------------------------- */

    this.stick = this.add
      .text(
        width / 2 - 310,
        this.targetY,

        "🪵",

        {
          fontSize: "120px",
        },
      )
      .setOrigin(0.5)
      .setDepth(30)
      .setAlpha(0);
  }

  /* =====================================================
       EFFECTS
    ===================================================== */

  createEffects() {
    /* -----------------------------
           IMPACT
        ----------------------------- */

    this.impact = this.add
      .text(
        this.targetX,
        this.targetY,

        "💥",

        {
          fontSize: "100px",
        },
      )
      .setOrigin(0.5)
      .setDepth(60)
      .setAlpha(0);

    /* -----------------------------
           OLLALA STICKER
        ----------------------------- */

    this.ollala = this.add
      .text(
        this.targetX,
        this.targetY - 180,

        "OLLALA! 😜",

        {
          fontSize: "55px",
          fontStyle: "bold",

          color: "#ff1744",

          stroke: "#ffffff",

          strokeThickness: 8,
        },
      )
      .setOrigin(0.5)
      .setDepth(70)
      .setAlpha(0);

    /* -----------------------------
           STAR EFFECTS
        ----------------------------- */

    this.stars = [];

    for (let i = 0; i < 8; i++) {
      const star = this.add
        .text(
          this.targetX,
          this.targetY,

          "⭐",

          {
            fontSize: Phaser.Math.Between(18, 35),
          },
        )
        .setOrigin(0.5)
        .setDepth(65)
        .setAlpha(0);

      this.stars.push(star);
    }
  }

  /* =====================================================
       PUNCH
    ===================================================== */

  punch() {
    if (gameState.attacking || gameState.health <= 0) {
      return;
    }

    gameState.attacking = true;

    const startX = this.scale.width / 2 - 330;

    const startY = this.targetY;

    this.fist.setPosition(startX, startY);

    this.fist.setScale(0.8);

    this.fist.setAlpha(1);

    this.tweens.add({
      targets: this.fist,

      x: this.targetX - 80,

      scale: 1.15,

      duration: 180,

      ease: "Power2",

      onComplete: () => {
        this.hit(10, "PUNCH");

        this.tweens.add({
          targets: this.fist,

          x: startX,

          scale: 0.8,

          duration: 220,

          onComplete: () => {
            this.fist.setAlpha(0);

            gameState.attacking = false;
          },
        });
      },
    });
  }

  /* =====================================================
       KICK
    ===================================================== */

  kick() {
    if (gameState.attacking || gameState.health <= 0) {
      return;
    }

    gameState.attacking = true;

    const startX = this.scale.width / 2 - 280;

    const startY = this.scale.height - 150;

    this.foot.setPosition(startX, startY);

    this.foot.setAlpha(1);

    this.tweens.add({
      targets: this.foot,

      x: this.targetX - 50,

      y: this.targetY + 80,

      angle: 25,

      duration: 220,

      ease: "Power2",

      onComplete: () => {
        this.hit(15, "KICK");

        this.tweens.add({
          targets: this.foot,

          x: startX,

          y: startY,

          angle: 0,

          duration: 230,

          onComplete: () => {
            this.foot.setAlpha(0);

            gameState.attacking = false;
          },
        });
      },
    });
  }

  /* =====================================================
       SHOES
    ===================================================== */

  shoesAttack() {
    if (gameState.attacking || gameState.health <= 0) {
      return;
    }

    gameState.attacking = true;

    const startX = this.scale.width / 2 - 280;

    const startY = this.scale.height - 150;

    this.shoe.setPosition(startX, startY);

    this.shoe.setAlpha(1);

    this.tweens.add({
      targets: this.shoe,

      x: this.targetX,

      y: this.targetY,

      angle: 720,

      scale: 1.2,

      duration: 420,

      ease: "Back.easeOut",

      onComplete: () => {
        this.hit(20, "SHOES");

        this.tweens.add({
          targets: this.shoe,

          x: startX,

          y: startY,

          angle: 0,

          scale: 1,

          duration: 280,

          onComplete: () => {
            this.shoe.setAlpha(0);

            gameState.attacking = false;
          },
        });
      },
    });
  }

  /* =====================================================
       BASKETBALL
    ===================================================== */

  basketballAttack() {
    if (gameState.attacking || gameState.health <= 0) {
      return;
    }

    gameState.attacking = true;

    const startX = this.scale.width / 2 - 330;

    const startY = this.targetY - 100;

    this.ball.setPosition(startX, startY);

    this.ball.setAlpha(1);

    this.tweens.add({
      targets: this.ball,

      x: this.targetX,

      y: this.targetY,

      angle: 720,

      duration: 500,

      ease: "Power2",

      onComplete: () => {
        this.hit(25, "BASKETBALL");

        this.tweens.add({
          targets: this.ball,

          x: startX,

          y: startY,

          duration: 300,

          onComplete: () => {
            this.ball.setAlpha(0);

            gameState.attacking = false;
          },
        });
      },
    });
  }

  /* =====================================================
       STICK
    ===================================================== */

  stickAttack() {
    if (gameState.attacking || gameState.health <= 0) {
      return;
    }

    gameState.attacking = true;

    const startX = this.scale.width / 2 - 300;

    this.stick.setPosition(startX, this.targetY);

    this.stick.setAlpha(1);

    this.tweens.add({
      targets: this.stick,

      x: this.targetX,

      angle: 85,

      duration: 250,

      ease: "Power2",

      onComplete: () => {
        this.hit(30, "STICK");

        this.tweens.add({
          targets: this.stick,

          x: startX,

          angle: 0,

          duration: 250,

          onComplete: () => {
            this.stick.setAlpha(0);

            gameState.attacking = false;
          },
        });
      },
    });
  }

  /* =====================================================
       HIT
    ===================================================== */

  hit(damage, action) {
    gameState.health -= damage;

    if (gameState.health < 0) {
      gameState.health = 0;
    }

    gameState.score += damage;

    gameState.combo++;

    this.updateUI();

    // Target reaction

    this.targetReaction();

    // Impact

    this.showImpact();

    // Ollala

    this.showOllala();

    // Stars

    this.showStars();

    // Damage number

    this.showDamage(damage, action);

    // Camera shake

    this.cameras.main.shake(140, 0.012);

    // Game over

    if (gameState.health <= 0) {
      this.gameOver();
    }
  }

  /* =====================================================
       TARGET REACTION
    ===================================================== */

  targetReaction() {
    if (!this.target) return;

    const originalX = this.targetX;

    const originalY = this.targetY;

    this.tweens.add({
      targets: this.target,

      x: originalX + 35,

      y: originalY - 8,

      angle: -8,

      duration: 65,

      yoyo: true,

      repeat: 3,

      ease: "Sine.easeInOut",

      onComplete: () => {
        this.target.setPosition(originalX, originalY);

        this.target.setAngle(0);
      },
    });
  }

  /* =====================================================
       IMPACT
    ===================================================== */

  showImpact() {
    this.impact.setPosition(this.targetX, this.targetY);

    this.impact.setScale(0.2);

    this.impact.setAlpha(1);

    this.tweens.add({
      targets: this.impact,

      scale: 1.5,

      alpha: 0,

      duration: 350,

      ease: "Back.easeOut",
    });
  }

  /* =====================================================
       OLLALA STICKER
    ===================================================== */

  showOllala() {
    this.ollala.setPosition(
      this.targetX + Phaser.Math.Between(-20, 20),

      this.targetY - 170,
    );

    this.ollala.setAlpha(1);

    this.ollala.setScale(0.35);

    this.ollala.setAngle(Phaser.Math.Between(-7, 7));

    this.tweens.add({
      targets: this.ollala,

      scale: 1.1,

      y: this.targetY - 225,

      alpha: 0,

      duration: 650,

      ease: "Back.easeOut",
    });
  }

  /* =====================================================
       STARS
    ===================================================== */

  showStars() {
    this.stars.forEach((star, index) => {
      const angle = ((Math.PI * 2) / this.stars.length) * index;

      const distance = Phaser.Math.Between(70, 130);

      star.setPosition(this.targetX, this.targetY);

      star.setAlpha(1);

      star.setScale(0.4);

      this.tweens.add({
        targets: star,

        x: this.targetX + Math.cos(angle) * distance,

        y: this.targetY + Math.sin(angle) * distance,

        scale: 1,

        alpha: 0,

        duration: 500,

        ease: "Power2",
      });
    });
  }

  /* =====================================================
       DAMAGE TEXT
    ===================================================== */

  showDamage(damage, action) {
    const x = this.targetX + Phaser.Math.Between(-50, 50);

    const y = this.targetY - 30;

    const damageText = this.add
      .text(
        x,
        y,

        "-" + damage,

        {
          fontSize: "36px",

          fontStyle: "bold",

          color: "#facc15",

          stroke: "#000000",

          strokeThickness: 5,
        },
      )
      .setOrigin(0.5)
      .setDepth(80);

    this.tweens.add({
      targets: damageText,

      y: y - 100,

      scale: 1.3,

      alpha: 0,

      duration: 650,

      onComplete: () => {
        damageText.destroy();
      },
    });
  }

  /* =====================================================
       GAME OVER
    ===================================================== */

  gameOver() {
    const width = this.scale.width;

    const height = this.scale.height;

    const overlay = this.add
      .rectangle(
        width / 2,
        height / 2,

        520,
        250,

        0x050505,

        0.95,
      )
      .setDepth(100);

    overlay.setStrokeStyle(3, 0xef4444);

    this.add
      .text(
        width / 2,
        height / 2 - 65,

        "OLLALA! 😵",

        {
          fontSize: "58px",

          fontStyle: "bold",

          color: "#facc15",

          stroke: "#000000",

          strokeThickness: 7,
        },
      )
      .setOrigin(0.5)
      .setDepth(101);

    this.add
      .text(
        width / 2,
        height / 2 + 5,

        "TARGET KNOCKED OUT!",

        {
          fontSize: "24px",

          fontStyle: "bold",

          color: "#ffffff",
        },
      )
      .setOrigin(0.5)
      .setDepth(101);

    this.add
      .text(
        width / 2,
        height / 2 + 50,

        "Final Score: " + gameState.score,

        {
          fontSize: "24px",

          color: "#38bdf8",
        },
      )
      .setOrigin(0.5)
      .setDepth(101);
  }

  /* =====================================================
       RESET
    ===================================================== */

  resetGame() {
    gameState.score = 0;

    gameState.combo = 0;

    gameState.health = 100;

    gameState.attacking = false;

    this.scene.restart();
  }

  /* =====================================================
       KEYBOARD
    ===================================================== */

  setupKeyboard() {
    this.input.keyboard.on("keydown-P", () => this.punch());

    this.input.keyboard.on("keydown-K", () => this.kick());

    this.input.keyboard.on("keydown-S", () => this.shoesAttack());

    this.input.keyboard.on("keydown-B", () => this.basketballAttack());

    this.input.keyboard.on("keydown-T", () => this.stickAttack());
  }

  /* =====================================================
       UPDATE UI
    ===================================================== */

  updateUI() {
    document.getElementById("scoreDisplay").innerText = gameState.score + " 🏆";

    document.getElementById("comboDisplay").innerText =
      "x" + gameState.combo + " 🔥";

    document.getElementById("healthDisplay").innerText = gameState.health + "%";

    const healthBar = document.getElementById("healthBar");

    healthBar.style.width = gameState.health + "%";

    if (gameState.health <= 30) {
      healthBar.style.background = "#ef4444";
    } else if (gameState.health <= 60) {
      healthBar.style.background = "#f59e0b";
    } else {
      healthBar.style.background = "linear-gradient(90deg,#22c55e,#84cc16)";
    }
  }
}

/* =========================================================
   PHASER CONFIG
========================================================= */

const config = {
  type: Phaser.AUTO,

  width: 1100,

  height: 700,

  parent: "game-container",

  backgroundColor: "#111827",

  scale: {
    mode: Phaser.Scale.FIT,

    autoCenter: Phaser.Scale.CENTER_BOTH,

    width: 1100,

    height: 700,
  },

  scene: FightScene,
};

game = new Phaser.Game(config);

/* =========================================================
   IMAGE UPLOAD
========================================================= */

document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image.");

      return;
    }

    /* -----------------------------------------
               PREVIEW
            ----------------------------------------- */

    const reader = new FileReader();

    reader.onload = function (e) {
      const preview = document.getElementById("previewImage");

      preview.src = e.target.result;

      preview.style.display = "block";

      document.getElementById("previewPlaceholder").style.display = "none";
    };

    reader.readAsDataURL(file);

    /* -----------------------------------------
               PHASER IMAGE
            ----------------------------------------- */

    if (targetImageURL) {
      URL.revokeObjectURL(targetImageURL);
    }

    targetImageURL = URL.createObjectURL(file);

    /* -----------------------------------------
               RESTART GAME
            ----------------------------------------- */

    if (game) {
      game.scene.stop("FightScene");

      game.scene.start("FightScene");
    }
  });

/* =========================================================
   BUTTON EVENTS
========================================================= */

document.getElementById("punchBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.punch();
  }
});

document.getElementById("kickBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.kick();
  }
});

document.getElementById("shoesBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.shoesAttack();
  }
});

document.getElementById("ballBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.basketballAttack();
  }
});

document.getElementById("stickBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.stickAttack();
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.resetGame();
  }
});
