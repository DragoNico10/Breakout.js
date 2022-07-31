var edges, paddle, canvas, cpuMode, isTouching=false
var rightKey; var leftKey
var blocksleft=0
var rows=[]
var powerupSprites=[]
var balls=[]
var gameState=0
var speedMultiplier=1
var powerupList=[
    'triplicate',
    'launchMore',
    'explotionBall',
    'lengthenPaddle',
    'shortenPaddle',
    'finishLevel'
]
var ballBounceOff, powerupSound, explotionSound

let startGame=()=>{
    gameState=1
        balls[0].velocityY=-4*speedMultiplier
        balls[0].velocityX=random([-4, 4])*speedMultiplier
}
let createBlockSprites=(y, w, h)=>{
    let r=Math.round(random(0, 255))
    let g=Math.round(random(0, 255))
    let b=Math.round(random(0, 255))
    let row=new Group()
    for(let x = 100;x<625;x+=60){
        let sprite = createSprite(x, y, w, h)
        blocksleft++
        sprite.draw=()=>{
            push()
            fill(r, g, b)
            rectMode(CENTER)
            rect(0, 0, w, h)
            pop()
        }
        row.add(sprite)
    }
    return row
}
let createBlockSprite=(x, y, w, h)=>{
    let r=Math.round(random(0, 255))
    let g=Math.round(random(0, 255))
    let b=Math.round(random(0, 255))
    let sprite = createSprite(x, y, w, h)
    blocksleft++
    sprite.draw=()=>{
        push()
        fill(r, g, b)
        rectMode(CENTER)
        rect(0, 0, w, h)
        pop()
    }
    return sprite
}
let createBall=(x, y, vX, vY, type)=>{
    let ball, color
    ball=createSprite(x, y, 10, 15)
    if(type==='normal'){
        color='white'
    }
    if(type==='explosive'){
        color='orange'
    }
    ball.draw=()=>{
        push()
        fill(color)
        ellipse(0, 0, 15)
        pop()
    }
    ball.setCollider('circle', 0, 0, 10)
    ball.velocityX=vX*speedMultiplier
    ball.velocityY=vY*speedMultiplier
    ball.type=type
    return ball
}
let createPowerupSprite =(type, x, y, i)=>{
    let powerupSprite
    if(type==='triplicate'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            fill('green')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40, 40)
            fill('white')
            ellipse(0, -10, 7)
            ellipse(10, 10, 7)
            ellipse(-10, 10, 7)
            stroke(255)
            line(4, -5, 9, 8)
            line(-4, -5, -9, 8)
            pop()
        }
        powerupSprite.balli=i
    }
    if(type==='launchMore'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            rectMode(CENTER)
            fill('green')
            noStroke()
            rect(0, 0, 40, 40)
            fill('white')
            ellipse(10, -10, 7)
            ellipse(-10, -10, 7)
            rect(0, 10, 25, 5)
            stroke(255)
            line(10, -10, 3, 5)
            line(-10, -10, -3, 5)
            pop()
        }
    }
    if(type==='explotionBall'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            rectMode(CENTER)
            fill('cyan')
            noStroke()
            rect(0, 0, 40, 40)
            fill('white')
            triangle(5, 0, 0, -20, -5, 0)
            triangle(0, 0, 10, -15, -5, -5)
            triangle(0, 3, 0, -7, 15, -5)
            triangle(15, 15, 0, -15, -5, 0)
            triangle(5, 0, 0, 15, -5, 0)
            triangle(5, 0, -10, -15, -5, 0)
            triangle(15, 15, 0, -15, -5, 0)
            triangle(0, 3, 0, -7, -15, 3)
            fill('orange')
            ellipse(0.5, -2.5, 7)
            pop()
        }
    }
    if(type==='lengthenPaddle'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            rectMode(CENTER)
            fill('blue')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40)
            fill('white')
            rect(0, 0, 15, 5)
            stroke(255)
            line(10, 0, 15, 0)
            line(15, 0, 12, -3)
            line(15, 0, 12, 3)
            line(-10, 0, -15, 0)
            line(-15, 0, -12, -3)
            line(-15, 0, -12, 3)
            pop()
        }
    }
    if(type==='shortenPaddle'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            fill('red')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40)
            fill('white')
            rect(0, 0, 15, 5)
            stroke(255)
            line(10, 0, 15, 0)
            line(10, 0, 13, -3)
            line(10, 0, 13, 3)
            line(-10, 0, -15, 0)
            line(-10, 0, -13, -3)
            line(-10, 0, -13, 3)
            pop()
        }
    }
    //this one is more difficult because it uses stars
    if(type==='finishLevel'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            fill('gold')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40)
            fill('white')
            rect(-3, 3, 50/3, 25/3)
            let r1=2
            let r2=10
            translate(-20, -20)
            beginShape();
            vertex(0-r1, 0-r1);
            vertex(0, 0-r2)
            vertex(r1, 0-r1)
            vertex(r2, 0)
            vertex(r1, r1)
            vertex(0, r2)
            vertex(0-r1, r1)
            vertex(0-r2, 0)
            endShape();
            translate(40, 40)
            beginShape();
            vertex(0-r1, 0-r1);
            vertex(0, 0-r2)
            vertex(r1, 0-r1)
            vertex(r2, 0)
            vertex(r1, r1)
            vertex(0, r2)
            vertex(0-r1, r1)
            vertex(0-r2, 0)
            endShape();
            translate(-20,-20)
            fill('red')
            ellipse(3, -3, 15)
            fill('gold')
            ellipse(3, -3, 10)
            stroke('red')
            strokeWeight(3)
            line(0, -8.5, 6, 2.5)
            pop()
        }
    }
    if(powerupSprite){
        powerupSprite.type=type
        powerupSprite.velocityY=4*speedMultiplier
        powerupSprites.push(powerupSprite)
    }
}
let getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  };
  let drawPaddle=()=>{
    push()
    rectMode(CENTER)
    fill(0, 0, 255)
    rect(paddle.x, paddle.y, paddle.width, 40)
    pop()
  }
