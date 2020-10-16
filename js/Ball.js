class Ball {

    constructor(ballOptions){
        const {startX, startY, radius, mainFillColor, secondaryFillColor, eyeFillColor, secondaryEyeFillColor} = ballOptions;
        console.log(startX, startY);
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.radius = radius;
        this.originalFillColor = mainFillColor;
        this.mainFillColor = mainFillColor;
        this.secondaryFillColor = secondaryFillColor;
        this.eyeDistanceFromCenter = this.radius * 0.55;
        this.eyeAngle = 0;
        this.eyeAngleInc = 0.1;
        this.eyeX = Math.sin(this.eyeAngle) * this.eyeDistanceFromCenter + this.x;
        this.eyeY = Math.cos(this.eyeAngle) * this.eyeDistanceFromCenter + this.y;
        this.eyeSize = this.radius * 0.4; 
        this.pupilSizeStart = this.eyeSize/4;
        this.pupilSizeLarge = this.eyeSize;
        this.pupilSize = this.pupilSizeStart;
        this.pupilColorStart = [0, 0, 0];
        this.pupilColorSecondary = this.mainFillColor;
        this.pupilColor = this.pupilColorStart;
        this.eyeFillColor = eyeFillColor;
        this.originalEyeFillColor = eyeFillColor;
        this.secondaryEyeFillColor = secondaryEyeFillColor;
        this.stopEyeRotation = false;
        this.playing = false;
        this.blinking = false;

    }


    rotateEyeRight(rotateVal = this.eyeAngleInc){
        // if(!this.stopEyeRotation){
        //     this.eyeAngle -= rotateVal;
        // }
        this.eyeAngle -= rotateVal;
        this.eyeX = Math.sin(this.eyeAngle) * this.eyeDistanceFromCenter + this.x;
        this.eyeY = Math.cos(this.eyeAngle) * this.eyeDistanceFromCenter + this.y;

    }

    rotateEyeLeft(rotateVal = this.eyeAngleInc){
        // if(!this.stopEyeRotation){
        //     this.eyeAngle += rotateVal;
        // }
        
        this.eyeAngle += rotateVal;
        this.eyeX = Math.sin(this.eyeAngle) * this.eyeDistanceFromCenter + this.x;
        this.eyeY = Math.cos(this.eyeAngle) * this.eyeDistanceFromCenter + this.y;

    }

    blink(){
        this.pupilColor = this.pupilColorSecondary;
        this.pupilSize = this.eyeSize;
        this.blinking = true;
        setTimeout( () => this.unblink(), 500);
    }

    unblink = () => {
        this.pupilSize = this.eyeSize;
        this.pupilColor = this.pupilColorStart;
        this.blinking = false;
    }


    display(){
        

        if(this.playing){
            this.mainFillColor = this.secondaryFillColor;
            this.eyeFillColor = this.secondaryEyeFillColor;
            this.eyeSize = this.radius * 0.95;
            this.pupilSize = this.pupilSizeLarge;
        } else if (this.blinking){
            this.pupilColor = this.pupilColorSecondary;
            this.pupilSize = this.eyeSize;
        }  else if (this.jumped){
            this.mainFillColor = this.secondaryFillColor;
            this.eyeFillColor = this.originalEyeFillColor;
            this.eyeSize = this.radius * 1.1;
            this.pupilSize = this.pupilSizeStart;
        
        } else{
            this.mainFillColor = this.originalFillColor;
            this.eyeFillColor = this.originalEyeFillColor;
            this.eyeSize = this.radius * 0.4;
            this.pupilSize = this.pupilSizeStart;
        }


        //main body
        fill(this.mainFillColor);
        stroke(0)
        ellipse(this.x, this.y, this.radius * 2);

        //eye
        stroke(255);
        fill(this.eyeFillColor);
        ellipse(this.eyeX, this.eyeY, this.eyeSize);

        //pupil
        fill(this.pupilColor);
        ellipse(this.eyeX, this.eyeY, this.pupilSize);

    }

}


class PlayerBall extends Ball{
    constructor(ballOptions){
        super(ballOptions);
        this.rotating = false;
        this.rotateCenterX = 0;
        this.rotateCenterY = 0;
        this.rotateLength = 0;
        this.rotateAroundTheta = 0;
        // this.rotateAroundThetaLeft = 2.1;
        this.rotateAroundInc = 0.01;
        this.rotateCounter = 0;
        this.rotateEnd = 3;
        this.speed = 5;
        this.driftSpeed = 1.5;
        this.jumpVal = 20;
        this.jumped = false;
        
    }



    checkCollision(bumpballs){
        bumpballs.forEach( bumpball =>{
            const distanceX = bumpball.x - this.x;
            const distanceY = bumpball.y - this.y;
            const minDistance = bumpball.radius + this.radius;

            let distance = sqrt(distanceX * distanceX + distanceY * distanceY);
            if(distance < minDistance){
                if(!this.rotating){
                    if(this.x > bumpball.x){
                        this.rotateAroundTheta = 2.1;
                    } else if(this.x < bumpball.x){
                        this.rotateAroundTheta = -2.1;
                    }
                }


                if(this.x - this.radius < bumpball.x + bumpball.radius){
                    // this.moveRight();
                    this.sound = bumpball.sound;
                    if(!this.rotating){
                        this.sound.loop();
                        this.playing = true
                        bumpball.playing = true;
                        this.playbackSpeed = 1
                        this.sound.rate(this.playBackSpeed);
                    }



                    this.rotating = true;
                    this.rotateCenterX = bumpball.x;
                    this.rotateCenterY = bumpball.y;
                    this.rotateLength = this.radius + bumpball.radius;
                   

     

                    this.rotateRight(this.rotateAroundInc, bumpballs);
                }
            }
        })
    }


