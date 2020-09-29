class Cloud {
    constructor(x, y,){
        this.x = x;
        this.y = y;
        this.baseWidth = Math.random() * 100 + 50;
        this.baseHeight = Math.random() * 50 + 25;
        this.speed = Math.random() * 0.5 + 0.25;
        this.numPuffs = Math.floor(Math.random()*20) + 20;
        this.puffs = Array.from({length: this.numPuffs});
        this.puffs.forEach((puff, i) => {
            
            const coin1 = Math.random() > 0.5 ? -1 : 1;
            const coin2 = Math.random() > 0.5 ? -1 : 1;
            const randomX = Math.sin(Math.random()) * this.baseWidth/2.2 * coin1 + this.x;
            const randomY = Math.cos(Math.random()) * this.baseHeight/2.2 * coin2 + this.y;
            const randomWidth = 10 + Math.random() * this.baseWidth;
            const randomHeight = 5 + Math.random() * this.baseWidth/2;
    
            this.puffs[i] = new Puff(randomX, randomY, randomWidth, randomHeight, this.speed);
        })

        
    }


    move(){
        this.x-=this.speed;
        this.puffs.forEach(puff => {
            puff.move();
        })
    }

    display(){
        fill(255, 255, 255, 220);
        noStroke();
        // ellipse(this.x, this.y, this.baseWidth, this.baseHeight);
        this.puffs.forEach(puff => {
            puff.display();
        })


    }

}

class Puff {
    constructor(x, y, width, height, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    move(){
        this.x -= this.speed;
    }

    display(){

        fill(255, 255, 255, 220);
        noStroke();
        ellipse(this.x, this.y, this.width, this.height);
    }
}