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
    this.load.audio('bgMusic', 'assets/music/music.mp3');
    this.load.image('musicIcon', 'assets/img/music_ico.png');
    this.load.audio('gameOverSound', 'assets/music/gameover.mp3');


}

function create() {
    this.backgroundMusic = this.sound.add('bgMusic', { volume: 1, loop: true });
    this.backgroundMusic.setVolume(0.2);

    this.spawnDelay = 700;  // Initial delay before spawning

    this.speedMultiplier = 1;  // This value multiplies with the speed
    this.minBlockSize = 40;  // Minimum size of block
    this.maxBlockSize = 60;  // Maximum size of block
    
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', fontFamily: 'Micro', fill: '#fff' });

    this.dodgerGameText = this.add.text(400, 300, 'skimble', { fontSize: '48px', fontFamily: 'Micro', fill: '#fff' });
    this.dodgerGameText.setOrigin(0.5, 0.5);

    this.musicButton = this.add.image(760, 30, 'musicIcon')
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .setScale(0.2)
    .on('pointerdown', function() {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
            this.musicButton.setTint(0x555555);
        } else {
            this.backgroundMusic.resume();
            this.musicButton.clearTint();
        }
    }, this);

    
    this.startGameButton = this.add.image(400, 400, 'startButton')
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .setScale(0.4)
    .on('pointerdown', () => {
        this.startGameButton.visible = false;
        startGame.call(this);
    });


    // Initial setup will go here
    // Create the player's rectangle
    this.player = this.add.rectangle(400, 570, 50, 30, 0x00ff00);
    // Enable physics on the player
    this.physics.world.enable(this.player);

    // Enable arrow key inputs
    this.cursors = this.input.keyboard.createCursorKeys();

    // Keep player within game boundaries
    this.player.body.setCollideWorldBounds(true);
    //this.player.body.drag.x = 1000; 


    // Create a group to hold our falling objects
    this.fallingObjects = this.physics.add.group({
        gravityY: 300
    });
 
    function spawnObject() {
        const x = Phaser.Math.Between(25, 775);  
        
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    
        const size = Phaser.Math.Between(this.minBlockSize, this.maxBlockSize); 
        const fallingObject = this.add.rectangle(x, -10, size, size, 0xff0000);
        this.physics.world.enable(fallingObject);
    
        fallingObject.body.setGravityY((300 + (Math.floor(this.score / 10) * 10)) * this.speedMultiplier);
    
        this.fallingObjects.add(fallingObject);
    }
    
    
    
    
    



this.physics.add.collider(this.player, this.fallingObjects, endGame, null, this);


function spawnMultipleObjects() {
    const numberOfBlocks = Phaser.Math.Between(1, 4);  // Spawns between 1 to 4 blocks at once
    for (let i = 0; i < numberOfBlocks; i++) {
        spawnObject.call(this);
    }
}


function initGame() {
    
    this.time.addEvent({
        delay: 15000,  // 15 seconds
        callback: function() {
            this.speedMultiplier += 0.2;  // Increase speed by 20% every 15 seconds
            this.minBlockSize -= 2;      // Decrease min size a bit
            this.maxBlockSize += 2;      // Increase max size a bit
        },
        callbackScope: this,
        loop: true
    });

     // Set a timed event to spawn objects
     this.time.addEvent({
        delay: this.spawnDelay,
        callback: spawnObject,
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: 15000,  // 15 seconds
        callback: function() {
            this.spawnDelay = Math.max(this.spawnDelay * 0.85, 100);  // Reduce the spawn delay by 15%, but don't go lower than 100ms
            this.time.addEvent({
                delay: this.spawnDelay,
                callback: spawnMultipleObjects,
                callbackScope: this,
                loop: true
            });
        },
        callbackScope: this,
        loop: true
    });
        
}

function startGame() {
    this.backgroundMusic.play();

    this.dodgerGameText.visible = false;

    // Start score increment
    this.scoreIncrementer = this.time.addEvent({
        delay: 1000, // every second
        callback: function() {
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        },
        callbackScope: this,
        loop: true
    });

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
    this.backgroundMusic.stop();
    this.sound.play('gameOverSound'); // Play the game over sound

    this.physics.pause();

     // Stop the score increment
    if (this.scoreIncrementer) {
        this.scoreIncrementer.destroy();
    }
    if (this.spawnTimer) {
        this.spawnTimer.destroy();
    }
    
    if (this.spawnDelayTimer) {
        this.spawnDelayTimer.destroy();
    }
    this.scoreText.visible = false;


  /*  // Stop spawning of objects
    if (this.objectSpawner) {
        this.objectSpawner.destroy();
    }

    if (this.multipleObjectSpawner) {
        this.multipleObjectSpawner.destroy();
    } */



    // Display Game Over text
    const gameOverText = this.add.text(400, 250, 'Game Over', { fontSize: '48px', fontFamily: 'Micro', fill: '#fff' });
    gameOverText.setOrigin(0.5, 0.5);  // This will center the text

    // Display the final score
    const finalScoreText = this.add.text(400, 300, 'Score: ' + this.score, { fontSize: '32px', fontFamily: 'Micro', fill: '#fff' });
    finalScoreText.setOrigin(0.5, 0.5);  // This will center the text

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
