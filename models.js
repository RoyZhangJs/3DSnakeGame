var PTIMER;
var PTIMER2;
var NPTIMER;
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_objects_with_WebGL

const faceColors = [
    [0.0,  0.0,  0.0,  1.0],    
    [0.0,  0.0,  0.0,  1.0],   
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  0.0,  1.0],  
    [0.0,  0.0,  0.0,  1.0],    
    [0.0,  0.0,  0.0,  1.0],    
  ];

const pSnakeColors1 = [
    [0.0,  0.0,  0.0,  1.0],
    [1.0,  1.0,  1.0,  1.0],   
    [0.0,  0.0,  0.0,  1.0],
    [1.0,  1.0,  1.0,  1.0],    
    [0.0,  0.0,  0.0,  1.0],  
    [1.0,  1.0,  1.0,  1.0],  
];

const pSnakeColors2 = [
   
    [1.0,  1.0,  1.0,  1.0],
    [1.0,  1.0,  0.0,  1.0],   
    [1.0,  1.0,  1.0,  1.0],    
    [1.0,  1.0,  0.0,  1.0],
    [1.0,  1.0,  1.0,  1.0],  
    [1.0,  1.0,  0.0,  1.0],
];
const npSnakeColors = [
    [1.0,  1.0,  1.0,  1.0],
    [1.0,  0.0,  1.0,  1.0],
    [1.0,  1.0,  1.0,  1.0],  
    [1.0,  0.0,  1.0,  1.0],
    [1.0,  1.0,  1.0,  1.0], 
    [1.0,  0.0,  1.0,  1.0],  
 
];

class Cube{
    constructor(size=1, startX=0, startY=0, startZ=0){
        this.size = size;
        this.x = startX;
        this.y = startY;
        this.z = startZ;
    }

    setupPosition(){
        var v0=[this.x, this.y, this.z],
            v1=[this.x+this.size, this.y, this.z],
            v2=[this.x+this.size, this.y, this.z+this.size],
            v3=[this.x+0, this.y+0, this.z+this.size],
            v4=[this.x+0, this.y+this.size, this.z+0],
            v5=[this.x+this.size, this.y+this.size, this.z],
            v6=[this.x+this.size, this.y+this.size, this.z+this.size],
            v7=[this.x+0, this.y+this.size, this.z+this.size];

        this.vertices = [].concat(
            v0,v1,v2,v0,v2,v3, 
            v0,v4,v7,v0,v7,v3, 
            v0,v1,v5,v0,v5,v4, 
            v1,v2,v6,v1,v6,v5, 
            v4,v5,v6,v6,v4,v7,  
            v7,v6,v3,v3,v6,v2
        );

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
    }

    setupColor(){
        this.colors = [];
        for (var i = 0; i < faceColors.length; ++i) {
            var c = faceColors[i];
            this.colors = this.colors.concat(c, c, c, c, c, c);
        }

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    setupElementArray(){
        this.indices = [];
        for(var i = 0;i < this.vertices.length/3; i++){
            this.indices.push(i);
        }

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    setupCube(){
        this.setupPosition();
        this.setupColor();
        this.setupElementArray();
    }
    
    draw(){
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shaderProgram.colorAttribute, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT,0);
    }
    
}

class Scene extends Cube{
    constructor(size){
        super();
        this.size = size;
        this.setupCube();
    }
    setupCube(){
        super.setupPosition();
        this.vertices.splice(-6*3, 6*3);
        super.setupColor();
        super.setupElementArray();
    }
}

class PSnake extends Cube{
    constructor(x,y,z,color){
        super();
        this.size=0.5;
        this.x=x;
        this.y=y;
        this.z=z;
        this.faceColor = color;
        this.setupCube();
    }

    setupColor(){
        this.colors = [];
        for (var i = 0; i < this.faceColor.length; ++i) {
            var c =  this.faceColor[i];
            this.colors = this.colors.concat(c, c, c, c, c, c);
        }

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }
  
}

class NPSnake extends Cube{
    constructor(x,y,z){
        super();
        this.size=0.5;
        this.x=x;
        this.y=y;
        this.z=z;
        this.setupCube();
    }

