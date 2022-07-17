const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
canvasContext.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.4;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
});

//Player 1 Area
const player = new Fighter({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
       x: 0,
       y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2,
        }
    }
});
player.draw();

//Player 2 Area
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
});
enemy.draw();

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
};
let lastKey;

decreaseTimer()

const animate = () => {
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    // enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Player Moviments
    player.framesMax = player.sprites.idle.framesMax
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = - 5
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump');
    };
    if(player.velocity.y > 0) {
        player.switchSprite('fall');
    };

    //Enemy Moviments
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    };

    //Detect Collision
    if (rectangularCollision({ 
        rectangle1: player,
        rectangle2: enemy
     }) &&
        player.isAttacking       
    ) {
        player.isAttacking = false;
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    };

    if (rectangularCollision({ 
        rectangle1: enemy,
        rectangle2: player
     }) &&
        enemy.isAttacking       
    ) {
        enemy.isAttacking = false;
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    };

    //end game based on health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
    }
};
animate();

//Keys Area
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            if(player.velocity.y === 0){
                player.velocity.y = -15;
            }
            break;
        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -15;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    };
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
    };

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    };
});