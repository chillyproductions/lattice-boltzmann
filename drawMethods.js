function draw(time = t){
    for(let row = 0; row < height; row++){
        for(let colm = 0; colm < width; colm++){
            var p = getP({x:colm,y:row},time);
            var u = getU({x:colm,y:row},time,p);
            // SPEED
            var redValue = Math.min(255 * Math.sqrt(u[0]**2 + u[1]**2), 255);
            redValue = redValue || 0;
            ctx.fillStyle = `rgb(${redValue},0,${255-redValue})`;

            //SPEED with derection
            // var redValue = (u[1] < 0) ? 0 : 255;

            // var greenValue = 255 - Math.min(255 * Math.sqrt(u[1]**2), 255);

            // ctx.fillStyle = `rgb(${redValue},${greenValue},${255-redValue})`;
            
            ctx.fillRect(colm*size,row*size,size,size);

        }
    }
    for(let pos in walls){
        let y = Math.floor(pos.toString()/width);
        let x = pos.toString()% width;

        ctx.fillStyle = `black`;

        ctx.fillRect(x*size,y*size,size,size);
        
    }
}

function drawVectorField(time = t){
    vectorSize = 1;
    for(let row = 0; row < height; row+=vectorSize){
        for(let colm = 0; colm < width; colm+=vectorSize){
            var Usum = [];
            for(let irow = 0; irow<vectorSize; irow++){
                for(icolm =0; icolm<vectorSize; icolm++){
                    var p = getP({x:colm+icolm,y:row+irow},time);
                    var u = getU({x:colm+icolm,y:row+irow},time,p);
                    Usum += u[0];
                    Usum += u[1];
                }    
            }
            var normelizedVector = Math.sqrt(u[0]**2 + u[1]**2);
            var normelizedX = 0.5*size * u[0]/normelizedVector;
            var normelizedY = 0.5*size * u[1]/normelizedVector;
            drawArrow((colm+vectorSize/2)*size,(row+vectorSize/2)*size,normelizedX,normelizedY)
        }
    }
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

                if(ang > prevAng && u[0] > 0)
                    ctx.fillStyle = 'blue';
                else if(ang < prevAng && u[0] < 0)
                    ctx.fillStyle = 'blue';
                else
                    ctx.fillStyle = 'red';
            }


            // ctx.fillText(ang.toFixed(4),colm*size,row*size);

            
            ctx.fillRect(colm*size,row*size,size,size);

        }
    }
    for(let pos in walls){
        let y = Math.floor(pos.toString()/width);
        let x = pos.toString()% width;

        ctx.fillStyle = `black`;

        ctx.fillRect(x*size,y*size,size,size);
        
    }
}