    setupColor(){
        this.colors = [];
       for (var i = 0; i < npSnakeColors.length; ++i) {
            var c =  npSnakeColors[i];
            this.colors = this.colors.concat(c, c, c, c, c, c);
        }
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }
  
}

class Food extends Cube{
    constructor(x,y,z){
        super();
        this.size=0.5;
        this.x=x;
        this.y=y;
        this.z=z;
        this.setupCube();
    }

    setupColor(){
        this.colors = [];
        for (var i = 0; i < 6; ++i) {
            var c = [1.0,  0.0,  0.0,  1.0];
            this.colors = this.colors.concat(c, c, c, c, c, c);
        }

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }
  
}
class Snake{

    constructor(size=2, dir=[0.5,0,0]){
        this.size=size;
        this.setupNPSnake();
        this.setupPSnake();
        this.setupPSnake2();
        this.direction1=dir;
        this.direction2=dir;
        this.deltaTime = 600;
        clearTimeout(PTIMER);
        clearTimeout(PTIMER2);
        clearTimeout(NPTIMER);
        this.pSnakeanimate();
        this.pSnake2animate();
        this.npSnakeanimate();
        this.food = new Food(Math.floor(Math.random()*8),Math.floor(Math.random()*8),0);

    }

    setupNPSnake(){
        this.npSnake=[];
        this.npPoints = 0;
        document.getElementById("npScore").innerHTML = this.npPoints;
        var npx = Math.floor(0), npy = Math.floor(Math.random()*8), npz = 0;
        for(var i = 0;i<this.size;i++){
            this.npSnake.push(new NPSnake(npx, npy, npz));
        }
    }

    setupPSnake(){
        this.pSnake=[];
        this.pPoints = 0;
        document.getElementById("pScore").innerHTML = this.pPoints;
        var px = Math.floor(0), py = Math.floor(Math.random()*8), pz = 0;
        for(var i = 0;i<this.size;i++){
            this.pSnake.push(new PSnake(px, py, pz, pSnakeColors1));
        }
    }

    setupPSnake2(){
        this.pSnake2=[];
        this.pPoints2 = 0;
        document.getElementById("pScore2").innerHTML = this.pPoints2;
        var px = Math.floor(0), py = Math.floor(Math.random()*8), pz = 0;
        for(var i = 0;i<this.size;i++){
            this.pSnake2.push(new PSnake(px, py, pz, pSnakeColors2));
        }
    }

    collision(snake){
        var pSnakeCollision = this.pSnake.some(function(body){
            return (body.x==snake.x && body.y==snake.y && body.z==snake.z)
        });

        var pSnake2Collision = this.pSnake2.some(function(body){
            return (body.x==snake.x && body.y==snake.y && body.z==snake.z)
        });

        var npSnakeCollision = this.npSnake.some(function(body){
            return (body.x==snake.x && body.y==snake.y && body.z==snake.z)
        });

        var sideCollision = !(snake.x<sceneSize && snake.x >= 0 && 
            snake.y<sceneSize && snake.y >= 0 && snake.z<sceneSize && snake.z >= 0);

        return pSnake2Collision || npSnakeCollision || pSnakeCollision || sideCollision;
    }

    getFood(snake){
        return snake.x == this.food.x && snake.y == this.food.y && snake.z == this.food.z;
    }

    npScore() {
        this.npPoints++;
        document.getElementById("npScore").innerHTML = this.npPoints;
    }

    pScore() {
        this.pPoints++;
        document.getElementById("pScore").innerHTML = this.pPoints;
    }

    pScore2() {
        this.pPoints2++;
        document.getElementById("pScore2").innerHTML = this.pPoints2;
    }

