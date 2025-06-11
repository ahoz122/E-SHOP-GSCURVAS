import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Phaser from "phaser";

const NotFound: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<GameInstance | null>(null);

  // Define image assets here - replace these with your local paths
  const ASSETS = {
    sky: "/assets/sky.jpg",
    bird: "/assets/bird.png",
    pipe: "/assets/pipe.png",
    ground: "/assets/ground.jpg",
    pixel:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  };

  // Define game dimensions
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 500;

  // Define game element sizes and positions
  const SIZES = {
    bird: { width: 80, height: 30 },
    pipe: { width: 60, height: 320 },
    ground: { width: GAME_WIDTH * 2, height: 30 },
    pipeGap: 180, // Gap between top and bottom pipes
    pipeSpacing: 250, // Horizontal distance between pipe pairs
  };

  // Game object interfaces
  interface GameInstance extends Phaser.Game {}

  interface GameObjects {
    bird: Phaser.Physics.Arcade.Sprite;
    pipes: Phaser.Physics.Arcade.Group;
    ground: Phaser.Physics.Arcade.StaticGroup;
    scoreText: Phaser.GameObjects.Text;
    highScoreText: Phaser.GameObjects.Text;
    tapToStartText: Phaser.GameObjects.Text;
    gameOverText: Phaser.GameObjects.Text;
  }

  interface GameState {
    score: number;
    gameOver: boolean;
    gameStarted: boolean;
    highScore: number;
  }

  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      // Game variables
      const gameObjects: Partial<GameObjects> = {};
      const gameState: GameState = {
        score: 0,
        gameOver: false,
        gameStarted: false,
        highScore: parseInt(
          localStorage.getItem("flappy404HighScore") || "0",
          10
        ),
      };
      let spaceKey: Phaser.Input.Keyboard.Key;

      // Game configuration
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        parent: gameContainerRef.current,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 1200 },
            debug: false,
          },
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      // Preload game assets
      function preload(this: Phaser.Scene): void {
        this.load.image("sky", ASSETS.sky);
        this.load.image("bird", ASSETS.bird);
        this.load.image("pipe", ASSETS.pipe);
        this.load.image("ground", ASSETS.ground);
        this.load.image("pixel", ASSETS.pixel);
      }

      // Create game objects
      function create(this: Phaser.Scene): void {
        // Add background - stretch to fill entire game area
        const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "sky");
        bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        // Create ground
        gameObjects.ground = this.physics.add.staticGroup();
        const ground = gameObjects.ground.create(
          GAME_WIDTH / 2,
          GAME_HEIGHT - SIZES.ground.height / 2,
          "ground"
        );
        ground.setDisplaySize(SIZES.ground.width, SIZES.ground.height);
        ground.refreshBody();

        // Create bird with explicit size
        gameObjects.bird = this.physics.add.sprite(
          100,
          GAME_HEIGHT / 2,
          "bird"
        );
        gameObjects.bird.setDisplaySize(SIZES.bird.width, SIZES.bird.height);
        gameObjects.bird.setCollideWorldBounds(true);

        // Update the physics body size to match display size
        const birdBody = gameObjects.bird.body as Phaser.Physics.Arcade.Body;
        birdBody.setSize(SIZES.bird.width * 0.8, SIZES.bird.height * 0.8); // Slightly smaller hitbox than visual
        birdBody.setAllowGravity(false);

        // Create pipes group
        gameObjects.pipes = this.physics.add.group();

        // Collision detection
        this.physics.add.collider(
          gameObjects.bird,
          gameObjects.ground!,
          gameOverFunction,
          undefined,
          this
        );

        this.physics.add.collider(
          gameObjects.bird,
          gameObjects.pipes!,
          gameOverFunction,
          undefined,
          this
        );

        // Score text
        gameObjects.scoreText = this.add.text(16, 16, "Score: 0", {
          fontSize: "24px",
          color: "#000",
        });

        // High score text
        gameObjects.highScoreText = this.add.text(
          16,
          50,
          "High Score: " + gameState.highScore,
          { fontSize: "18px", color: "#000" }
        );

        // Tap to start text
        gameObjects.tapToStartText = this.add.text(
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2,
          "Tap to Start",
          { fontSize: "32px", color: "#000" }
        );
        gameObjects.tapToStartText.setOrigin(0.5);

        // Game Over text
        gameObjects.gameOverText = this.add.text(
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 - 50,
          "GAME OVER",
          { fontSize: "40px", color: "#F00" }
        );
        gameObjects.gameOverText.setOrigin(0.5);
        gameObjects.gameOverText.visible = false;

        // Input handling
        spaceKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.input.on(
          "pointerdown",
          function (this: Phaser.Scene) {
            if (!gameState.gameStarted) {
              startGame(this);
            } else if (!gameState.gameOver) {
              flapBird();
            } else {
              resetGame(this);
            }
          },
          this
        );
      }

      // Start the game
      function startGame(scene: Phaser.Scene): void {
        gameState.gameStarted = true;
        gameState.gameOver = false;

        // Properly set bird gravity
        const birdBody = gameObjects.bird!.body as Phaser.Physics.Arcade.Body;
        birdBody.setAllowGravity(true);

        gameObjects.tapToStartText!.visible = false;

        // Start pipe generation
        scene.time.addEvent({
          delay: 1500,
          callback: addPipes,
          callbackScope: scene,
          loop: true,
        });

        // Initial flap
        flapBird();
      }

      // Reset game after game over
      function resetGame(scene: Phaser.Scene): void {
        // Reset state
        gameState.gameOver = false;
        gameState.score = 0;
        gameObjects.scoreText!.setText("Score: 0");
        gameObjects.gameOverText!.visible = false;

        // Reset bird position
        gameObjects.bird!.x = 100;
        gameObjects.bird!.y = GAME_HEIGHT / 2;

        // Reset bird velocity properly
        const birdBody = gameObjects.bird!.body as Phaser.Physics.Arcade.Body;
        birdBody.setVelocityY(0);

        gameObjects.bird!.angle = 0;

        // Remove all pipes
        gameObjects.pipes!.clear(true, true);

        // Start again
        startGame(scene);
      }

      // Game over function
      function gameOverFunction(this: Phaser.Scene): void {
        if (gameState.gameOver) return;

        gameState.gameOver = true;

        // Update high score
        if (gameState.score > gameState.highScore) {
          gameState.highScore = gameState.score;
          localStorage.setItem(
            "flappy404HighScore",
            gameState.highScore.toString()
          );
          gameObjects.highScoreText!.setText(
            "High Score: " + gameState.highScore
          );
        }

        // Show game over text
        gameObjects.gameOverText!.visible = true;

        // Stop adding pipes
        this.time.removeAllEvents();
      }

      // Add pipes function
      function addPipes(this: Phaser.Scene): void {
        if (gameState.gameOver) return;

        // Calculate gap center position (vertical)
        const gapCenter: number = Phaser.Math.Between(
          GAME_HEIGHT * 0.3,
          GAME_HEIGHT * 0.7 - SIZES.ground.height
        );

        // Create top pipe with explicit size
        const topPipe: Phaser.Physics.Arcade.Sprite = gameObjects.pipes!.create(
          GAME_WIDTH + SIZES.pipe.width / 2,
          gapCenter - SIZES.pipeGap / 2 - SIZES.pipe.height / 2,
          "pipe"
        ) as Phaser.Physics.Arcade.Sprite;

        topPipe.setDisplaySize(SIZES.pipe.width, SIZES.pipe.height);
        const topPipeBody = topPipe.body as Phaser.Physics.Arcade.Body;
        topPipeBody.setAllowGravity(false);
        topPipe.setVelocityX(-200);
        topPipe.setFlipY(true);

        // Create bottom pipe with explicit size
        const bottomPipe: Phaser.Physics.Arcade.Sprite =
          gameObjects.pipes!.create(
            GAME_WIDTH + SIZES.pipe.width / 2,
            gapCenter + SIZES.pipeGap / 2 + SIZES.pipe.height / 2,
            "pipe"
          ) as Phaser.Physics.Arcade.Sprite;

        bottomPipe.setDisplaySize(SIZES.pipe.width, SIZES.pipe.height);
        const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body;
        bottomPipeBody.setAllowGravity(false);
        bottomPipe.setVelocityX(-200);

        // Add score marker
        const scoreMarker: Phaser.Physics.Arcade.Sprite =
          this.physics.add.sprite(
            GAME_WIDTH + SIZES.pipe.width / 2 + 5,
            GAME_HEIGHT / 2,
            "pixel"
          );
        scoreMarker.setAlpha(0); // Make it invisible
        const markerBody = scoreMarker.body as Phaser.Physics.Arcade.Body;
        markerBody.setAllowGravity(false);
        markerBody.setSize(10, GAME_HEIGHT - SIZES.ground.height);
        scoreMarker.setVelocityX(-200);

        // Check for passing through pipes
        this.physics.add.overlap(
          gameObjects.bird!,
          scoreMarker,
          function () {
            if (!gameState.gameOver) {
              gameState.score++;
              gameObjects.scoreText!.setText("Score: " + gameState.score);
              scoreMarker.destroy();
            }
          },
          undefined,
          this
        );
      }

      // Flap the bird
      function flapBird(): void {
        if (gameState.gameOver) return;
        gameObjects.bird!.setVelocityY(-400);
      }

      // Update function (runs every frame)
      function update(this: Phaser.Scene): void {
        if (gameState.gameOver) {
          gameObjects.bird!.angle = 90;
        } else if (gameState.gameStarted) {
          // Bird rotation based on velocity
          const birdBody = gameObjects.bird!.body as Phaser.Physics.Arcade.Body;
          if (birdBody.velocity.y < 0) {
            gameObjects.bird!.angle = -15;
          } else {
            gameObjects.bird!.angle = Math.min(gameObjects.bird!.angle + 2, 90);
          }

          // Space key for flapping
          if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            flapBird();
          }
        }

        // Remove pipes that are off-screen
        gameObjects
          .pipes!.getChildren()
          .forEach(function (pipe: Phaser.GameObjects.GameObject) {
            const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
            if (pipeSprite.x < -SIZES.pipe.width) {
              pipeSprite.destroy();
            }
          });
      }

      // Create game instance
      gameInstanceRef.current = new Phaser.Game(config);
    }

    // Cleanup
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-center">
        404
      </h1>
      <p className="mb-8 text-gray-600 text-center max-w-md">
        Esta pagina no existe.
        <br />
        Pero puedes quedarte y pasar el rato.
      </p>

      <div
        ref={gameContainerRef}
        className="w-full max-w-[400px] h-[600px] rounded-lg overflow-hidden shadow-lg mb-4"
        style={{
          maxWidth: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
        }}
      />

      <div className="text-center mt-4">
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transform transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
