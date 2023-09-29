const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#24252A",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('startButton', 'assets/img/startbtn.png');
    this.load.image('playAgainButton', 'assets/img/plyagnbtn.png');
}

function create() {
    this.dodgerGameText = this.add.text(400, 300, 'SKIMBLE', 
{
    fontSize: '48px', 
    fontWeight: 'bold',
    fill: '#fff',
    fontFamily: 'Micro',
    fontWeight: 'bold'
    
})
.setOrigin(0.5, 0.5);
    
    this.startGameButton = this.add.image(400, 400, 'startButton')
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .setScale(0.4)
    .on('pointerdown', () => {
        this.startGameButton.visible = false;
        startGame.call(this);
    });


    // Initial setup will go here
   // this.add.text(350, 300, 'Dodger Game', { fontSize: '32px', fill: '#fff' });
    // Create the player's rectangle
    this.player = this.add.rectangle(400, 570, 50, 30, 0x00ff00);
    // Enable physics on the player
    this.physics.world.enable(this.player);

    // Enable arrow key inputs
    this.cursors = this.input.keyboard.createCursorKeys();

    // Keep player within game boundaries
    this.player.body.setCollideWorldBounds(true);
    //this.player.body.drag.x = 1000; // Adjust this value to your preference


    // Create a group to hold our falling objects
    this.fallingObjects = this.physics.add.group({
        gravityY: 300
    });
 
    function spawnObject() {
        console.log("Spawning object..."); // Add this
    
        const x = Phaser.Math.Between(25, 775);
        
        const fallingObject = this.add.rectangle(x, -10, 30, 30, 0xff0000);
        this.physics.world.enable(fallingObject);
 
        fallingObject.body.setGravityY(300 + this.fallenObjectsCount * 10);

        fallingObject.body.setVelocityY(300);
        
        this.fallingObjects.add(fallingObject);
    }
    
    
    
    

// ... inside your create function:

this.physics.add.collider(this.player, this.fallingObjects, endGame, null, this);

function initGame() {
    // Set a timed event to spawn objects
    this.time.addEvent({
        delay: 700,
        callback: spawnObject,
        callbackScope: this,
        loop: true
    });
}


function startGame() {
    this.dodgerGameText.visible = false;

    // Initialize the game
    initGame.call(this);

    // Hide the Dodger Game title
    this.tweens.add({
        targets: this.dodgerGameText,
        alpha: { from: 1, to: 0 },
        duration: 1000,
        ease: 'Linear',
        onComplete: () => {
            this.dodgerGameText.destroy();
        }
    });
}


function endGame() {
    this.physics.pause();
    const gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '48px', fontFamily: 'Micro', fill: '#fff' });
    gameOverText.setOrigin(0.5, 0.5);  // This will center the text

    this.playAgainButton = this.add.image(400, 500, 'playAgainButton')
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .setScale(0.5)
    .on('pointerdown', () => location.reload());

}

}

function update() {
    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-200);  // Move to the left
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(200);  // Move to the right
    } else {
        this.player.body.setVelocityX(0);  // Stay still if no arrow key is pressed
    }
}