    rotateRight(rotateVal=this.rotateAroundInc, bumpballs){
  
        this.setRotationValues(rotateVal);

         if(this.y <= this.startY){
            this.rotateEyeLeft(0.03);
            // this.centerEye(bumpballs);
            this.calculateRotation(rotateVal);   
            } else {
                this.stopRotation(1, bumpballs);
               }  
    }

    rotateLeft(rotateVal=this.rotateAroundInc, bumpballs){
        this.setRotationValues(rotateVal);

        if(this.y <= this.startY){
             this.rotateEyeLeft(0.03);
            this.centerEye(bumpballs);
            this.calculateRotation(rotateVal);
             
        } else {
            this.stopRotation(-1, bumpballs);
           }  
    }

    moveDown(){
        if(this.y <= this.startY){
            this.y+=0.5;
            this.x += 0.25;
        }
        
    }

    moveRight(bumpballs){
        this.rotateEyeRight(0.4);

        if(!this.rotating){
            this.x += this.speed; 
        } else {
            this.rotateRight(0.1, bumpballs);
        }
        
        
       
    }

    moveLeft(bumpballs){
        this.rotateEyeLeft(0.2);this.rotateEyeLeft(0.2);
       
        if(!this.rotating){
            this.x -= this.speed; 
        } else {
            this.rotateLeft(-0.1, bumpballs);
        }
       
    }


    jump(){
        this.y -= this.jumpVal;
        this.rotateEyeLeft(0.8);
        this.jumped = true;
        this.playing = false;
    }

    driftDown(){
   
        if(this.x <= xBarrier){
            this.x += 0.25;
        }   
        
        if(this.y <= this.startY){
            this.y+=0.5;
            this.rotateEyeLeft(0.05);
        } else {
            this.jumped = false;
        }
    }


    setRotationValues(rotateVal){
        // this.eyeFillColor = [220,20,20];
        // this.eyeSize = this.radius * 0.95;
        this.setPlaybackSpeed(rotateVal);
    }

    centerEye(bumpballs){
        const playingBumpball = bumpballs.filter(bumpball => bumpball.playing);
        if(playingBumpball){
            const dx = playingBumpball.x - this.eyeX;
            const dy = playingBumpball.y - this.eyeY;
            const distance = sqrt(dx*dx + dy * dy);
            const stopDistance = playingBumpball.radius + this.radius - (this.radius - this.eyeDistanceFromCenter);
            if(distance < stopDistance){
                // this.rotateEyeRight(0.3, bumpballs)
                this.stopEyeRotation = true;
                bumpballs[playingBumpball.id].stopEyeRotation = true;
             
            } else {
                this.rotateEyeRight(0.1, bumpballs)
            }
        } 


    }

    calculateRotation(rotateVal){
        
        this.x = (Math.sin(this.rotateAroundTheta) * this.rotateLength + this.rotateCenterX);
        this.y = (Math.cos(this.rotateAroundTheta) * this.rotateLength + this.rotateCenterY);
        this.rotateAroundTheta-=rotateVal;
        
    }

    stopRotation(direction = 1, bumpballs){
        this.x += 10 * direction;
        this.y = this.startY;
        this.rotating = false;
        this.rotateAroundThetaRight = 0;
        this.rotateCounter = 0;
        this.sound.stop();
        this.playing = false;
        this.resetEye();
        bumpballs.forEach(bumpball => bumpball.playing = false);
    }

    resetEye(){
        this.eyeFillColor = [220,20,220];
        this.eyeSize = this.radius * 0.4;
    }
    

    setPlaybackSpeed(rotateVal){
        this.playbackSpeed = map(rotateVal, -0.2, 0.2, -2, 2);
        this.playbackSpeed = constrain(this.playbackSpeed, -2, 2);
        this.sound.rate(this.playbackSpeed * -1);
    }


}



class SpeedBumpBall extends Ball {
    constructor(ballOptions){
        super(ballOptions);
        this.eyeAngleInc = 0.01;
      
        this.speed = 0.5;
    }

    moveLeft(moveVal, rotateVal){
        this.x -= moveVal;
        this.eyeX += moveVal;

        if(this.playing){
            // this.mainFillColor = this.secondaryFillColor;
            // this.eyeFillColor = this.secondaryEyeFillColor;
            // this.eyeSize = this.radius * 0.95;
            this.rotateEyeRight(rotateVal/10);    
        } else {
            // this.mainFillColor = this.originalFillColor;
            // this.eyeFillColor = this.originalEyeFillColor;
            // this.eyeSize = this.radius * 0.4;
            this.rotateEyeLeft(rotateVal);
        }
       
    }


}