    npSnakemove(index){
        var temp = this.npSnake.pop();
        var tail = temp;
        var head = this.npSnake[0];
        var direction = [0, 0, 0];
        direction[index] = 0.5;
        temp.x = head.x + direction[0];
        temp.y = head.y + direction[1];
        temp.z = head.z;

        if (this.collision(temp)) {
            clearTimeout(NPTIMER);
            this.setupNPSnake();
            return;
        }

        temp.setupCube();

        this.npSnake.unshift(temp);

        if(this.getFood(temp)){
            var snakeCollision;
            var s = this;
            do{
                s.food.x = Math.floor(Math.random()*sceneSize);
                s.food.y = Math.floor(Math.random()*sceneSize);
                s.food.z = 0;
                snakeCollision = s.npSnake.some(function(snake){
                    return (snake.x==s.food.x && snake.y==s.food.y && snake.z==s.food.z)
                });
            }while(snakeCollision);
            this.food.setupCube();
            this.npSnake.push(new NPSnake(tail.x,tail.y,tail.z));
            this.npScore();
        }

    }

    pSnakemove(){
        var temp = this.pSnake.pop();
        var tail = temp;
        var head = this.pSnake[0];
        temp.x = head.x + this.direction1[0];
        temp.y = head.y + this.direction1[1];
        temp.z = head.z;

        if (this.collision(temp)) {
            clearTimeout(PTIMER);
            this.setupPSnake();
            return;
        }

        temp.setupCube();

        this.pSnake.unshift(temp);

        if(this.getFood(temp)){
            var snakeCollision;
            var s = this;
			do{
                s.food.x = Math.floor(Math.random()*sceneSize);
                s.food.y = Math.floor(Math.random()*sceneSize);
                s.food.z = 0;
                snakeCollision = s.pSnake.some(function(snake){
                    return (snake.x==s.food.x && snake.y==s.food.y && snake.z==s.food.z)
                });
            }while(snakeCollision);
            this.food.setupCube();
            this.pSnake.push(new PSnake(tail.x,tail.y,tail.z, pSnakeColors1));
            this.pScore();
        }
    }

    pSnake2move(){
        var temp = this.pSnake2.pop();
        var tail = temp;
        var head = this.pSnake2[0];
        temp.x = head.x + this.direction2[0];
        temp.y = head.y + this.direction2[1];
        temp.z = head.z;

        if (this.collision(temp)) {
            clearTimeout(PTIMER2);
            this.setupPSnake2();
            return;
        }

        temp.setupCube();

        this.pSnake2.unshift(temp);

        if(this.getFood(temp)){
            var snakeCollision;
            var s = this;
            do{
                s.food.x = Math.floor(Math.random()*sceneSize);
                s.food.y = Math.floor(Math.random()*sceneSize);
                s.food.z = 0;
                snakeCollision = s.pSnake2.some(function(snake){
                    return (snake.x==s.food.x && snake.y==s.food.y && snake.z==s.food.z)
                });
            }while(snakeCollision);
            this.food.setupCube();
            this.pSnake2.push(new PSnake(tail.x,tail.y,tail.z, pSnakeColors2));
            this.pScore2();
        }
    }

    setDirection1(dir){
        this.direction1 = dir;

    }

    setDirection2(dir){
        this.direction2 = dir;
    }

   
    draw(){
        this.food.draw();
        for (var i = 0; i < this.pSnake.length; i++){
            this.pSnake[i].draw();
        }

        for (var i = 0; i < this.pSnake2.length; i++){
            this.pSnake2[i].draw();
        }
        for (var i = 0; i < this.npSnake.length; i++){
            this.npSnake[i].draw();
        }

    }

    pSnakeanimate(){
        var snake = this;

        function timeout(){
            PTIMER = setTimeout(function(){
                    snake.pSnakemove();
                    timeout();
                
            }, snake.deltaTime);
        }
        timeout();
    }

    pSnake2animate(){
        var snake = this;
        function timeout(){
            PTIMER2 = setTimeout(function(){
                    snake.pSnake2move();
                    timeout();
                
            }, snake.deltaTime);
        }
        timeout();
    }


    npSnakeanimate(){
        var snake = this;

        function timeout(){
            NPTIMER = setTimeout(function(){
                
                    snake.npSnakemove(Math.floor(Math.random() * 2));
                    timeout();
                
            }, snake.deltaTime);
        }
        timeout();
      
    }
	
	pause(paused){
        if (paused) {
            clearTimeout(PTIMER);
            clearTimeout(PTIMER2);
            clearTimeout(NPTIMER);
        }
        else {
            this.pSnakeanimate();
            this.pSnake2animate();
            this.npSnakeanimate();
        }
    }

   
}