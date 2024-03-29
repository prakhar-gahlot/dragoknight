
window.addEventListener('load',function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1500;
  canvas.height = 500;

  class InputHandler {
    constructor(game){
      this.game = game;
      const vm = this;
      window.addEventListener('keydown',function(e){
        
        if((e.key ==='ArrowUp'||e.key==='ArrowDown') && vm.game.keys.indexOf(e.key)=== -1){
          vm.game.keys.push(e.key);
          
        }
      });
      window.addEventListener('keyup',e =>{
        if((e.key==='ArrowUp'|| e.key==='ArrowDown' )&& this.game.keys.indexOf(e.key)!=-1){
          this.game.keys.splice(this.game.keys.indexOf(e.key),1);
         
        }
      });
      window.addEventListener('keydown',e => {
        if(e.key===' '){
          this.game.player.shootTop(); 
          
        }
       });
      window.addEventListener('keydown',e =>{
        if(e.key==='d') this.game.debug = !this.game.debug;
      })
      
      

                              
                        
    }
    
  }
  
  class Projectile{
    constructor(game,x,y){
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
      this.image = document.getElementById('projectile');
    }
    update(){
      this.x += this.speed;
      this.y += Math.random()*.5
      this.y -= Math.random()*.5
      if(this.x >= this.game.width*0.8) this.markedForDeletion = true;
    }
    draw(context){
      context.drawImage(this.image,this.x,this.y)
    }
  }
  
  class Particle{
    constructor(game,x,y){
      this.game = game;
      this.x = x;
      this.y = y;
      this.image = document.getElementById('gears');
      this.frameX = Math.floor(Math.random()*3);
      this.frameY = Math.floor(Math.random()*3);
      this.spriteSize = 50;
      this.sizeModifier = (Math.random()*0.5 + 0.5).toFixed(1);
      this.size = this.spriteSize * this.sizeModifier;
      this.speedX = Math.random()*6 -3;
      this.speedY = Math.random()*-15;
      this.gravity = 0.5;
      this.markedForDeletion = false;
      this.angle = 0;
      this.va = Math.random()*0.2 -0.1;
      this.bouncedNum = 0;
      this.maxBounce = Math.floor(Math.random()*4);
      this.bottomBounceBoundary = Math.random()*80 +60;
    
    }
    update(){
      this.angle += this.va;
      this.speedY += this.gravity;
      this.x -=this.speedX +this.game.speed;
      this.y +=this.speedY;
      if(this.y > this.game.height +this.size || this.x < 0 -this.size) this.markedForDeletion = true;
      if(this.y>=this.game.height-this.bottomBounceBoundary && this.speedY>=0 && this.bouncedNum <= this.maxBounce){
        this.bouncedNum +=1;
        this.speedY = -this.speedY*0.7;
        this.va -= this.speedX*0.02;
        this.speedX *= 0.5
      }
    }
    draw(context){
      context.save();
      context.translate(this.x,this.y);
      context.rotate(this.angle);
      
      context.drawImage(this.image,this.frameX*this.spriteSize,this.frameY*this.spriteSize,
                        this.spriteSize,this.spriteSize,this.size*-0.5,this.size*-0.5,this.size,this.size);

      context.restore();
    } 
    
  }
  class Explosion{
    constructor(game,x,y){
      this.game = game;
      this.x = x;
      this.y = y;
      this.height = 200;
      this.frameX = 0;
      this.timer = 0;
      this.interval = 1000/15;
      this.markedForDeletion = false;
      this.maxFrame = 8;
    }
    update(deltaTime){
      this.x -= this.game.speed;
      this.timer +=deltaTime;
      if(this.timer >= this.interval){
        this.interval = 0;
        console.log(this.frameX)
        
        if(this.frameX <this.maxFrame) this.frameX++;
        else   this.markedForDeletion = true;
      }
      
      
    }
    draw(context){
      // context.drawImage(this.image,this.x,this.y)
          context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,this.width,this.height)
     }
  }
  class SmokeExplosion extends Explosion{
    constructor(game,x,y){
     super(game,x,y);
     this.width = 200; 
     this.image = document.getElementById('smokeExplosion'); 
      
      
    }
  }
    class FireExplosion extends Explosion{
    constructor(game,x,y){
     super(game,x,y);
     this.width = 200; 
     this.image = document.getElementById('fireExplosion'); 
      
      
    }
  }
  class Player{
    constructor(game){
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrameX = 37;
      this.speedY = 0;
      this.maxspeed = 5;
      this.projectiles = [];
      this.image = document.getElementById('player');
      this.powerUp = false;
      this.powerUpTimer = 0;
      this.maxPowerUpTime = 5000;
    }
    update(deltaTime){
      if(this.frameX <this.maxFrameX) this.frameX++
      else this.frameX = 0;
      if(this.powerUp == true){
        if(this.powerUpTimer<this.maxPowerUpTime) {
          this.powerUpTimer += deltaTime;
          this.frameY = 1;
          this.game.ammo +=0.1;
        }
        else {
          this.powerUp = false;
          this.powerUpTimer = 0;
          this.frameY = 0;
        }
      }
      if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxspeed;
      else if(this.game.keys.includes('ArrowDown')) this.speedY = this.maxspeed;
      else this.speedY = 0;
      this.y += this.speedY;
      if(this.y > this.game.height-this.height*0.5) this.y = this.game.height-this.height*0.5;
      if(this.y <-this.height*0.5) this.y = -this.height*0.5;
      

      // projectiles
      this.projectiles.forEach(projectile =>{
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
      
      
    }
    draw(context){
      context.fillStyle = 'black';
      if(this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height);
    context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height)
      this.projectiles.forEach(projectile =>{
        projectile.draw(context);
      });
    }
    shootTop(){
      if(this.game.ammo >0) {
      this.projectiles.push(new Projectile(this.game,this.x +80,this.y+30));
      if(this.powerUp)  this.projectiles.push(new Projectile(this.game,this.x +80,this.y+170));
       
      this.game.ammo -= 1;
      }
      
    }
    
  }
  
  class Enemy{
    constructor(game){
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random()* -3 -0.5;
      this.markedForDeletion = false;
      this.frameX = 0;
      
    }
    update(){
      this.x += this.speedX -this.game.speed;
      if(this.frameX<this.maxFrameX) this.frameX++;
      else this.frameX = 0;
      if(this.lives <=0 && !this.game.gameOver) {
        this.markedForDeletion = true;
        if(this.frameX %2 ==0) this.game.explosions.push(new SmokeExplosion(this.game,this.x,this.y));
        else this.game.explosions.push(new FireExplosion(this.game,this.x,this.y));
        console.log(this.game.explosions)
        for(let i=0;i<this.gears;i++){
          this.game.particles.push(new Particle(this.game,this.x+this.width*0.5,this.y+this.height*0.5))
        }
        if (this.type=='hivewhale') {
          for(let i =0;i<=4;i++){
          this.game.enemies.push(new Drone(this.game,this.x+i*10,this.y+i*5))
          }
        }
        this.game.score += this.scorePoint;
        console.log(this.game.score)
      }
      if(this.x + this.width <0) {
        this.markedForDeletion = true;
      }
    }
    draw(context){
      // context.fillStyle = 'red';
      // context.fillRect(this.x,this.y,this.width,this.height);
     if(this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height);
      context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height)
      context.font = '20px Helvetica';
      context.fillStyle = 'red';
      context.fillRect(this.x,this.y+5,this.lives*10,4);
    }
  }
  class Angler1 extends Enemy{
    constructor(game){
      super(game);
      this.width = 228;
      this.height = 169;
      this.lives = 7;
      this.scorePoint = 5;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById('angler1');
      this.frameY = Math.floor(Math.random()*3);
      this.maxFrameX = 37;
      this.type = 'regular';
      this.gears = 5;
      
    }
  }
  class Angler2 extends Enemy{
    constructor(game){
      super(game);
      this.width = 213;
      this.height = 165;
      this.lives = 9;
      this.scorePoint = 12;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById('angler2')
      this.frameY = Math.floor(Math.random()*2);
      this.maxFrameX = 37;
      this.type = 'regular';
      this.gears = 5;
    }
  }
  class LuckyFish extends Enemy{
    constructor(game){
      super(game)
      this.width = 99;
      this.height = 95;
      this.lives = 3;
      this.scorePoint = 25;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById('lucky');
      this.frameY = Math.floor(Math.random()*2);
      this.type = 'lucky';
      this.maxFrameX = 37;
      this.gears = 3;
    }
  }
    class Hivewhale extends Enemy{
    constructor(game,x,y){
      super(game)
      this.width = 400;
      this.height = 227;
      this.lives = 15;
      this.scorePoint = 35;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById('hivewhale');
      this.frameY = 0;
      this.type = 'hivewhale';
      this.maxFrameX = 37;
      this.gears = 9;
      this.speedX = Math.random()* -1.2 -0.2;
    }
  }
    class Drone extends Enemy{
    constructor(game,x,y){
      super(game)
      this.width = 115;
      this.height = 95;
      this.lives = 3;
      this.scorePoint = 25;
      this.x = x;
      this.y = y;
      this.image = document.getElementById('drone');
      this.frameY = Math.floor(Math.random()*2);
      this.type = 'drone';
      this.maxFrameX = 37;
      this.gears = 3;
      this.speedX = Math.random()* -4.2 -0.5;
    }
  }
  class Layer{
    constructor(game,image,speedModifier){
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1768;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update(){
      if(this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context){
      context.drawImage(this.image,this.x,this.y);
      context.drawImage(this.image,this.x+this.width,this.y);
      
    }
  }
  
  class Background{
    constructor(game){
      this.game = game;
      this.image1 = document.getElementById('layer1');
      this.layer1 = new Layer(this.game,this.image1,0.2);

      this.image2 = document.getElementById('layer2');
      this.layer2 = new Layer(this.game,this.image2,0.4);

      this.image3 = document.getElementById('layer3');
      this.layer3 = new Layer(this.game,this.image3,1);

      this.image4 = document.getElementById('layer4');
      this.layer4 = new Layer(this.game,this.image4,1.5);

      this.layers = [this.layer1,this.layer2,this.layer3];
    }
    
    update(){
      this.layers.forEach(layer =>{layer.update()})
    }
    draw(context){
      this.layers.forEach(layer =>{layer.draw(context)})
    }
  }
  
  class UI {
    constructor(game){
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Bangers';
      this.color = 'yellow';
      
    }
    draw(context){
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = 'black';
      context.font = '20px Bangers';
      context.fillText('Score : '+this.game.score,20,40);
      context.fillText('time : '+Math.floor(this.game.gameTime/1000),180,40);
      

      // gameOver message
      let message1 = '';
      let message2 = '';
      if(this.game.gameOver){
        context.textAlign = 'center';
       

        if(this.game.score >= this.game.winningScore){
          message1 = 'You Win';
          message2 = 'Well Done';
          this.game.gameWon = true;
        }
        else if(!this.game.gameWon){
          message1 = 'You Lose';
          message2 = 'Better luck next time :)'
        }
      }
      context.font = '50px Bangers';
      context.fillText(message1,this.game.width *0.5,this.game.height*0.5);
      context.fillText(message2,this.game.width *0.5,this.game.height*0.6);
      if(this.game.player.powerUp) context.fillStyle = 'red';
      for (let i =0; i<this.game.ammo;i++){
        context.fillRect(20 + 5*i,50,3,20)
      }
      context.restore();
    }
  }
  
  class Game{
    constructor(width,height){
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.UI = new UI(this);
      this.input = new InputHandler(this);
      this.background = new Background(this);
      this.keys = [];
      this.particles = [];
      this.explosions = [];
      this.ammo = 10;
      this.maxAmmo = 50
      this.ammoTimer = 0;
      this.enemyTimer = 0;
      this.ammoInterval = 500;
      this.enemyInterval = 3000;
      this.enemies = [];
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 300;
      this.gameTime = 0;
      this.timeLimit = 300000;
      this.speed = 1;
      this.debug = false;
      this.gameWon = false
    }
    update(deltaTime){
      this.background.update();
      this.background.layer4.update();
      if(this.score >=this.winningScore || this.gameTime >=this.timeLimit ){
        this.gameOver = true;
      }
      this.player.update(deltaTime);
      game.ammoTimer += deltaTime;
      game.enemyTimer += deltaTime;
      if (game.ammoTimer > game.ammoInterval){
        if (game.ammo < game.maxAmmo) {game.ammo ++;}
        game.ammoTimer = 0;  
      }

      this.particles.forEach(particle =>{                    // particle
        particle.update();
      })
      this.particles.filter(particle => !particle.markedForDeletion);
      this.explosions.forEach(explosion =>{explosion.update(deltaTime)})
      this.explosions = this.explosions.filter(explosion =>!explosion.markedForDeletion);
      this.enemies.forEach(enemy =>{
        enemy.update();                                            //enemy
        if(this.checkCollision(this.player,enemy)){
          if(enemy.type=='lucky') {
            this.player.powerUp = true;
            this.player.powerUpTimer = 0;
          }
          else this.score -= 20;
          enemy.markedForDeletion = true;
          if(enemy.frameX %2 ==0) this.explosions.push(new SmokeExplosion(this,enemy.x,enemy.y));
          else this.explosions.push(new FireExplosion(this,enemy.x,enemy.y));
          for(let i=0;i<enemy.gears;i++){
          this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5))
        }
          
        }
        this.player.projectiles.forEach(projectile =>{            // projectile
          if (this.checkCollision(projectile,enemy)){
            projectile.markedForDeletion = true;
            enemy.lives--;
            
            
          }
        })
      });
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

      if(this.enemyTimer >this.enemyInterval && !this.gameOver){
        this.addEnemy();
        this.enemyTimer = 0;
      }
    }
    draw(context){
      this.background.draw(context)
      this.player.draw(context);
      
      this.enemies.forEach(enemy =>{
        enemy.draw(context);
      });
      this.background.layer4.draw(context);
      this.UI.draw(context);
      this.particles.forEach(particle => particle.draw(context));
      this.explosions.forEach(explosion => explosion.draw(context));
    }
    addEnemy(){
      const randomize = Math.random();
       if(randomize<0.35) this.enemies.push(new Angler1(this));
       else if(randomize<0.7) this.enemies.push(new Angler2(this));
       else if(randomize <0.9)this.enemies.push(new LuckyFish(this));
      else this.enemies.push(new Hivewhale(this));
      console.log(this.enemies);
    }
    checkCollision(rect1,rect2){
      return(
        rect1.x < rect2.x + rect2.width &&
        rect1.x+rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
        
      )
    }
  }

  const game = new Game(canvas.width,canvas.height);
  let lastTime = 0;
  let gameTime = 0;
  //animation loop
  function animate(timestamp){
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.gameTime += deltaTime;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    
    requestAnimationFrame(animate);
    
  }

  animate(0);
  
})
