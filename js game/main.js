const canvas = document.querySelector('canvas');
const C = canvas.getContext('2d');


canvas.width = 1024;
canvas.height = 576;
C.fillRect(0 , 0 , canvas.width , canvas.height)

const gravity = 0.5

const background = new sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop = new sprite({
    position:{
        x:600,
        y:129
    },
    imageSrc: './img/shop.png',
    scale: 2.75, 
    framemax : 6
})


const player = new Fighter({
    position:{
    x:0,
    y:0
    },
    velocity:{
       x:0,
       y:0 
    },
    offset :{
        x: 0,
        y: 0
    },
    imageSrc: './img/wow/idle.png', 
    framemax : 10 ,
    scale:2.5,
    offset :{
        x:150, 
        y: 100
    },

    sprites : {
        idle :{
            imageSrc:'./img/wow/idle.png', 
            framemax:10
        },
        run :{
            imageSrc:'./img/wow/Run.png', 
            framemax:8,  
        },
        jump :{
            imageSrc:'./img/wow/jump.png', 
            framemax:3,  
        },
        fall :{
            imageSrc:'./img/wow/fall.png', 
            framemax:3,  
        },
        attack2 :{
            imageSrc:'./img/wow/attack2.png', 
            framemax:7,  
        },
        attack1 :{
            imageSrc:'./img/wow/attack1.png', 
            framemax:7,  
        },
        takehit :{
            imageSrc:'./img/wow/take hit.png', 
            framemax:3, 
        },
        death :{
            imageSrc:'./img/wow/death.png', 
            framemax:7, 
        }

    },
    attackbox:{
        offset:{
            x:100,
            y:50
        },
        width:160,
        height:50
    }

    
})


const enemy = new Fighter({
    position:{
    x:400,
    y:100
    },
    velocity:{
       x:0,
       y:0
    },
    offset :{
        x: -50,
        y: 0
    },
    color : 'blue',
    imageSrc: './img/pol/idle.png', 
    framemax : 4 ,
    scale:2.35,
    offset :{
        x: 215, 
        y: 150
    },

    sprites : {
        idle :{
            imageSrc:'./img/pol/idle.png', 
            framemax:4
        },
        run :{
            imageSrc:'./img/pol/Run.png', 
            framemax:8,  
        },
        jump :{
            imageSrc:'./img/pol/jump.png', 
            framemax:2,  
        },
        fall :{
            imageSrc:'./img/pol/fall.png', 
            framemax:2,  
        },
        attack2 :{
            imageSrc:'./img/pol/attack2.png', 
            framemax:4,  
        },
        attack1 :{
            imageSrc:'./img/pol/attack1.png', 
            framemax:4,  
        },
        takehit:{
            imageSrc:'./img/pol/take hit.png', 
            framemax:3, 
        },
        death:{
            imageSrc:'./img/pol/death.png', 
            framemax:7, 
        }

    },
    attackbox:{
        offset:{
            x:-170,
            y:50
        },
        width:150,
        height:50
    }
})



console.log(player)

const keys ={
    a : {
        pressed :false
    },
    d : {
        pressed :false
    }, 
    w: {
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    }
}

let lastkey 

decrease()

function animate(){
    window.requestAnimationFrame(animate)
    C.fillStyle = 'black'
    C.fillRect(0, 0,canvas.width, canvas.height)
    background.update()
    shop.update()
    C.fillStyle = 'rgba(255,255,255,0.15)'
    C.fillRect(0,0 , canvas.width , canvas.height)
    player.update()
    enemy.update()

    player.velocity.x =0
    enemy.velocity.x =0
    //player

    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5
        player.switchsprite('run')
    }else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.switchsprite('run')
        
    }else{
        player.switchsprite('idle')
    }

    //jump
    if (player.velocity.y < 0) {
        player.switchsprite('jump')
      } else if (player.velocity.y > 0) {
        player.switchsprite('fall')
      }

    // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchsprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchsprite('run')
  } else {
    enemy.switchsprite('idle')
  }
// jumping
if (enemy.velocity.y < 0) {
    enemy.switchsprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchsprite('fall')
  }
    // detect for collision & enemy gets hit
  if (
    retangularcollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isattacking &&
    player.framecurrent === 3
  ) {
    enemy.takehit()
    player.isattacking = false

    gsap.to('#en-heal', {
        width: enemy.health + '%'
      })
    }

    // if player misses
  if (player.isattacking && player.framecurrent === 3) {
    player.isattacking = false
  }
        
// this is where our player gets hit
if (
    retangularcollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isattacking &&
    enemy.framecurrent === 2
  ) {
    player.takehit()
    enemy.isattacking = false

    gsap.to('#ol-heal', {
        width: player.health + '%'
      })
    }
    
  
    //missing
    if(enemy.isattacking &&enemy.framecurrent === 2){
        enemy.isattacking = false
    }

    //end game
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timeid})

    }
    if(player.health<=0){
        player.switchsprite('death')
    }
    if(enemy.health<=0){
        enemy.switchsprite('death')
    }
}

animate()

window.addEventListener('keydown' , (event) =>{
    if(!player.dead){
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastkey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastkey = 'a'
                break
            case 'w':
                keys.w.pressed = true
                player.velocity.y = -15
                break
            case 's':
                player.attack2()
                break
            case 'e':
                player.attack1()
                break
    
    }

    if(!enemy.dead){
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':

            enemy.velocity.y = -15
            break 
        case 'ArrowDown':
            enemy.attack1()
            break
        case ' ':
            enemy.attack2()
            break        


    }
}
}
})
window.addEventListener('keyup' , (event) =>{
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'w':
            keys.w.pressed = false
        break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break    
    }
    
})     