function preload(){
    ballBounceOff=loadSound('assets/retro-game-hit-6-sound-effect-039136185_nw_prev.m4a')
    powerupSound=loadSound('assets/retro-game-jump-01-sound-effect-076827096_nw_prev.m4a')
    explotionSound=loadSound('assets/y2mate.com - Retro Explosion Sound Effect.mp3')
}
function setup(){
    cpuMode= createCheckbox('', false);
    cpuMode.position(0, 0)
    cpuMode.size(200, 200)
    canvas=createCanvas(700, 700)
    balls.push(createBall(200, height-40, 0, 0, 'normal'))
    paddle=createSprite(200, height, 100, 40)
    paddle.draw=()=>{}
    edges=createEdgeSprites()
    for(let y=100; y<=300; y+=40){
    rows.push(createBlockSprites(y, 50, 25))
    }
    rightKey=createSprite(650, 50, 80, 80)
    rightKey.draw=()=>{
        push()
        rectMode(CENTER)
        fill('white')
        rect(0, 0, 80, 80)
        strokeWeight(7)
        stroke(0)
        line(-20, 0, 20, 0)
        line(20, 0, 0,-20)
        line(20, 0, 0, 20)
        pop()
    }
    rightKey.debug=1
    leftKey=createSprite(50, 50, 80, 80)
    leftKey.draw=()=>{
        push()
        rectMode(CENTER)
        fill('white')
        rect(0, 0, 80, 80)
        strokeWeight(7)
        stroke(0)
        line(-20, 0, 20, 0)
        line(-20, 0, 0,-20)
        line(-20, 0, 0,20)
        pop()
    }
}
    
    


