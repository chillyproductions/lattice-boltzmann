const isTunnel = true;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


const width = isTunnel? 300: 100;
const height = 100;
const size = 20;

const c = 1.2;
var dt = 1;
const relaxationTime = 3;

var e = [[0,0],[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[-1,-1],[1,-1]];
var oppisite = [0,3,4,1,2,7,8,5,6]
var f = [];
var fStar = [];

var t = 0;
var clickedPos = {};

var walls = {};

function getStarP(pos){
    var sum = 0;
    for(let i = 0; i < 9; i++){
        sum += (fStar[pos.y][pos.x][i] || 0);
    }
    return sum;
}

function getStarU(pos,p){
    var sum = [0,0];
    for(let i = 0; i < 9; i++){
        sum[0] += e[i][0] * c * (fStar[pos.y][pos.x][i] || 0);
        sum[1] += e[i][1] * c * (fStar[pos.y][pos.x][i] || 0);
    }
    sum[0] /= p;
    sum[1] /= p;
    return sum;
}

function getP(pos,t){
    var sum = 0;
    for(let i = 0; i < 9; i++){
        sum += (f[t][pos.y][pos.x][i] || 0);
    }
    return sum;
}

function getU(pos,t,p){
    var sum = [0,0];
    for(let i = 0; i < 9; i++){
        sum[0] += e[i][0] * c * (f[t][pos.y][pos.x][i] || 0);
        sum[1] += e[i][1] * c * (f[t][pos.y][pos.x][i] || 0);
    }
    sum[0] /= p;
    sum[1] /= p;
    return sum;
}

function getW(i){
    if(i == 0) return (4/9);
    if(i >= 1 && i <= 4) return (1/9);
    if(i >= 5 && i <= 8) return (1/36);
    throw('unexpected i');
}

function initialize(){
    f[0] = [];
    for(let row = 0; row < height; row++){
        f[0][row] = []
        fStar[row] = []
        for(let colm = 0; colm < width; colm++){
            f[0][row][colm] = [];
            fStar[row][colm] = [];
            for(let i = 0; i < 9; i++){
                // if(isTunnel && i == 1)
                //     f[0][row][colm][i] = 1;
                // else if(isTunnel)
                //     f[0][row][colm][i] = 0;
                // else
                    f[0][row][colm][i] = 1;
            }
        }
    }

    // f[0][50][10][1] = 1;

    canvas.width = width*size;
    canvas.height = height*size;

    if(!isTunnel)
        return

    var wallSize = 30
    for(let i = 0; i < wallSize; i++){
        walls[(Math.floor((height-wallSize)/2) + i)*width + 60] = true;
    }
}

function createNewTimeLayer(t){
    f[t] = [];
    for(let row = 0; row < height; row++){
        f[t][row] = []
        for(let colm = 0; colm < width; colm++){
            f[t][row][colm] = new Array(9);
        }
    }
}

function stream(pos){
    if(walls[pos.x+pos.y*width])
        return

    for(let i = 0; i < 9; i++){
        // if(isTunnel && pos.x + e[i][0] > width-1)
        //     continue

        if(pos.y + e[i][1] > height-1 || pos.y + e[i][1] < 0 || pos.x + e[i][0] < 0 || pos.x + e[i][0] > width-1)
            fStar[pos.y][pos.x][oppisite[i]] = f[t][pos.y][pos.x][i];
        else if(walls[(pos.x+e[i][0])+(pos.y+e[i][1])*width])
            fStar[pos.y][pos.x][oppisite[i]] = f[t][pos.y][pos.x][i];
        else
            fStar[pos.y+e[i][1]][pos.x+e[i][0]][i] = f[t][pos.y][pos.x][i];
    }
}

function colision(pos){
    if(pos.x == 0 && isTunnel){
        for(let i = 0; i < 9; i++){
            f[t+dt][pos.y][pos.x][i] = 0;
        }
        f[t+dt][pos.y][pos.x][1] = 10;
        return
    }
    
    var p = getStarP(pos);
    var u = getStarU(pos,p);

    for(let i = 0; i < 9; i++){
        // var s = 3*(e[i][0]*u[0]+e[i][1]*u[1])/c + 9*Math.pow(e[i][0]*u[0]+e[i][1]*u[1],2)/(2*c**2) - 3*(u[0]**2 + u[1]**2)/(2*c**2);

        var s = 3*(e[i][0] * u[0] + e[i][1] * u[1])/c + (9/2)*Math.pow(e[i][0] * u[0] + e[i][1] * u[1],2)/Math.pow(c,2) - (3/2)*(u[0]*u[0]+u[1]*u[1])/(c**2);

        var Feq = getW(i)*p*(1+s);
        var fs = fStar[pos.y][pos.x][i]

        if(clickedPos.x == pos.x && clickedPos.y == pos.y && i == 1)
            var a =1;

        if(fs - (fs-Feq) < 0)
            console.log('wtf');

        f[t+dt][pos.y][pos.x][i] = Math.max(fs - (fs-Feq)/relaxationTime,0)
    }


}

function loop(){
    initialize();
    // draw();

    setInterval(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height)
        createNewTimeLayer(t+dt)

        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                stream({x,y});
            }
        }

        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                colision({x,y})
            }
        }

        t+=dt;
        // draw();
        drawVectorField();
        // drawSpiralDirection();
    },0)
}

function createVideo(videoDuration){
    initialize();
    for(let i = 0; i < videoDuration; i++){
        createNewTimeLayer(t+dt)

        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                stream({x,y});
            }
        }

        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                colision({x,y})
            }
        }

        t+=dt;
    }
    document.getElementById('play-button').hidden = false;
}

function playVideo(){
    let i = 0;
    setInterval(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height)
        
        if(i < f.length-1)
            i++;
        draw(i);
    },20)
}


canvas.addEventListener('mousedown',(evt)=>{
    console.log(f[t][Math.floor(evt.offsetY/size)][Math.floor(evt.offsetY/size)])
    
    clickedPos = {x: Math.floor(evt.offsetX/size), y:Math.floor(evt.offsetY/size)} ;

    var blobSize = 10;
    for(let row = 0; row < blobSize; row++){
        for(let colm = 0; colm < blobSize; colm++)
            f[t][Math.floor(evt.offsetY/size) + colm][Math.floor(evt.offsetX/size) + row][1] = 10;
    }
})




loop();
// createVideo(1000);