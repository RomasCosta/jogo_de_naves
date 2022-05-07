const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const monstersImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button')
let monsterInterval; 

//movimento e tiro  da nave
function flyAirShip(event) {
  if(event.key === 'ArrowUp') {
    event.preventDefault();
    moveUp();
  } else if(event.key === 'ArrowDown') {
    event.preventDefault()
    moveDown();
  } else if(event.key === " ") {
    event.preventDefault();
    fireLaser();
  }
}

//função de subir
function moveUp() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
  if(topPosition === "0px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
  }
}

//função de descer
function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top')
  if(topPosition === "460px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 50;
    yourShip.style.top = `${position}px`;
  }
}

//funcionalidade de tiro
function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
  let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
  let newLaser = document.createElement('img')
  newLaser.scr = 'img/shoot.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let monsters = document.querySelectorAll('.monster');

    monsters.forEach((monster) => { //comparando se cada monstro foi atingido, se sim, troca o source da imagem
      if(checkLaserCollision(laser, monster)) {
        monster.src = 'img/explosion.png';
        monster.classList.remove('monster');
        monster.classList.add('dead-monster');
      }
    })

    if(xPosition === 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

//função para criar inimigos aleatórios
function createMonsters() {
  let newMonster = document.createElement('img');
  let monsterSprite = monstersImg[Math.floor(Math.random() * monstersImg.length)]; //sorteia imagens 
  newMonster.src = monsterSprite;
  newMonster.classList.add('monster');
  newMonster.classList.add('monster-transition');
  newMonster.style.left = '370px';
  newMonster.style.top = `${Math.floor(Math.random() * 300) + 30}px`;
  playArea.appendChild(newMonster);
  moveMonster(newMonster);
}

//função para movimentar os inimigos
function moveMonster(monster) {
  let moveMonsterInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(monster).getPropertyValue('left'));
    if(xPosition <= 50) {
      if(Array.from(monster.classList).includes('dead-monster')) {
        monster.remove();
      } else {
         gameOver();
      }
    } else {
      monster.style.left = `${xPosition - 4}px`;
    }
  }, 30)
}

//funçao para colisão
function checkLaserCollision(laser, monster) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;
  let monsterTop = parseInt(monster.style.top);
  let monsterLeft = parseInt(monster.style.left);
  let monsterBottom = monsterTop - 30;
  if(laserLeft !=  340 && laserLeft + 40 >=monsterLeft) {
    if(laserTop <= monsterTop && laserTop >= monsterBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

//inicio do jogo
startButton.addEventListener('click', (event) => {
  playGame();
})

function playGame() {
  startButton.style.display = 'none';
  instructionsText.style.display = 'none';
  window.addEventListener('keydown', flyAirShip);
  monsterInterval = setInterval(() => {
    createMonsters();
  }, 2000)
}

//função de game over
function gameOver() {
  window.removeEventListener('keydown', flyAirShip);
  clearInterval(monsterInterval);
  let monsters = document.querySelectorAll('.monster');
  monsters.forEach((monster) => monster.remove());
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    alert('game over!');
    yourShip.style.top= "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  })
}