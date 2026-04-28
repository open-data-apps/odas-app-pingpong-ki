function app(configdata = [], enclosingHtmlDivElement) {
  addToHead();

  // Erstellen des Canvas Elements und hinzufügen zum enclosingHtmlDivElement
  const canvas = document.createElement("canvas");
  canvas.width = enclosingHtmlDivElement.clientWidth;
  canvas.height = 400; // feste Höhe für das Spiel
  enclosingHtmlDivElement.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Spielvariablen
  const paddleWidth = 10,
    paddleHeight = 75;
  let playerY = (canvas.height - paddleHeight) / 2;
  let computerY = (canvas.height - paddleHeight) / 2;
  let ballX = canvas.width / 2,
    ballY = canvas.height / 2;
  let ballSpeedX = 5,
    ballSpeedY = 2;

  // Zeichne die Paddel und den Ball
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spieler-Paddel
    ctx.fillRect(
      canvas.width - paddleWidth,
      playerY,
      paddleWidth,
      paddleHeight
    );

    // Computer-Paddel
    ctx.fillRect(0, computerY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Aktualisiere die Spielpositionen
  function update() {
    // Ballbewegung
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ballprall oben und unten
    if (ballY < 0 || ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    // Spieler-Paddel Kollision
    if (
      ballX > canvas.width - paddleWidth &&
      ballY > playerY &&
      ballY < playerY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    // Computer-Paddel Kollision
    if (
      ballX < paddleWidth &&
      ballY > computerY &&
      ballY < computerY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    // Punkt für den Computer (Ball geht nach rechts aus dem Sichtbereich)
    if (ballX > canvas.width) {
      resetBall();
    }

    // Punkt für den Spieler (Ball geht nach links aus dem Sichtbereich)
    if (ballX < 0) {
      resetBall();
    }

    // Computer-Bewegung - einfache Logik, folgt einfach dem Ball
    if (computerY + paddleHeight / 2 < ballY) {
      computerY += 4;
    } else {
      computerY -= 4;
    }
  }

  // Setzt den Ball in die Mitte zurück
  function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Ball in die andere Richtung starten
  }

  // Spieler-Steuerung
  function handleKeyDown(event) {
    const key = event.key;
    if (key === "ArrowUp") {
      playerY = Math.max(playerY - 20, 0);
    } else if (key === "ArrowDown") {
      playerY = Math.min(playerY + 20, canvas.height - paddleHeight);
    }
  }

  // Event Listener für Tastatureingaben
  window.addEventListener("keydown", handleKeyDown);

  // Hauptspielschleife
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

function addToHead() {
  const head = document.head;

  // Füge ggf. hier zusätzliche Skripte oder CSS hinzu
  const style = document.createElement("style");
  style.textContent = `
        canvas {
            border: 1px solid #000;
            display: block;
            margin: 0 auto;
        }
        `;
  head.appendChild(style);
}
