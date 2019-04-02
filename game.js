var shaderProgram;
var gl = null;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var snake = null;
var sceneSize = 8; 
var snakeSize = 2;              
var gameObjects = [];
var paused = false;
var pauseMenu = document.getElementById("pause");

function handleKeyPressed(event) {

    switch (event.keyCode) {
        case 32:
            paused = !paused;
            snake.pause(paused);
            if (paused) 
                pauseMenu.style.display = "block";
            else 
                pauseMenu.style.display = "none";
            break;

        case 37:
            snake.setDirection1([-0.5, 0, 0]);
            break;
        case 39: 
            snake.setDirection1([0.5, 0, 0]);
            break;
        case 38: 
            snake.setDirection1([0, 0.5, 0]);
            break;
        case 40: 
            snake.setDirection1([0, -0.5, 0]);
            break;
 
 
        case 87:
            snake.setDirection2([0, 0.5, 0]);
            break;
        case 65:
            snake.setDirection2([-0.5, 0, 0]);
            break;
        case 83:
            snake.setDirection2([0, -0.5, 0]);
            break;
        case 68:
            snake.setDirection2([0.5, 0, 0]);
            break;

        default: break;
    }
}



function setupWebGL() {
    // Get the canvas and context
    document.onkeydown = handleKeyPressed;
    var canvas = document.getElementById("webgl-canvas"); // create a js canvas
    c_width = canvas.width;
    c_height = canvas.height;
    gl = canvas.getContext("webgl"); // get a webgl object from it
    
    try {
      if (gl == null) {
        throw "unable to create gl context -- is your browser gl ready?";
      } else {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
        gl.clearDepth(1.0); // use max when we clear the depth buffer
        gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
      }
    } // end try
    
    catch(e) {
      console.log(e);
    } // end catch
} // end setupWebGL


function setupShaders() {
    var fShaderCode = `
        precision highp float;
        varying vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
        }
    `;
    
    var vShaderCode = `
        attribute vec3 aVertexPosition;
        attribute vec4 aColor;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        varying vec4 vColor;

        uniform float uSize;
        uniform float uShadow;

        void main(void) {
            float a= (aVertexPosition.z / uSize) * uShadow + (1.0 - uShadow);
            vColor = aColor * (vec4(a,a,a,1.0));
            gl_PointSize=12.0;
            gl_PointSize=(aVertexPosition.z+8.0)*1.0;
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        }            
    `;
    
    try {
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); 
        gl.shaderSource(fShader,fShaderCode); 
        gl.compileShader(fShader); 

        var vShader = gl.createShader(gl.VERTEX_SHADER); 
        gl.shaderSource(vShader,vShaderCode); 
        gl.compileShader(vShader); 
            
        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { 
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);  
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { 
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);  
            gl.deleteShader(vShader);
        } else { 
            shaderProgram = gl.createProgram(); 
            gl.attachShader(shaderProgram, fShader); 
            gl.attachShader(shaderProgram, vShader); 
            gl.linkProgram(shaderProgram); 

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { 
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { 
                gl.useProgram(shaderProgram); 
                shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
                gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
                shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");
                gl.enableVertexAttribArray(shaderProgram.colorAttribute);
                shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
                shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');

                shaderProgram.uSize = gl.getUniformLocation(shaderProgram, "uSize");
                shaderProgram.uShadow = gl.getUniformLocation(shaderProgram, "uShadow");

                gl.uniform1f(shaderProgram.uSize, sceneSize);
                gl.uniform1f(shaderProgram.uShadow, 0.4);
            } 
        } 
    } 
    
    catch(e) {
        console.log(e);
    } 
} 

function loadGameModels(){
 
    pauseMenu.style.display = "none";

	gameObjects.push(new Scene(sceneSize));

    snake = new Snake(snakeSize);
	gameObjects.push(snake);
    

}

function renderModels(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    window.requestAnimationFrame(renderModels);

    mat4.identity(mvMatrix);
    mat4.identity(pMatrix);

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(-4, -4, -20));
    mat4.perspective(pMatrix, 1/6*Math.PI, 1, 0.1, 21);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

    for (var i = 0; i < gameObjects.length; i++){
        gameObjects[i].draw();
    }

}

function main(){
	setupWebGL();
    setupShaders();
	loadGameModels();
    renderModels();
}

