/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var imgCanvas = document.getElementById('bgImgCanvas');
imgCanvas.style.display = 'none';
var context = imgCanvas.getContext('2d');

var pixels = document.getElementById('pixels');
var pixelsContext = pixels.getContext('2d');

var buffer = document.createElement('canvas');
buffer.style.display = 'none';
var bufferContext = buffer.getContext('2d');

var bg = document.createElement('img');
bg.style.display = 'none';
bg.src = 'images/bg_home.png';

var headless = document.createElement('img');
headless.style.display = 'none';
headless.src = 'images/headless.png';

var head = document.createElement('img');
head.style.display = 'none';
head.src = 'images/head.png';

var windowRatio = 1;

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function bgImage_init(){
      windowRatio = bg.height/bg.width;

      imgCanvas.width = bg.width;
      imgCanvas.height = bg.height;

      context.drawImage(bg,0,0,imgCanvas.width,imgCanvas.height);

      pixels.width = theWidth;
      pixels.height = theHeight;
      if(pixels.height>theHeight) pixels.height = theHeight;
      pixelsContext.fillStyle = 'white';
      pixelsContext.fillRect(0,0,pixels.width,pixels.height);
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var dimCount = 2;
var dimThresh = 20;
var bgImage_interval = 30;

var relYSize = 0;
var relYStep = 0.008;

var data = undefined;
var dirtyData = undefined;
var circles = false;

function bgImage_update(step){
      if(step){
            if(loopCount%bgImage_interval===0 && dimCount<dimThresh){
                  dimCount++;
                  buffer.width = Math.pow(dimCount,2);
                  buffer.height = Math.floor(buffer.width*windowRatio);
                  bufferContext.drawImage(imgCanvas,0,0,buffer.width,buffer.height);
            }
            stepPixels();
      }
      // else if(data===undefined){

      //       var buffHeight = Math.floor(buffer.height*relYSize);
      //       var pixHeight = Math.floor(bg.height*relYSize);

      //       data = pixelsContext.getImageData(0,0,pixels.width,pixHeight);
      //       dirtyData = pixelsContext.getImageData(0,0,pixels.width,pixHeight);
      // }
      // else{
      //       var pixHeight = Math.floor(bg.height*relYSize);

      //       var test = true;
      //       var randoThing = Math.floor(Math.random()*300);
      //       var offset = Math.floor(Math.random()*(data.data.length/4))*4;

      //       var r = Math.floor(Math.random()*55);
      //       var g = Math.floor(Math.random()*55);
      //       var b = Math.floor(Math.random()*55);

      //       var rX = Math.floor(Math.random()*pixels.width*4);
      //       var rY = Math.floor(Math.random()*pixHeight);
      //       var divider = Math.floor(Math.pow(Math.random(),2)*2000)+20;

      //       for(var x=0;x<pixels.width*4;x+=4){
      //             for(var y=0;y<pixHeight;y++){

      //                   var totalDist = Math.sqrt(Math.pow(x-rX,2)+Math.pow(y*4-rY,2));
      //                   if(Math.floor(Math.pow(totalDist/divider,2))%2===0){
      //                         test = true;
      //                   }
      //                   else{
      //                         test = false;
      //                   }

      //                   if(test){
      //                         var i=x+(y*pixels.width*4);
      //                         var tempIndex = (i+offset)%data.data.length;
      //                         dirtyData.data[i] = Math.abs(r-data.data[tempIndex]);
      //                         dirtyData.data[i+1] = Math.abs(g-data.data[tempIndex+1]);
      //                         dirtyData.data[i+2] = Math.abs(b-data.data[tempIndex+2]);
      //                   }
      //             }
      //       }
      //       pixelsContext.putImageData(dirtyData,0,0);
      // }
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function stepPixels(){
      relYSize+=relYStep;
      relYStep*=.985;
      if(relYStep<.0005) relYStep = .0005;
      if(relYSize>1){
            relYSize=0;
      }
      else{
            var buffHeight = buffer.height*relYSize;
            var pixHeight = bg.height*relYSize;

            if(pixels.width>bg.width){
                  pixHeight = pixels.height*relYSize;
                  pixelsContext.drawImage(buffer,0,0,buffer.width,buffHeight,0,0,pixels.width,pixHeight);
            }
            else{
                  pixelsContext.drawImage(buffer,0,0,buffer.width,buffHeight,0,0,bg.width,pixHeight);
            }
      }
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function cutOffHisHead(){

      context.drawImage(headless,0,0,imgCanvas.width,imgCanvas.height);
      bufferContext.drawImage(imgCanvas,0,0,buffer.width,buffer.height);

      var buffHeight = buffer.height*relYSize;
      var pixHeight = bg.height*relYSize;

      if(pixels.width>bg.width){
            pixHeight = pixels.height*relYSize;
            pixelsContext.drawImage(buffer,0,0,buffer.width,buffHeight,0,0,pixels.width,pixHeight);
      }
      else{
            pixelsContext.drawImage(buffer,0,0,buffer.width,buffHeight,0,0,bg.width,pixHeight);
      }

      var tempX = 400;
      var tempY = 306;
      var s = new LoadedImage(tempX,tempY,head.width,head.height,head,false);
      s.perc = 1;
      s.loadHeight = s.height*s.perc;
      loadedImages.push(s);
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////