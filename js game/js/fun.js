const p1 = document.getElementById('player1');
const p2 = document.getElementById('player2');



function retangularcollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackbox.position.x + rectangle1.attackbox.width >=
        rectangle2.position.x &&
      rectangle1.attackbox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackbox.position.y + rectangle1.attackbox.height >=
        rectangle2.position.y &&
      rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }
function determineWinner({player , enemy ,timeid}){
    clearTimeout(timeid)
    if(player.health === enemy.health  ){
        document.querySelector('#result').innerHTML = 'TIE'
        document.querySelector('#result').style.display = 'flex'
     }else if(player.health > enemy.health ){
        document.querySelector('#result').innerHTML = p1.value + ' WIN'
        document.querySelector('#result').style.display = 'flex'
     }else if(player.health < enemy.health){
        document.querySelector('#result').innerHTML = p2.value + ' WIN'
        document.querySelector('#result').style.display = 'flex'
     }
     retangularcollision
}



function closeForm() {
  document.getElementById("myForm").style.display = "none";

}



    let time = 91
    let timeid
 function decrease(){
     if(time > 0  ){ 
          timeid = setTimeout(decrease, 1000)   
         time--
         document.querySelector('#timer').innerHTML =  time 
     }
     if (time===0){
         determineWinner({player,enemy,timeid})
     }
 }


