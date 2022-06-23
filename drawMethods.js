const vectorSize = 2;

function drawSpeed(time = t){
    for(let row = 0; row < height; row++){
        for(let colm = 0; colm < width; colm++){
            var p = getP({x:colm,y:row},time);
            var u = getU({x:colm,y:row},time,p);
            
            var redValue = Math.min(255 * Math.sqrt(u[0]**2 + u[1]**2), 255);
            redValue = redValue || 0;
            ctx.fillStyle = `rgb(${redValue},0,${255-redValue})`;
            
            ctx.fillRect(colm*size,row*size,size,size);
        }
    }
}

function drawVectorField(time = t){
    for(let row = 0; row < height; row+=vectorSize){
        for(let colm = 0; colm < width; colm+=vectorSize){
            var Usum = [0,0];
            for(let irow = 0; irow<vectorSize; irow++){
                for(icolm =0; icolm<vectorSize; icolm++){
                    var p = getP({x:colm+icolm,y:row+irow},time);
                    var u = getU({x:colm+icolm,y:row+irow},time,p);
                    Usum[0] += u[0];
                    Usum[1] += u[1];
                }    
            }
            var normelizedVector = Math.sqrt(Usum[0]**2 + Usum[1]**2);
            var normelizedX = 0.5*size * Usum[0]/normelizedVector;
            var normelizedY = 0.5*size * Usum[1]/normelizedVector;
            ctx.strokeStyle="blue";
            drawArrow((colm+vectorSize/2)*size,(row+vectorSize/2)*size,vectorSize*normelizedX,vectorSize*normelizedY)
        }
    }
}


function drawSpiralDirection(time = t){
    for(let row = 0; row < height; row+=1){
        for(let colm = 0; colm < width; colm+=1){
            var p = getP({x:colm,y:row},time);
            var u = getU({x:colm,y:row},time,p);
            
            var ang = Math.atan(u[1]/u[0]);
            if(u[0] < 0)
                ang = ang-180;
            
            ang += 90; 

            if(ang < 0)
                ang += 360;
            else if(ang > 360)
                ang -= 360
            
            if(colm == 0){
                if(ang > 180)
                    ctx.fillStyle = 'red';
                else
                    ctx.fillStyle = 'blue';
            }
            else{
                let prevP = getP({x:colm-1,y:row},time);
                let prevU = getU({x:colm-1,y:row},time,prevP);
                var prevAng = Math.atan(prevU[1]/prevU[0]);
                if(prevU[0] < 0)
                    prevAng = prevAng-180;

                prevAng += 90; 

                if(prevAng < 0)
                    prevAng += 360;
                else if(prevAng > 360)
                    prevAng -= 360

                var angdiff = (ang - prevAng)*10000;
                if((angdiff > 0 && u[0] > 0) || (angdiff < 0 && u[0] < 0))
                    ctx.fillStyle = `rgb(0,0,${Math.min(Math.abs(angdiff),255)})`;
                else
                    ctx.fillStyle = `rgb(${Math.min(Math.abs(angdiff),255)},0,0)`;
            }


            // ctx.fillText(ang.toFixed(4),colm*size,row*size);

            
            ctx.fillRect(colm*size,row*size,size,size);

        }
    }
}

function drawTheoryVectorField(){
    for(let row = 0; row < height; row+=vectorSize){
        for(let colm = 0; colm < width; colm+=vectorSize){
            let x = ballCenter[1]-colm;
            let y = ballCenter[0] - row;
            
            let r = Math.sqrt(x**2 + y**2);
            let theta = Math.atan(y / Math.abs(x))
            let ur = -flowSpeed * Math.cos(theta) * (1 - (3 * ballRadius) / (2*r) + (ballRadius**3) / (2* r**3))
            let u0 = flowSpeed * Math.sin(theta) * (1 - (3 * ballRadius) / (4*r) + (ballRadius**3) / (4* r**3))
            let u = Math.sqrt(ur * ur + u0 * u0)
            let ang = Math.PI - Math.atan(u0 / ur) - theta
            
            var normelizedX = Math.cos(ang)*5;
            var normelizedY = Math.sin(ang)*5;
            
            ctx.strokeStyle="red";
            if(x > 0)
                drawArrow((colm+vectorSize/2)*size,(row+vectorSize/2)*size,-vectorSize*normelizedX,vectorSize*normelizedY)

            else{
                drawArrow((colm+vectorSize/2)*size,(row+vectorSize/2)*size,-vectorSize*normelizedX,-vectorSize*normelizedY)
            }
        }
    }
}


function drawPaint(time = t){
    for(let dot of paint[time]){
        ctx.fillStyle = 'green';
        ctx.fillRect(dot.x*size,dot.y*size,size,size);
    }
}

function drawWalls(){
    for(let pos in walls){
        let y = Math.floor(pos.toString()/width);
        let x = pos.toString()% width;

        ctx.fillStyle = `black`;

        ctx.fillRect(x*size,y*size,size,size);
        
    }
}

function drawArrow(fromx, fromy, dx, dy) {
    dx = dx||0;
    dy = dy||0;

    if(dx == 0 && dy == 0)
        return

    var headlen = size/2; // length of head in pixels
    var tox = dx + fromx;
    var toy = dy + fromy;
    var angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }