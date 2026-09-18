/* =========================================================
   GAME VARIABLES
========================================================= */

let game;
let gameScene;

/* =========================================================
   GAME STATE
========================================================= */

const state = {
  score: 0,

  mouseSpeed: 250,

  caught: false,

  mouseScared: false,
};

/* =========================================================
   PHASER SCENE
========================================================= */

class CatMouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CatMouseScene",
    });
  }

  /* =====================================================
       CREATE
    ===================================================== */

  create() {
    gameScene = this;

    this.createBackground();

    this.createCat();

    this.createMouse();

    this.createEffects();

    this.setupPointer();
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

    // Decorative glow

    this.add.circle(
      width / 2,
      height / 2,

      300,

      0x1e3a5f,

      0.15,
    );

    // Floor

    this.add.rectangle(
      width / 2,
      height - 70,

      width,
      140,

      0x172033,
    );

    // Floor line

    this.add.rectangle(
      width / 2,
      height - 140,

      width,
      3,

      0x475569,

      0.7,
    );

    // Decorative circles

    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(50, width - 50);

      const y = Phaser.Math.Between(160, height - 170);

      this.add.circle(
        x,
        y,

        Phaser.Math.Between(2, 5),

        0xffffff,

        0.08,
      );
    }

    // Cheese decorations

    this.add
      .text(
        100,
        height - 90,

        "🧀",

        {
          fontSize: "50px",
        },
      )
      .setAlpha(0.35);

    this.add
      .text(
        width - 100,
        height - 90,

        "🧀",

        {
          fontSize: "50px",
        },
      )
      .setAlpha(0.35);
  }

  /* =====================================================
       CAT
    ===================================================== */

  createCat() {
    const width = this.scale.width;

    const height = this.scale.height;

    /*
     * The cat follows the user's cursor.
     */

    this.cat = this.add
      .text(
        width / 2,
        height / 2,

        "🐱",

        {
          fontSize: "95px",
        },
      )
      .setOrigin(0.5)
      .setDepth(20);

    // Cat shadow

    this.catShadow = this.add
      .ellipse(
        width / 2,
        height / 2 + 48,

        80,
        22,

        0x000000,

        0.25,
      )
      .setDepth(5);

    // Ownership label above cat
    this.ownershipLabel = this.add
      .text(this.cat.x, this.cat.y - 75, "OWNERSHIP", {
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffffff",
        backgroundColor: "#ef4444",
        padding: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5,
        },
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(30)
      .setAngle(-3);
  }

  /* =====================================================
       MOUSE
    ===================================================== */

  createMouse() {
    const width = this.scale.width;

    const height = this.scale.height;

    this.mouseX = Phaser.Math.Between(width / 2, width - 250);

    this.mouseY = Phaser.Math.Between(230, height - 200);

    this.mouse = this.add
      .text(
        this.mouseX,
        this.mouseY,

        "🐭",

        {
          fontSize: "75px",
        },
      )
      .setOrigin(0.5)
      .setDepth(20);

    /*
     * "ME" label above mouse
     */

    this.meLabel = this.add
      .text(
        this.mouseX,
        this.mouseY - 58,

        "ME!",

        {
          fontSize: "19px",

          fontStyle: "bold",

          color: "#facc15",

          stroke: "#000000",

          strokeThickness: 5,
        },
      )
      .setOrigin(0.5)
      .setDepth(30);

    /*
     * Mouse trail
     */

    this.mouseTrail = [];

    for (let i = 0; i < 5; i++) {
      const dot = this.add
        .circle(
          this.mouseX,
          this.mouseY,

          4,

          0x94a3b8,

          0.15,
        )
        .setDepth(10);

      this.mouseTrail.push(dot);
    }
  }

  /* =====================================================
       EFFECTS
    ===================================================== */

  createEffects() {
    /*
     * Warning text
     */

    this.warning = this.add
      .text(
        this.mouseX,
        this.mouseY - 100,

        "😱 OH NO!",

        {
          fontSize: "25px",

          fontStyle: "bold",

          color: "#ef4444",

          stroke: "#ffffff",

          strokeThickness: 5,
        },
      )
      .setOrigin(0.5)
      .setDepth(50)
      .setAlpha(0);

    /*
     * Catch text
     */

    this.catchText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,

        "GOT YOU! 😹",

        {
          fontSize: "60px",

          fontStyle: "bold",

          color: "#facc15",

          stroke: "#000000",

          strokeThickness: 8,
        },
      )
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0);

    /*
     * Stars
     */

    this.stars = [];

    for (let i = 0; i < 10; i++) {
      const star = this.add
        .text(
          this.mouseX,
          this.mouseY,

          "⭐",

          {
            fontSize: Phaser.Math.Between(18, 32),
          },
        )
        .setOrigin(0.5)
        .setDepth(80)
        .setAlpha(0);

      this.stars.push(star);
    }
  }

  /* =====================================================
       POINTER
    ===================================================== */

  setupPointer() {
    /*
     * Phaser gives us pointer movement.
     */

    this.input.on("pointermove", (pointer) => {
      this.catTargetX = pointer.worldX;

      this.catTargetY = pointer.worldY;
    });

    /*
     * Initialize position.
     */

    this.catTargetX = this.cat.x;

    this.catTargetY = this.cat.y;
  }

  /* =====================================================
       UPDATE
    ===================================================== */

  update(time, delta) {
    if (!this.mouse || state.caught) {
      return;
    }

    const dt = delta / 1000;

    /* ---------------------------------------------
           CAT FOLLOWS CURSOR
        --------------------------------------------- */
    this.cat.x = Phaser.Math.Linear(this.cat.x, this.catTargetX, 0.2);

    this.cat.y = Phaser.Math.Linear(this.cat.y, this.catTargetY, 0.2);

    // Keep OWNERSHIP above the cat
    this.ownershipLabel.x = this.cat.x;
    this.ownershipLabel.y = this.cat.y - 75;

    this.catShadow.x = this.cat.x;

    this.catShadow.y = this.cat.y + 48;

    /* ---------------------------------------------
           DISTANCE CAT → MOUSE
        --------------------------------------------- */

    const distance = Phaser.Math.Distance.Between(
      this.cat.x,
      this.cat.y,

      this.mouse.x,
      this.mouse.y,
    );

    /* ---------------------------------------------
           MOUSE RUNS AWAY
        --------------------------------------------- */

    if (distance < 280) {
      this.mouseScared = true;

      this.runAway(distance);
    } else {
      this.mouseScared = false;
    }

    /* ---------------------------------------------
           MOUSE FOLLOW LABEL
        --------------------------------------------- */

    this.meLabel.x = this.mouse.x;

    this.meLabel.y = this.mouse.y - 58;

    /* ---------------------------------------------
           MOUSE TRAIL
        --------------------------------------------- */

    this.updateTrail();

    /* ---------------------------------------------
           CATCH
        --------------------------------------------- */

    if (distance < 45) {
      this.catchMouse();
    }
  }

  /* =====================================================
       RUN AWAY
    ===================================================== */

  runAway(distance) {
    /*
     * Direction from cat to mouse.
     */

    let dx = this.mouse.x - this.cat.x;

    let dy = this.mouse.y - this.cat.y;

    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return;

    dx /= length;
    dy /= length;

    /*
     * Mouse moves opposite to cat.
     */

    let newX = this.mouse.x + dx * state.mouseSpeed * 0.016;

    let newY = this.mouse.y + dy * state.mouseSpeed * 0.016;

    /*
     * If mouse gets near an edge,
     * turn it toward the center.
     */

    const margin = 100;

    if (newX < margin || newX > this.scale.width - margin) {
      newX = this.mouse.x - dx * state.mouseSpeed * 0.016;
    }

    if (newY < 180 || newY > this.scale.height - 170) {
      newY = this.mouse.y - dy * state.mouseSpeed * 0.016;
    }

    /*
     * Apply movement.
     */

    this.mouse.x = Phaser.Math.Clamp(
      newX,

      70,

      this.scale.width - 70,
    );

    this.mouse.y = Phaser.Math.Clamp(
      newY,

      190,

      this.scale.height - 180,
    );

    /*
     * Face direction.
     */

    this.mouse.setScale(dx < 0 ? -1 : 1, 1);

    /*
     * Scared animation.
     */

    this.mouse.setAngle(Math.sin(performance.now() / 70) * 7);

    /*
     * Warning.
     */

    if (distance < 180) {
      this.showWarning();
    }
  }

  /* =====================================================
       WARNING
    ===================================================== */

  showWarning() {
    this.warning.setPosition(
      this.mouse.x,

      this.mouse.y - 95,
    );

    this.warning.setAlpha(1);

    this.warning.setScale(0.7);

    this.tweens.add({
      targets: this.warning,

      scale: 1,

      duration: 120,

      yoyo: true,

      repeat: 1,
    });
  }

  /* =====================================================
       TRAIL
    ===================================================== */

  updateTrail() {
    this.mouseTrail.forEach((dot, index) => {
      const delay = (index + 1) * 8;

      dot.x = Phaser.Math.Linear(
        dot.x,

        this.mouse.x,

        0.15,
      );

      dot.y = Phaser.Math.Linear(
        dot.y,

        this.mouse.y,

        0.15,
      );

      dot.setAlpha(0.15 - index * 0.025);
    });
  }

  /* =====================================================
       CATCH
    ===================================================== */

  catchMouse() {
    if (state.caught) return;

    state.caught = true;

    state.score++;

    document.getElementById("scoreDisplay").innerText = state.score + " 🏆";

    document.getElementById("statusPanel").innerText = "CAUGHT! 😹";

    /*
     * Stop mouse
     */

    this.tweens.killTweensOf(this.mouse);

    /*
     * Mouse reaction
     */

    this.mouse.setText("😵");

    /*
     * Big message
     */

    this.catchText.setAlpha(1);

    this.catchText.setScale(0.3);

    this.tweens.add({
      targets: this.catchText,

      scale: 1,

      duration: 300,

      ease: "Back.easeOut",
    });

    /*
     * Stars
     */

    this.showCatchStars();

    /*
     * After a moment,
     * create a new mouse.
     */

    this.time.delayedCall(1600, () => {
      this.newMouse();
    });
  }

  /* =====================================================
       NEW MOUSE
    ===================================================== */

  newMouse() {
    state.caught = false;

    state.mouseScared = false;

    /*
     * Hide catch message.
     */

    this.catchText.setAlpha(0);

    /*
     * New random position.
     */

    this.mouse.x = Phaser.Math.Between(
      300,

      this.scale.width - 280,
    );

    this.mouse.y = Phaser.Math.Between(
      230,

      this.scale.height - 210,
    );

    /*
     * Reset mouse.
     */

    this.mouse.setText("🐭");

    this.mouse.setAngle(0);

    this.mouse.setScale(1);

    /*
     * Speed increases
     * slightly after every catch.
     */

    state.mouseSpeed = Math.min(
      500,

      250 + state.score * 25,
    );

    document.getElementById("statusPanel").innerText = "NEW MOUSE! 🐭";
  }

  /* =====================================================
       STARS
    ===================================================== */

  showCatchStars() {
    this.stars.forEach((star, index) => {
      const angle = ((Math.PI * 2) / this.stars.length) * index;

      const distance = Phaser.Math.Between(80, 150);

      star.setPosition(
        this.mouse.x,

        this.mouse.y,
      );

      star.setAlpha(1);

      star.setScale(0.3);

      this.tweens.add({
        targets: star,

        x: this.mouse.x + Math.cos(angle) * distance,

        y: this.mouse.y + Math.sin(angle) * distance,

        scale: 1,

        alpha: 0,

        duration: 600,

        ease: "Power2",
      });
    });
  }

  /* =====================================================
       RESET
    ===================================================== */

  resetGame() {
    state.score = 0;

    state.mouseSpeed = 250;

    state.caught = false;

    state.mouseScared = false;

    document.getElementById("scoreDisplay").innerText = "0 🏆";

    document.getElementById("statusPanel").innerText = "Find the mouse! 🐭";

    this.scene.restart();
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

  scene: CatMouseScene,
};

/* =========================================================
   START
========================================================= */

game = new Phaser.Game(config);

/* =========================================================
   RESET BUTTON
========================================================= */

document.getElementById("resetBtn").addEventListener("click", () => {
  if (gameScene) {
    gameScene.resetGame();
  }
});
