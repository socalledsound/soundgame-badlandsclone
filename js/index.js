const gravity = 0.8;
const groundY = 450;
const xBarrier = 700;
const windowX = 0;
const windowIncrement = 0.1;
let windowMoving = false;
const groundColor = [120,60,90, 255];
const backgroundColor = [190,170,230, 255];
const myHeroStartOptions = {
    startX: 135,
    startY: groundY - 50,
    radius: 50,
    mainFillColor: [20,50,250], 
    secondaryFillColor: [210,50,200],
    eyeFillColor: [250,210,250, 255],
    secondaryEyeFillColor: [200,20,20, 255],
};

const speedBumpBallOptions = {
    startY: groundY - 20,
    radius: 20,
    mainFillColor: [10,250,10],
    secondaryFillColor: [247, 217, 20],
    eyeFillColor: [220,20,220],
    secondaryEyeFillColor: [200,20,20, 255],
}

const swarmBallOptions = {
    radius: 5,
    mainFillColor: [10,50,10],
    secondaryFillColor: [247, 217, 20],
    eyeFillColor: [220, 220,220],
    secondaryEyeFillColor: [200,20,20, 255],
}

const myHero = new PlayerBall(myHeroStartOptions);

const bumpBalls = Array.from({length: 4 }, (ball, i)=>{
    return new SpeedBumpBall({id: i, startX: i * 200, ...speedBumpBallOptions});
});

const swarmBalls = Array.from({length: 20 }, (ball, i)=>{
    const randomX = Math.random() * 500;
    return new SwarmBall({id: i, startX: i * 10 + randomX, startY: 100 + (i * Math.random() * 10), ...swarmBallOptions});
});

const clouds = Array.from({length: 6}, (cloud, i) => {
    return new Cloud(i * (Math.random()* 100) + (i*50), Math.random() * 300);
})

const numSounds = 8;
const sounds = Array.from({length: numSounds});
let soundCounter = 0;

let gameOver = false;

function preload(){
    sounds.forEach((sound, i) => {
        sounds[i] = loadSound(`assets/sounds/${i}.mp3`)
    })

    bgimage = loadImage('https://res.cloudinary.com/chris-kubick/image/upload/v1601335548/badlands-clone/06F43B23-AC51-4E39-8BA9-B5A175C15E6A_exugs3.png');


}



function setup(){
    createCanvas(800, 500);
    // frameRate(1);
    bumpBalls.forEach(bumpball => {
        bumpball.sound = sounds[soundCounter%numSounds];
        soundCounter++;
    })

}


function draw(){


    if(!gameOver){
        drawGame();
    } else if(gameOver) {
        background(0);
        myHero.sound.stop();
    
    }



}



function drawGame(){

    background(bgimage);
   
    // if(myHero.x > 300){
        
    // }


    if(myHero.x < 0 ){
        gameOver = true;
    }

    if(windowMoving){
        // bumpBalls.forEach(bumpball => bumpball.moveLeft(0.5, 0.1));
        // // clouds.forEach(cloud => {
        // //     cloud.x -=2
        // //     cloud.puffs.forEach(puff => {
        // //         puff.x -= 2;
        // //     })
        
        // // });
        if(!myHero.jumped){
            myHero.x -= myHero.driftSpeed;
            myHero.rotateEyeLeft(0.05);
        }
  
    }


    clouds.forEach((cloud, i) => {
        if(cloud.x < -100){
            //soundCounter++;
            cloud.x += 900;
            cloud.puffs.forEach(puff => {
                puff.x += 900
            })
            //bumpball.sound = sounds[soundCounter%numSounds];

        }
        cloud.move();
        cloud.display();

    })



    bumpBalls.forEach((bumpball, i) => {
        if(bumpball.x < -bumpball.radius){
            soundCounter++;
            bumpball.x = 850;
            bumpball.sound = sounds[soundCounter%numSounds];

        }
        bumpball.moveLeft(0.5, 0.05);
        bumpball.display();

    })

    swarmBalls.forEach(swarmball => {
        swarmball.display();
    })


    if(keyIsDown(UP_ARROW)){
            
        myHero.jump();
    }

    
        if(keyIsDown(LEFT_ARROW)){
            
            myHero.moveLeft(bumpBalls);
        }
    
        if(keyIsDown(RIGHT_ARROW)){
            windowMoving = true;
            if(myHero.x < xBarrier){
                myHero.moveRight(bumpBalls);
            }
            
        }
    
    let coin = Math.random();
    if(coin > 0.99){
        myHero.blink();
    }


    if(myHero.jumped){
        myHero.driftDown();
    }


    myHero.checkCollision(bumpBalls);
    myHero.display();
  
  

    //draw the ground
    fill(groundColor);
    rect(0,groundY, width, height-groundY);
}