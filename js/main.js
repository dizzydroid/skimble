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
    // Placeholder for any assets to be loaded in the future
}

function create() {
    // Initial setup will go here
    this.add.text(350, 300, 'Dodger Game', { fontSize: '32px', fill: '#fff' });
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
    

    // Set a timed event to spawn objects
    this.time.addEvent({
        delay: 700,
        callback: spawnObject,
        callbackScope: this,
        loop: true
    });

    function spawnObject() {
        console.log("Spawning object..."); // Add this
    
        const x = Phaser.Math.Between(25, 775);
        
        const fallingObject = this.add.rectangle(x, -10, 30, 30, 0xff0000);
        this.physics.world.enable(fallingObject);
        fallingObject.body.setGravityY(300);
        fallingObject.body.setVelocityY(300);
        
        this.fallingObjects.add(fallingObject);
    }
    
    
    
    

// ... inside your create function:

this.physics.add.collider(this.player, this.fallingObjects, endGame, null, this);

function endGame() {
    this.physics.pause();
    const gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#fff' });
    gameOverText.setOrigin(0.5, 0.5);  // This will center the text
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