function draw(){
    clear()
    background(0)
    //CPU mode will only follow the first ball in the array and doesn't have an AI, it will only follow the x position of the ball.
    if(cpuMode.checked()&&!(balls[0]==null)){
        if(gameState==0){
            startGame()
        }
        if(paddle.x>balls[0].x){
            paddle.x-=6*speedMultiplier
        }
        if(paddle.x<balls[0].x){
            paddle.x+=6*speedMultiplier
        }
    }
    else if(cpuMode.checked()&&balls[0]==null){
        location.reload()
    }
    push()
    textAlign(LEFT)
    fill(255)
    text('Enable CPU mode', 20, 14)
    pop()
    if(gameState==0){
        balls[0].x=paddle.x
        textAlign(CENTER)
        push()
        noStroke()
        textSize(20)
        fill(255)
        text('To start press space and move width the right and arrow keys,', width/2, height/2-10)
        text('or just enable CPU mode', width/2, height/2+15)
        pop()
    }
    //Unused
    /*if(ball.y>height+10){
        gameState=2
    }*/
    //Unused
    /*if(blocksleft===0){
        location.reload()
    }*/
    for(let iii=0;iii<balls.length;iii++){
        if(balls[iii].type==='normal'){
            if(balls[iii].y>height+5){
                balls.splice(iii, 1)
                break
            }
            balls[iii].bounceOff(paddle, ()=>{ballBounceOff.play()})
            balls[iii].bounceOff(edges, ()=>{ballBounceOff.play()})
            for(let ii=0;ii<rows.length;ii++){
                for(let i=0;i<rows[ii].length;i++){
                    balls[iii].bounceOff(rows[ii][i], ()=>{
                        if(random([1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1])){
                            createPowerupSprite(selectPowerup(), rows[ii][i].x, rows[ii][i].y, iii)
                        }
                        rows[ii][i].destroy()
                        blocksleft--
                        ballBounceOff.play()
                    })
                }
            }
        }
        if(balls[iii].type==='explosive'){
            if(balls[iii].y>height+5){
                balls.splice(iii, 1)
                break
            }
            balls[iii].bounceOff(paddle, ()=>{ballBounceOff.play()})
            balls[iii].bounceOff(edges, ()=>{ballBounceOff.play()})
            for(let ii=0;ii<rows.length;ii++){
                for(let i=0;i<rows[ii].length;i++){
                    if(rows[ii][i]){
                        balls[iii].overlap(rows[ii][i], ()=>{
                            let ball=balls[iii]
                            explotionSound.play()
                            ball.velocityX=0
                            ball.velocityY=0
                            ball.width=100
                            ball.height=100
                            ball.setCollider('circle', 0, 0, 50)
                            ball.draw=()=>{
                                push()
                                fill('orange')
                                ellipse(0, 0, 100)
                                pop()
                            }
                            for(let i=0;i<rows.length;i++){
                                for(let sprite of rows[i]){
                                    ball.overlap(sprite, ()=>{
                                        sprite.destroy()
                                        blocksleft--
                                    if(random([1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1])){
                                            createPowerupSprite(selectPowerup(), ball.x, ball.y, iii)
                                        }
                                    })
                                }
                            }
                            let alpha=100
                            fade=setInterval(()=>{ball.draw=()=>{
                                push()
                                fill(255, 165, 0, alpha)
                                ellipse(0, 0, 100)
                                pop()
                                alpha-=10*speedMultiplier
                            }})
                            setTimeout(()=>{ball.destroy();balls.splice(iii, 1);clearInterval(fade)}, 2000)
                        })
                    }
                }
            }
        }
    }
    for(let i = 0;i<powerupSprites.length;i++){
        if(powerupSprites[i]){
            if(powerupSprites[i].y>height+20){
                powerupSprites[i].destroy()
                powerupSprites.splice(i, 1)
            }else{
                paddle.overlap(powerupSprites[i], ()=>{
                    powerupSound.play()
                    let sprite = powerupSprites[i]
                    if(sprite.type==='triplicate'){
                        while(!(balls[sprite.balli])){
                            sprite.balli--
                        }
                        balls.push(createBall(balls[sprite.balli].x, balls[sprite.balli].y,4, -4, 'normal'))
                        balls.push(createBall(balls[sprite.balli].x, balls[sprite.balli].y, -4, -4, 'normal'))
                    }
                    if(sprite.type==='launchMore'){
                        balls.push(createBall(paddle.x, paddle.y-20, random(-4, 4), 4,'normal'))
                        balls.push(createBall(paddle.x, paddle.y-20, random(-4, 4), 4, 'normal'))
                    }
                    if(sprite.type==='explotionBall'){
                        balls.push(createBall(paddle.x, paddle.y-20, 0, -4, 'explosive'))
                    }
                    if(sprite.type==='lengthenPaddle'){
                        paddle.width+=10
                        setTimeout(()=>{paddle.width-=10}, 10000)
                    }
                    if(sprite.type==='shortenPaddle'){
                        paddle.width-=10
                        setTimeout(()=>{paddle.width+=10}, 10000)
                    }
                    if(sprite.type==='finishLevel'){
                        for(let e = 0;e<rows.length;e++){
                            for(let ee=0;ee<rows[e].length;ee++){
                                blocksleft--
                            }
                            rows[e].destroyEach()
                            rows[e].splice(e, 1)
                        }
                    }
                    sprite.destroy()
                    powerupSprites.splice(i, 1)
                })
            }
        }
    }
    if(getDeviceType()=='desktop'){
        if(keyDown(LEFT_ARROW)&&!(paddle.x<0)&&!(cpuMode.checked())){
            paddle.x-=5*speedMultiplier
        }
        if(keyDown(RIGHT_ARROW)&&!(paddle.x>width)&&!(cpuMode.checked())){
            paddle.x+=5*speedMultiplier
        }
        if(keyDown('space')&&gameState==0&&!(cpuMode.checked())){
            startGame()
        }
        rightKey.y=99999
        leftKey.y=99999
    }/*else{
        rightKey.y=650
        leftKey.y=650
        if(checkButtonPressed(rightKey.x, rightKey.y, 80, 80)&&!(paddle.x>width-55)&&!(cpuMode.checked())){
            paddle.x+=5*speedMultiplier
            
        }
        console.log(/*checkButtonPressed(rightKey.x, rightKey.y, 80, 80)*//*isTouching);console.log(rightKey.x+' '+rightKey.y+' '+leftKey.x+' '+leftKey.y)
        if(checkButtonPressed(leftKey.x, leftKey.y, 80, 80)&&!(paddle.x<55)&&!(cpuMode.checked())){
            paddle.x-=5*speedMultiplier
        }
    }*/
    drawPaddle()
    drawSprites()
}
let selectPowerup=()=>{
    let select=Math.floor(random(0, 100))
    if(select>99){
        return 'levelFinish'
    }
    else if(select>75){
        return 'launchMore'
    }
    else if(select>45){
        return 'shortenPaddle'
    }
    else if(select>20){
        return 'explotionBall'
    }
    else if(select>20){
        return 'lengthenPaddle'
    }
    else if(select<20){
        return 'triplicate'
    }

}
/*let checkButtonPressed=(x, y, w, h)=>{
    if (touches[0] > x-(w/2) && touches[0] < x+(w/2) && touches[1] > y-(h/2) && touches[1] < y+(h/2) && isTouching) {
        return true; 
      } else {
        return false;
      }
}
function touchStarted(){
    isTouching=true
}
function touchEnded(){
    isTouching=false
}*/