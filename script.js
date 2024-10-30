const player = document.getElementById('player');
const monster = document.getElementById('monster');
const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const controls = document.getElementById('controls'); // Croix directionnelle

let playerPos = { x: 50, y: 50 };
let monsterPos = { x: 700, y: 500 };
let score = 0;
const playerSpeed = 15;
const monsterSpeed = 0;
const miniYaskoCount = 10;
let miniYaskos = [];

// Fonction pour démarrer le jeu
startButton.addEventListener('click', startGame);

// Détecter si on est sur mobile
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Afficher la croix directionnelle si on est sur mobile
if (isMobile()) {
  controls.style.display = 'flex';
}

// Création des mini Yaskos dans le jeu
function createMiniYaskos() {
  for (let i = 0; i < miniYaskoCount; i++) {
    const miniYasko = document.createElement('div');
    miniYasko.classList.add('mini-yasko');
    miniYasko.style.left = Math.random() * (gameArea.clientWidth - 30) + 'px';
    miniYasko.style.top = Math.random() * (gameArea.clientHeight - 30) + 'px';
    gameArea.appendChild(miniYasko);
    miniYaskos.push(miniYasko);
  }
}

// Démarrer le jeu
function startGame() {
  startScreen.style.display = 'none';
  gameArea.style.display = 'block';
  createMiniYaskos();
  gameLoop();
}

// Mouvement du joueur avec le clavier
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': movePlayer(0, -playerSpeed); break;
    case 'ArrowDown': movePlayer(0, playerSpeed); break;
    case 'ArrowLeft': movePlayer(-playerSpeed, 0); break;
    case 'ArrowRight': movePlayer(playerSpeed, 0); break;
  }
  checkMiniYaskoCollision();
});

// Gestion du déplacement depuis la croix directionnelle
document.getElementById('up').addEventListener('click', () => movePlayer(0, -playerSpeed));
document.getElementById('down').addEventListener('click', () => movePlayer(0, playerSpeed));
document.getElementById('left').addEventListener('click', () => movePlayer(-playerSpeed, 0));
document.getElementById('right').addEventListener('click', () => movePlayer(playerSpeed, 0));

// Fonction de déplacement générique
function movePlayer(dx, dy) {
  playerPos.x = Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, playerPos.x + dx));
  playerPos.y = Math.max(0, Math.min(gameArea.clientHeight - player.clientHeight, playerPos.y + dy));
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
}

// Mouvement du monstre vers le joueur
function moveMonsterTowardsPlayer() {
  const dx = playerPos.x - monsterPos.x;
  const dy = playerPos.y - monsterPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calcul du mouvement du monstre en direction du joueur
  if (distance > 1) {
    monsterPos.x += (dx / distance) * monsterSpeed;
    monsterPos.y += (dy / distance) * monsterSpeed;
  }

  monster.style.left = monsterPos.x + 'px';
  monster.style.top = monsterPos.y + 'px';

  // Vérifier si le monstre a attrapé le joueur
  if (distance < 30) {
    alert("Yasko vous a attrapé ! Game Over !");
    resetGame();
  }
}

// Vérifier les collisions avec les mini Yaskos
function checkMiniYaskoCollision() {
  miniYaskos.forEach((miniYasko, index) => {
    const rect1 = player.getBoundingClientRect();
    const rect2 = miniYasko.getBoundingClientRect();

    if (!(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
      // Le joueur a ramassé un mini Yasko
      gameArea.removeChild(miniYasko);
      miniYaskos.splice(index, 1);
      score++;
      scoreDisplay.innerText = score; // Mettre à jour l'affichage du score

      // Vérifier si le joueur a gagné
      if (score >= miniYaskoCount) {
        alert("Félicitations ! Vous avez gagné en ramassant tous les mini Yaskos !");
        resetGame();
      }
    }
  });
}

// Réinitialiser la position du joueur, du monstre, et des mini Yaskos
function resetGame() {
  playerPos = { x: 50, y: 50 };
  monsterPos = { x: 700, y: 500 };
  score = 0;

  // Supprimer les mini Yaskos restants
  miniYaskos.forEach((miniYasko) => gameArea.removeChild(miniYasko));
  miniYaskos = [];
  
  // Réinitialiser l'affichage du score
  scoreDisplay.innerText = score;

  createMiniYaskos();
  updatePlayerPosition();
  moveMonsterTowardsPlayer();
}

// Mise à jour de la position du joueur
function updatePlayerPosition() {
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
}

// Boucle de jeu pour déplacer le monstre
function gameLoop() {
  moveMonsterTowardsPlayer();
  requestAnimationFrame(gameLoop);
}
