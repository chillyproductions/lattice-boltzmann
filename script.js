const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 100;
const height = 100;
const size = 5;

const c = 1;
var dt = 1;
const relaxationTime = 2;

var e = [[0,0],[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[-1,-1],[1,-1]];
var oppisite = [0,3,4,1,2,7,8,5,6]
var f = [];
var fStar = [];

var t = 0;

function getStarP(pos){
    var sum = 0;
    for(let i = 0; i < 9; i++){
        sum += fStar[pos.y][pos.x][i] || 0;
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
        sum += f[t][pos.y][pos.x][i] || 0;
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
    for(let row = 0; row < width; row++){
        f[0][row] = []
        fStar[row] = []
        for(let colm = 0; colm < height; colm++){
            f[0][row][colm] = [];
            fStar[row][colm] = [];
            for(let i = 0; i < 9; i++){
                f[0][row][colm][i] = 1;
            }
        }
    }

    canvas.width = width*size;
    canvas.height = height*size;
}

function createNewTimeLayer(t){
    f[t] = [];
    for(let row = 0; row < width; row++){
        f[t][row] = []
        for(let colm = 0; colm < height; colm++){
            f[t][row][colm] = new Array(9);
        }
    }
}

function stream(pos){
    for(let i = 0; i < 9; i++){
        if(pos.y + e[i][1] > height-1 || pos.y + e[i][1] < 0 || pos.x + e[i][0] < 0 || pos.x + e[i][0] > width-1)
            fStar[pos.y][pos.x][oppisite[i]] = f[t][pos.y][pos.x][i];
        else
            fStar[pos.y+e[i][1]][pos.x+e[i][0]][i] = f[t][pos.y][pos.x][i];
    }
}

function colision(pos){
    if(pos.y == 0){
        // f[t+dt][pos.y][pos.x][1] = 1;
        // return
    }
    
    var p = getStarP(pos);
    var u = getStarU(pos,p);

    for(let i = 0; i < 9; i++){
        var s = 3*(e[i][0]*u[0]+e[i][1]*u[1])/c + 9*Math.pow(e[i][0]*u[0]+e[i][1]*u[1],2)/(2*c**2) - 3*(u[0]**2 + u[1]**2)/(2*c**2);
        s *= getW(i);

        var Feq = getW(i)*p + p * s;
        var fs = fStar[pos.y][pos.x][i]

        if(Number.isNaN(fs) || Number.isNaN(Feq))
            console.log('fuck')

        f[t+dt][pos.y][pos.x][i] = fs - (fs-Feq)/relaxationTime
    }


}

function draw(){
    for(let row = 0; row < width; row++){
        for(let colm = 0; colm < height; colm++){
            var p = getP({x:colm,y:row},t);
            var u = getU({x:colm,y:row},t,p);
            var redValue = Math.min(255 * Math.sqrt(u[0]**2 + u[1]**2), 255);
            redValue = redValue || 0;
            ctx.fillStyle = `rgb(${redValue},0,${255-redValue})`;

            ctx.fillRect(colm*size,row*size,size,size);
        }
    }
}

function loop(){
    initialize(0);
    draw();

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
        draw();
    },0)
}


addEventListener('mousedown',(evt)=>{
    console.log(f[t][Math.floor(evt.offsetY/size)][Math.floor(evt.offsetY/size)])
    f[t][Math.floor(evt.offsetY/size)][Math.floor(evt.offsetX/size)][1] = 10;
    var blobSize = 10;
    for(let row = 0; row < blobSize; row++){
        for(let colm = 0; colm < blobSize; colm++)
            f[t][Math.floor(evt.offsetY/size) + colm][Math.floor(evt.offsetX/size) + row][1] = 10;
    }
})




loop();