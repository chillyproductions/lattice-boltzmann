const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var e = [[0,0],[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[-1,-1],[1,-1]];
var f = [];
const c = 1;


function getP(pos,t){
    var sum = 0;
    for(let i = 0; i < 9; i++){
        sum += f[t][pos.y][pos.x][i];
    }
    return sum;
}

function getU(p,){

}

function getW(i){
    if(i == 0) return (4/9);
    if(i >= 1 && i <= 4) return (4/9);
    if(i >= 5 && i <= 8) return (1/36);
    throw('unexpected i');
}

function loop(){
    setInterval(()=>{
        //
    },0)
}

loop();