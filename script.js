document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    const WIDTH = 300;
    const HEIGHT = 700;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const WHITE = "#FFFFFF";
    const RED = "#FF0000";

    let playerWidth = 50;
    let playerHeight = 50;
    let playerX = WIDTH / 2 - playerWidth / 2;
    let playerY = HEIGHT - 2 * playerHeight;
    let playerSpeed = 10;

    let obstacleWidth = 50;
    let obstacleHeight = 50;
    let obstacleSpeed = 20;
    let obstacleFrequency = 500;

    let obstacleX = Math.floor(Math.random() * (WIDTH - obstacleWidth));
    let obstacleY = -obstacleHeight;

    let startTime = Date.now();
    let pauseStartTime;

    function drawPlayer(x, y) {
        ctx.fillStyle = WHITE;
        ctx.fillRect(x, y, playerWidth, playerHeight);
    }

    function drawObstacle(x, y) {
        ctx.fillStyle = RED;
        ctx.fillRect(x, y, obstacleWidth, obstacleHeight);
    }

    function drawTimer() {
        let elapsedMillis;
        if (gamePaused) {
            elapsedMillis = pauseStartTime - startTime;
        } else {
            elapsedMillis = Date.now() - startTime;
        }

        const seconds = Math.floor(elapsedMillis / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const milliseconds = elapsedMillis % 1000;

        ctx.fillStyle = "#000";
        ctx.fillRect(WIDTH - 250, 0, 250, 50);

        ctx.fillStyle = WHITE;
        ctx.font = "18px Arial";
        ctx.fillText(`Time: ${minutes}m ${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}s`, WIDTH - 250, 20);
    }

    let gamePaused = false;
    let animationId;

    function gameLoop() {
        if (!gamePaused) {
            if (keys.right) {
                playerX += playerSpeed;
            }
            if (keys.left) {
                playerX -= playerSpeed;
            }

            playerX = Math.max(0, Math.min(playerX, WIDTH - playerWidth));

            if (Math.floor(Math.random() * obstacleFrequency) === 1) {
                obstacleX = Math.floor(Math.random() * (WIDTH - obstacleWidth));
                obstacleY = -obstacleHeight;
            }

            obstacleY += obstacleSpeed;

            if (obstacleY > HEIGHT) {
                obstacleX = Math.floor(Math.random() * (WIDTH - obstacleWidth));
                obstacleY = -obstacleHeight;
            }

            if (
                playerX < obstacleX + obstacleWidth &&
                playerX + playerWidth > obstacleX &&
                playerY < obstacleY + obstacleHeight &&
                playerY + playerHeight > obstacleY
            ) {
                gameOver();
                return;
            }

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            drawPlayer(playerX, playerY);
            drawObstacle(obstacleX, obstacleY);
            drawTimer();

            animationId = requestAnimationFrame(gameLoop);
        } else {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    function gameOver() {
        const endTime = gamePaused ? pauseStartTime : Date.now();
        const gameTime = endTime - startTime - 17;
        const seconds = Math.floor(gameTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const milliseconds = gameTime % 1000;

        const timeMessage = `You time was ${minutes}m ${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}s`;

        alert(`Game Over!\nThanks for Playing!\n${timeMessage}`);

        startTime = Date.now();

        window.location.reload();
    }

    const keys = { left: false, right: false };

    window.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            keys.left = true;
        } else if (event.key === "ArrowRight") {
            keys.right = true;
        }
    });

    window.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft") {
            keys.left = false;
        } else if (event.key === "ArrowRight") {
            keys.right = false;
        }
    });

    gameLoop();

    const pausedText = document.createElement("div");
    pausedText.className = "paused-text";
    pausedText.innerText = "You are paused.";
    document.body.appendChild(pausedText);

    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            handlePause();
        }
    });

    function handlePause() {
        const canvas = document.querySelector("canvas");
        const text = document.querySelector(".paused-text");

        if (!gamePaused) {
            gamePaused = true;
            pauseStartTime = Date.now();
            cancelAnimationFrame(animationId);
            canvas.style.filter = "blur(5px)";
            text.style.opacity = 1;
        } else {
            gamePaused = false;
            startTime += Date.now() - pauseStartTime;
            requestAnimationFrame(gameLoop);
            canvas.style.filter = "none";
            text.style.opacity = 0;
        }
    }
});