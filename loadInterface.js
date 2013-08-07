/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var loadedImages = [];

var loadInterface_interval = 25;

var physicsCanvas = document.getElementById('physicsCanvas');
var physicsContext = physicsCanvas.getContext('2d');

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function loadInterface_init(){
	physicsCanvas.width = theWidth;
	physicsCanvas.height = theHeight;
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

//triggered when all the interface images are done fake-loading
var readyForPhysics = false;

function loadInterface_update(){
	physicsContext.clearRect(0,0,window.innerWidth,window.innerHeight);
	if(loopCount%loadInterface_interval===0){
		makeNewComponent();
	}

	if(loadedImages.length>0){
        var doneCount = 0;
        for(var i=0;i<loadedImages.length;i++){
            loadedImages[i].update();
            if(loadedImages[i].done === true) doneCount++;
            loadedImages[i].paint();
        }
        if(imgNames.length===0 && doneCount===loadedImages.length && !readyForPhysics){
            readyForPhysics=true;
        }
    }
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var heads = [];

var headTotal = 7;

for(var i=0;i<headTotal;i++){
    heads[i] = document.createElement('img');
    heads[i].src = 'images/head'+(i+1)+'.png';
    //heads[i].style.display = 'none';
}

var headsMade = false;
var everyoneInside = false;

function makeHeader(){
	for(var i=0;i<headTotal;i++){
		var tempHead = heads[i];
		var tempX = Math.floor(Math.random()*theWidth);
		var tempY = Math.floor(Math.random()*-230);
        var hinge = false;
        if(i===headTotal-1){
            hinge = true;
        }
		var s = new LoadedImage(tempX,tempY,tempHead.width,tempHead.height,tempHead,true,false,hinge);
		loadedImages.push(s);
	}
	headsMade=true;
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var imagesSpaceWidth = 1000;
var imagesOffsetLeft = (window.innerWidth-imagesSpaceWidth)/2;
if(imagesOffsetLeft<0) imagesOffsetLeft=0;

function makeNewComponent(){
    if(imgNames.length>0){

        var index = Math.floor(Math.random()*imgNames.length);
        var temp = document.createElement('img');

        temp.style.display = 'none';
        var tempX = Math.floor(imgNames[index].x * imagesSpaceWidth)+imagesOffsetLeft;
        var tempY = imgNames[index].y;
        temp.src = 'images/'+imgNames[index].name+'.png';
        var isHTML = imgNames[index].isHTML;

        imgNames.splice(index,1);

        temp.onload = function(){
            var tempWidth = this.width;
            var tempHeight = this.height;

            if(tempX-tempWidth/2<imagesOffsetLeft) tempX = tempWidth/2+imagesOffsetLeft;;
            if(tempY-tempHeight/2<0) tempY = tempHeight/2;

            if(tempY+tempHeight/2<window.innerHeight && tempX+tempWidth/2<window.innerWidth){
                var t = new LoadedImage(tempX,tempY,tempWidth,tempHeight,temp,false,isHTML);
                loadedImages.push(t);
            }
        }
    }
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function LoadedImage(x,y,w,h,el,seed,isHTML,isHinge){

    this.x = x;
    this.y = y;

    if(seed){
	    this.impulse = true;
        this.perc = 1;
	}
    else if(isHTML){
        this.impulse = false;
        this.perc = 1;
    }
	else{
		this.impulse = false;
        this.perc = 0;
	}
    this.hinge = false;
    if(isHinge){
        this.hinge=true;
    }

    this.percStep = .02;

    this.width = w;
    this.height = h;
    this.loadHeight = this.height*this.perc;
    this.r = 0;
    this.elem = el;
    this.done = false;
}

LoadedImage.prototype.update = function(){
    if(!this.done){
        this.perc+=this.percStep
        if(this.perc>1){
            this.perc=1;
            this.done=true;
        }
        this.loadHeight = this.height*this.perc;
    }
}

LoadedImage.prototype.paint = function(){
    physicsContext.translate(this.x,this.y);
    physicsContext.rotate(this.r);

    var clearY = ((this.perc*2)-1)*(this.height/2);

    var tx = -this.width/2;
    var ty = -this.height/2;
    var tw = this.width;
    var th = this.loadHeight;

    physicsContext.drawImage(this.elem,0,0,tw,th,tx,ty,tw,th);

    var clearY = ((this.perc*2)-1)*(this.height/2);

    physicsContext.rotate(-this.r);
    physicsContext.translate(-this.x,-this.y);
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////