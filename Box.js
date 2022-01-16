
// let box = new Box();
// let c = box.returnCanvas();
// container.appendChild(c);  // append it to a container div element or sthing

// box.CANVAS_SIZE(500, 500); // this is the number of pixels
// box.RANGE_X(5, 50); // set the range in x
// box.RANGE_Y(3, 130); // set the range in y


// box.SHOWGRIDY(5);

// box.SHOWVALUE({'x':5,'y':5}, '#fco', 2);

/*
let obj = {
  'labels':{
    'x':null,
    'y':null
  }
}
*/
function Box(obj) {

  this.c = document.createElement('canvas');
  this.ctx = this.c.getContext('2d');
 
  // STRUCTURE
  this.data = {
    'dimension':{
      'w':100,
      'h':100
    },
    'zoom':{
      'x':0,
      'y':0
    },
    'translate':{
      'x':0,
      'y':0
    },
    'range':{
      'x':{
        'min':0,
        'max':0,
        'span':0
      },
      'y':{
        'min':0,
        'max':0,
        'span':0
      }
    }
  };
     
  // DEFAULTS
  this.RANGE_X(0, 100);
  this.RANGE_Y(0, 100);
  this.CANVAS_SIZE(300, 300);
  this.c.style.border = '1px solid #999';



}

Box.prototype.RETURN_CANVAS = function() {
  this.c.addEventListener('click', function(e) {
    let pixel = {'x':e.offsetX,'y':e.offsetY};
    let val = this.PIXEL2VAL(pixel);
  }.bind(this));
  // makes is so that the 'this' skips a level, and refers to the parent and not the self
  // 'this' in 'this.PIXEL2VAL(pixel)' would normally refer to 'this.c'
  // but because of '.bind(this)' it now refers to the parent of 'this.c' which is object of RETURN_CANVAS, 'Box'
 
  return this.c;
}

Box.prototype.RANGE_X = function(min, max) {
 this.data.range.x.min = min;
 this.data.range.x.max = max;
 this.data.range.x.span = max-min;
 this.data.zoom.x = this.data.dimension.w / this.data.range.x.span;
 this.data.translate.x = -this.data.range.x.min;
}

Box.prototype.RANGE_Y = function(min, max) {
 this.data.range.y.min = min;
 this.data.range.y.max = max;
 this.data.range.y.span = max-min;
 this.data.zoom.y = this.data.dimension.h / this.data.range.y.span;
 this.data.translate.y = -this.data.range.y.min;
}

Box.prototype.CANVAS_SIZE = function(w, h) {
 this.data.dimension.w = w;
 this.data.dimension.h = h;
 this.c.width = this.data.dimension.w;
 this.c.height = this.data.dimension.h;
 
 // RESET ZOOM AND XLATE BY REAPPLYING THE RANGES
 this.RANGE_X(this.data.range.x.min, this.data.range.x.max);
 this.RANGE_Y(this.data.range.y.min, this.data.range.y.max);
}



Box.prototype.VAL2PIXEL = function(val) {  // val : (0,0) is bottom-left (Cartesian)
 return {
  'x':(val.x+this.data.translate.x)*this.data.zoom.x,
  'y':this.data.dimension.h - (val.y+this.data.translate.y)*this.data.zoom.y
 }
}

Box.prototype.PIXEL2VAL = function(pixel) { // pixel : (0,0) is top-left (standard computer/matrix grid)
 return {
  'x':(pixel.x/this.data.zoom.x)-this.data.translate.x,
  'y':(this.data.dimension.h-pixel.y)/this.data.zoom.y-this.data.translate.y
 }
}

// centerOnValue(val) // takes the value, and places it in the center of the canvas, scaled so that it goes from (0,0) to (cx, cy)

Box.prototype.recenter = function(val) {
  let spanx = this.data.range.x.span;
  let spany = this.data.range.y.span;
  this.rangex(val.x-spanx/2, val.x+spanx/2);
  this.rangey(val.y-spany/2, val.y+spany/2);
  //console.log(this);
  // BUT I NEED TO RECALC EVERYTHING
  //this.clear();
  //this.SHOW_GRID_X(1);
  //this.draw();
}

Box.prototype.returnCanvas = function() {
 this.c.addEventListener('click', function(e) {
  let pixel = {'x':e.offsetX,'y':e.offsetY};
  let val = this.PIXEL2VAL(pixel);
  //this.recenter(val);
 }.bind(this)); // makes this.c inherit 'this' from Box
 return this.c;
}



Box.prototype.border = function(x) {
 this.c.style.border = x;
}

Box.prototype.dimension = function(w, h) {
 this.data.dimension.w = w;
 this.data.dimension.h = h;
 this.c.width = this.data.dimension.w;
 this.c.height = this.data.dimension.h;
}



Box.prototype.zoom = function(zx, zy) {
 this.data.zoom.x = zx;
 this.data.zoom.y = zy;
}

Box.prototype.translate = function(x, y) {
 this.data.translate.x = x;
 this.data.translate.y = y;
}

Box.prototype.rangex = function(min, max) {
 this.data.range.x.min = min;
 this.data.range.x.max = max;
 this.data.range.x.span = max-min;

 this.data.zoom.x = this.data.dimension.w / this.data.range.x.span;
 this.data.translate.x = -this.data.range.x.min;
}
Box.prototype.rangey = function(min, max) {
 this.data.range.y.min = min;
 this.data.range.y.max = max;
 this.data.range.y.span = max-min;

 this.data.zoom.y = this.data.dimension.h / this.data.range.y.span;
 this.data.translate.y = -this.data.range.y.min;
}




Box.prototype.CLEAR_CANVAS = function() {
 this.ctx.fillStyle = '#fff';
 this.ctx.beginPath();
 this.ctx.rect(0, 0, this.data.dimension.w, this.data.dimension.h);
 this.ctx.fill();
}


Box.prototype.clear = function() {
 this.ctx.fillStyle = '#fff';
 this.ctx.beginPath();
 this.ctx.rect(0, 0, this.data.dimension.w, this.data.dimension.h);
 this.ctx.fill();
}

Box.prototype.SHOWGRIDX = function(dx) {

 if (!arguments[0]) {
   dx = 50* this.data.range.x.span / this.data.dimension.w; // default is 25 px
 }

 for (let x = -dx; x > this.data.range.x.min; x -= dx) {
   let val0 = {'x':x,'y':this.data.range.y.min};
   let val1 = {'x':x,'y':this.data.range.y.max};
   this.CONNECTVALUES(val0, val1, '#ddd');
 }

 for (let x = 0; x < this.data.range.x.max; x += dx) {
   let val0 = {'x':x,'y':this.data.range.y.min};
   let val1 = {'x':x,'y':this.data.range.y.max};
   this.CONNECTVALUES(val0, val1, '#ddd');
 }


};

Box.prototype.SHOWGRIDY = function(dy) {

 if (!arguments[0]) {
   dy = 50* this.data.range.y.span / this.data.dimension.h; // default is 25 px
 }

 for (let y = -dy; y > this.data.range.y.min; y -= dy) {
   let val0 = {'x':this.data.range.x.min,'y':y};
   let val1 = {'x':this.data.range.x.max,'y':y};
   this.CONNECTVALUES(val0, val1, '#ddd');
 }

 for (let y = 0; y < this.data.range.y.max; y += dy) {
   let val0 = {'x':this.data.range.x.min,'y':y};
   let val1 = {'x':this.data.range.x.max,'y':y};
   this.CONNECTVALUES(val0, val1, '#ddd');
 }


};

/*
  let obj = {
    'dx':1,
    'color_string':'#ddd',
    'line_width':1
  }
*/
Box.prototype.SHOW_GRID_X = function(obj) {

  let dx = 10;
  let color_string = '#ddd';
  let line_width = 1;
 
  if (obj) {
    if (obj.dx) {dx = obj.dx};
    if (obj.color_string) {color_string = obj.color_string};
    if (obj.line_width) {line_width = obj.line_width};
  }
 
  let x_start = Math.floor(this.data.range.x.min/dx)*dx;
 
  for (let x = x_start; x < this.data.range.x.max; x += dx) {

    let val0 = {'x':x,'y':this.data.range.y.min};
    let val1 = {'x':x,'y':this.data.range.y.max};

    let pixel0 = this.VAL2PIXEL(val0);
    let pixel1 = this.VAL2PIXEL(val1);

    this.ctx.lineWidth = line_width;
    this.ctx.strokeStyle = color_string;
    this.ctx.fillStyle = color_string;
    this.ctx.beginPath();
    this.ctx.moveTo(pixel0.x, pixel0.y);
    this.ctx.lineTo(pixel1.x, pixel1.y);
    this.ctx.stroke();  
  }
};
Box.prototype.SHOW_GRID_Y = function(obj) {

  let dy = 10;
  let color_string = '#ddd';
  let line_width = 1;
 
  if (obj) {
    if (obj.dy) {dy = obj.dy};
    if (obj.color_string) {color_string = obj.color_string};
    if (obj.line_width) {line_width = obj.line_width};
  }
 
  let y_start = Math.floor(this.data.range.y.min/dy)*dy;
 
  for (let y = y_start; y < this.data.range.y.max; y += dy) {

    let val0 = {'x':this.data.range.x.min,'y':y};
    let val1 = {'x':this.data.range.x.max,'y':y};

    let pixel0 = this.VAL2PIXEL(val0);
    let pixel1 = this.VAL2PIXEL(val1);

    this.ctx.lineWidth = line_width;
    this.ctx.strokeStyle = color_string;
    this.ctx.fillStyle = color_string;
    this.ctx.beginPath();
    this.ctx.moveTo(pixel0.x, pixel0.y);
    this.ctx.lineTo(pixel1.x, pixel1.y);
    this.ctx.stroke();  
  }
};

Box.prototype.SHOW_FLOATING_LOG_Y_AXIS = function(n) {

 let sh = this.data.dimension.h/n;
 let sw = this.data.dimension.w/n;
 
 let n1 = 2;
 let n2 = n-n1;
 
 let p0 = {'x':sw,'y':sh*n1};
 let p1 = {'x':sw,'y':sh*n2};

 let v0 = this.PIXEL2VAL(p0);
 let v1 = this.PIXEL2VAL(p1);
 
 this.CONNECTVALUES(v0, v1, '#333', 0.5);
 
 let dsw = 5;
 for (let i = n1; i <= n2; i++) {
  let p0 = {'x':sw-dsw,'y':sh*i};
  let p1 = {'x':sw+dsw,'y':sh*i};
  let v0 = this.PIXEL2VAL(p0);
  let v1 = this.PIXEL2VAL(p1);
  this.ctx.fillStyle = '#333';
  this.ctx.textAlign = 'left';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText((v0.y).toFixed(2), p0.x+2*dsw, p0.y);
  this.ctx.stroke();
  this.CONNECTVALUES(v0, v1, '#333', 0.5);
 }
 
 this.ctx.textAlign = 'center';
 this.ctx.textBaseline = 'top';
 this.ctx.fillText((this.data.label.y), sw, sh*(n2+0.25));
};
Box.prototype.SHOW_FLOATING_Y_AXIS = function(n) {

 let sh = this.data.dimension.h/n;
 let sw = this.data.dimension.w/n;
 
 let n1 = 2;
 let n2 = n-n1;
 
 let p0 = {'x':sw,'y':sh*n1};
 let p1 = {'x':sw,'y':sh*n2};

 let v0 = this.PIXEL2VAL(p0);
 let v1 = this.PIXEL2VAL(p1);
 
 this.CONNECTVALUES(v0, v1, '#333', 0.5);
 
 let dsw = 5;
 for (let i = n1; i <= n2; i++) {
  let p0 = {'x':sw-dsw,'y':sh*i};
  let p1 = {'x':sw+dsw,'y':sh*i};
  let v0 = this.PIXEL2VAL(p0);
  let v1 = this.PIXEL2VAL(p1);
  this.ctx.fillStyle = '#333';
  this.ctx.textAlign = 'left';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText((v0.y).toFixed(0), p0.x+2*dsw, p0.y);
  this.ctx.stroke();
  this.CONNECTVALUES(v0, v1, '#333', 0.5);
 }
 
 this.ctx.textAlign = 'center';
 this.ctx.textBaseline = 'top';
 this.ctx.fillText((this.data.label.y), sw, sh*(n2+0.25));
};
Box.prototype.SHOW_FLOATING_LOG_X_AXIS = function(obj) {

 
  let x_0 = this.data.dimension.w/5;
  let x_1 = this.data.dimension.w - x_0;
  let y = this.data.dimension.h*4.25/5;
 
  let val_0 = this.PIXEL2VAL({'x':x_0,'y':y});
  let val_1 = this.PIXEL2VAL({'x':x_1,'y':y});
 
  this.CONNECT_VALUES({
    'vals':[val_0, val_1]
  })



 
};

Box.prototype.SHOW_FLOATING_X_AXIS = function(n, y_val) {

 //let n = 9;
 let sh;
 if (arguments[1] !== null) {
   let v3 = {'x':0,'y':y_val};
   //console.log(v3);
   let p3 = this.VAL2PIXEL(v3);
   //console.log(p3);
   sh = p3.y;
 } else {
  sh = this.data.dimension.h - this.data.dimension.h/n;
 }
 let sw = this.data.dimension.w/n;
 
 let n1 = 1;
 let n2 = n-n1;
 
 let p0 = {'x':sw*n1,'y':sh};
 let p1 = {'x':sw*n2,'y':sh};

 let v0 = this.PIXEL2VAL(p0);
 let v1 = this.PIXEL2VAL(p1);
 
 this.CONNECTVALUES(v0, v1, '#333', 0.5);

 let dsh = 5;
 for (let i = n1; i <= n2; i++) {
  let p0 = {'x':sw*i,'y':sh+dsh};
  let p1 = {'x':sw*i,'y':sh-dsh};
  let v0 = this.PIXEL2VAL(p0);
  let v1 = this.PIXEL2VAL(p1);
  this.ctx.fillStyle = '#333';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'top';
  this.ctx.fillText(v0.x.toFixed(0), p0.x, p0.y+1*dsh);
  this.ctx.stroke();
  this.CONNECTVALUES(v0, v1, '#333', 0.5);
 }

 this.ctx.textAlign = 'right';
 this.ctx.textBaseline = 'middle';
 this.ctx.fillText((this.data.label.x).toUpperCase(), sw*(n1-0.25), sh);

};

Box.prototype.showAxes = function(fontSize) {

 this.ctx.strokeStyle = '#333';
 
 this.ctx.beginPath();
 this.ctx.moveTo((0+this.data.translate.x)*this.data.zoom.x, 0);
 this.ctx.lineTo((0+this.data.translate.x)*this.data.zoom.x, this.data.dimension.h);
 this.ctx.stroke();
 
 // X AXIS LABEL
 this.ctx.fillStyle = '#333';
 this.ctx.font = (fontSize || this.data.dimension.w/100*3.5) + 'px Monospace';
 this.ctx.textAlign = "right";
 this.ctx.fillText(this.data.label.y, this.data.translate.x*this.data.zoom.x-this.data.dimension.w/100, this.data.translate.x*this.data.zoom.x);

 // X AXIS
 this.ctx.beginPath();
 this.ctx.moveTo(0, this.data.dimension.h-(0+this.data.translate.y)*this.data.zoom.y);
 this.ctx.lineTo(this.data.dimension.w, this.data.dimension.h-(0+this.data.translate.y)*this.data.zoom.y);
 this.ctx.stroke();
 
 // X AXIS LABEL
 this.ctx.fillStyle = '#333';
 this.ctx.font = (fontSize || this.data.dimension.w/100*3.5) + 'px Monospace';
 this.ctx.fillText(this.data.label.x, this.data.dimension.w-(0+this.data.translate.x)*this.data.zoom.x, this.data.dimension.h-(0+this.data.translate.y)*this.data.zoom.y + this.data.dimension.w/100*3.5);
 
 if (this.data.range.x.min > 0 || this.data.range.y.min > 0) {
   
   let s0 = 20;
   let s1 = 30;
   let c = {'x':s0, 'y':this.data.dimension.h - s0};

   let o = this.PIXEL2VAL(c);
   console.log(o);
   console.log(this.data.range);
   
   let cx = {'x':s0+s1, 'y':this.data.dimension.h - s0};
   let ox = this.PIXEL2VAL(cx);
   
   let cy = {'x':s0, 'y':this.data.dimension.h - (s0 + s1)};
   
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#333';
    this.ctx.beginPath();
    this.ctx.moveTo(cy.x, cy.y);
    this.ctx.lineTo(c.x, c.y);
    this.ctx.lineTo(cx.x, cx.y);
    this.ctx.stroke();
   
    this.ctx.textAlign = 'start';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(this.data.label.x, c.x, c.y+2);
   
   
 }
 
}

Box.prototype.SHOWVALUE = function(val, colorstring, rx) {

 let pixel = this.VAL2PIXEL(val);
 this.ctx.fillStyle = colorstring;
 this.ctx.beginPath();
 this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
 this.ctx.fill();

}

/*
  let obj = {
    'val':val,
    'color_string':'#999',
    'rx':3
  }
*/


Box.prototype.DRAW_POINT = function(obj) {

  let color_string = '#999';
  let r = 3;
  if (obj.color_string) {color_string = obj.color_string}
  if (obj.r) {r = obj.r}

  let pixel = this.VAL2PIXEL(obj.val);
  this.ctx.fillStyle = color_string;
  this.ctx.beginPath();
  this.ctx.arc(pixel.x, pixel.y, r, 0, 2*Math.PI);
  this.ctx.fill();
}

// point has no color
Box.prototype.POINT = function(obj) {

  let pixel = this.VAL2PIXEL(obj.val);
  this.ctx.beginPath();
  this.ctx.arc(pixel.x, pixel.y, 3, 0, 2*Math.PI);
  this.ctx.fill();
}
Box.prototype.SQUARE = function(obj) {

  let color_string = '#999';
  let side_length = 1;
  if (obj.color_string) {color_string = obj.color_string}
  if (obj.s) {side_length = this.data.range.x.min + obj.s}

  let pixel = this.VAL2PIXEL(obj.val);
 
  let s = this.VAL2PIXEL({
    'x':side_length,
    'y':side_length
  });
   
  this.ctx.strokeStyle = color_string;
  this.ctx.beginPath();
  this.ctx.rect(pixel.x - s.x, pixel.y - s.x, s.x*2, s.x*2);
  this.ctx.stroke();
}

Box.prototype.DRAW_VALUE = function(obj) {

  let color_string = '#999';
  let rx = 3;
  if (obj.color_string) {color_string = obj.color_string}
  if (obj.rx) {rx = obj.rx}

  let pixel = this.VAL2PIXEL(obj.val);
  this.ctx.fillStyle = color_string;
  this.ctx.beginPath();
  this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
  this.ctx.fill();
}
/*
let obj = {
  'val':val,
  'slope':slope,
  'color_string':'#999',
  'line_width':2
}
*/
Box.prototype.DRAW_LINE = function(obj) {


  let line_width = obj.line_width;
  let color_string = obj.color_string;

  // console.log(val);
  let val0 = {
    'x':this.data.range.x.min,
    'y':obj.val.y - (obj.val.x - this.data.range.x.min)*obj.slope
  };
  // console.log(val0);
  let val1 = {
    'x':this.data.range.x.max,
    'y':val0.y + this.data.range.x.span*obj.slope
  };
 
 let pixel0 = this.VAL2PIXEL(val0);
 let pixel1 = this.VAL2PIXEL(val1);

 this.ctx.lineWidth = line_width;
 
 this.ctx.strokeStyle = color_string;
 this.ctx.fillStyle = color_string;
 this.ctx.beginPath();
 this.ctx.moveTo(pixel0.x, pixel0.y);
 this.ctx.lineTo(pixel1.x, pixel1.y);
 this.ctx.stroke();

}

/*
let obj = {
  'vals':[{},{},...],
  'color_string':'#999',
  'line_width':2
}
*/

// POINT, DOT, VALUE
// USES STROKE
Box.prototype.CONNECT_POINTS = function(obj) {

  for (let i = 0; i < obj.vals.length-1; i++) {

    let pixel_0 = this.VAL2PIXEL(obj.vals[i]);
    let pixel_1 = this.VAL2PIXEL(obj.vals[i+1]);
   
    this.ctx.beginPath();
    this.ctx.moveTo(pixel_0.x, pixel_0.y);
    this.ctx.lineTo(pixel_1.x, pixel_1.y);
    this.ctx.stroke();
  }
}

Box.prototype.CONNECT = function(arr) {

  let color_string = '#999';
  let line_width = 2;
 
  if (obj.color_string) {color_string = obj.color_string}
  if (obj.line_width) (line_width = obj.line_width);

  for (let i = 0; i < obj.vals.length-1; i++) {

    let pixel_0 = this.VAL2PIXEL(obj.vals[i]);
    let pixel_1 = this.VAL2PIXEL(obj.vals[i+1]);

    this.ctx.lineWidth = line_width;
    this.ctx.strokeStyle = color_string;
    // this.ctx.fillStyle = color_string;

    this.ctx.beginPath();
    this.ctx.moveTo(pixel_0.x, pixel_0.y);
    this.ctx.lineTo(pixel_1.x, pixel_1.y);
    this.ctx.stroke();
  }
}



Box.prototype.CONNECTVALUES = function(val0, val1, color_string, line_width) {

 let pixel0 = this.VAL2PIXEL(val0);
 let pixel1 = this.VAL2PIXEL(val1);

 this.ctx.lineWidth = (line_width || 1);
 
 this.ctx.strokeStyle = color_string;
 this.ctx.fillStyle = color_string;
 this.ctx.beginPath();
 this.ctx.moveTo(pixel0.x, pixel0.y);
 this.ctx.lineTo(pixel1.x, pixel1.y);
 this.ctx.stroke();
}

/*

arr = [{},{}]

*/


Box.prototype.stroke = function(color_string) {
  this.ctx.strokeStyle = color_string;
}
Box.prototype.line_width = function(line_width) {
  this.ctx.lineWidth = line_width;
}
Box.prototype.fill = function(color_string) {
  this.ctx.fillStyle = color_string;
}

Box.prototype.CONNECTVALUES2 = function(arr, color_string, line_width) {

  for (let i = 0; i < arr.length-1; i++) {

    let pixel0 = this.VAL2PIXEL(arr[i+0]);
    let pixel1 = this.VAL2PIXEL(arr[i+1]);

    this.ctx.lineWidth = (line_width || 1);
    this.ctx.strokeStyle = color_string;
    this.ctx.beginPath();
    this.ctx.moveTo(pixel0.x, pixel0.y);
    this.ctx.lineTo(pixel1.x, pixel1.y);
    this.ctx.stroke();

  }
}

Box.prototype.RECT_OUTLINE = function(val, w, h, color_string, line_width) {
 let pixel = this.VAL2PIXEL(val);
 this.ctx.lineWidth = (line_width || 1);
 this.ctx.strokeStyle = (color_string || '#333');
 this.ctx.beginPath();
 this.ctx.rect(pixel.x, pixel.y, w*this.data.zoom.x, h*this.data.zoom.y);
 this.ctx.stroke();
}
Box.prototype.RECT_SOLID = function(val, w, h, color_string, line_width) {
 let pixel = this.VAL2PIXEL(val);
 this.ctx.fillStyle = (color_string || '#fff');
 this.ctx.fillRect(pixel.x, pixel.y, w*this.data.zoom.x, h*this.data.zoom.y);
}
Box.prototype.TEXT = function(str, val, color_string, font_size, font_family) {
 let pixel = this.VAL2PIXEL(val);
 //console.log(pixel);
 font_size = (font_size || 15);
 font_family = (font_family || 'Arial');
 this.ctx.font = font_size + 'px ' + font_family;
 this.ctx.strokeStyle = (color_string || '#fff');
 this.ctx.fillText(str, pixel.x, pixel.y);
}

Box.prototype.draw = function() {
 
  this.maps.forEach(function(a, b, c) {

    let arr = a;
    //console.log(arr);
      /*
   // what is the operation?
   let operation = (function() {
     if (a[0] === 'get') {
       return function(a) {
         return a;
       }
     }
     if (a[0] === '**') {
       return function(a,b) {
         return a**b;
       }
     }
    if (a[0] === '+') {  /// its not arguments, i need arguments of
      return function(a,b) {
        return a + b;
      }
    };
    if (a[0] === '*') {
      return function(a,b) {
        return a*b;
      }
    };
   })();
   console.log(operation);
   */
   
   for (let i = this.data.range.x.min; i < this.data.range.x.max; i++) {
     let val = {'x':i,'y':abc(i,arr)};
     this.SHOWVALUE(val, '#fc0', 2);
   }
  }.bind(this));

}

function abc(x, arr) {

 if (arr[0] === 'get') {
   if (arr[1] === 'x') {
     return x;
   } else {
     return eval(arr[1]);        // why do ppl hate eval so much? why should i not use it?
   }
 }
 if (arr%arr===0) {
   return arr;
 }
 
 if (arr[0] === '**') {
   return abc(x, arr[1])**abc(x, arr[2]);
 }
 
 if (arr[0] === '/') {
   return abc(x, arr[1]) / abc(x, arr[2]);
 }
 if (arr[0] === '*') {
   return abc(x, arr[1]) * abc(x, arr[2]);
 }
 if (arr[0] === '-') {
   return abc(x, arr[1]) - abc(x, arr[2]);
 }
 
}
Box.prototype.DRAW_HISTOGRAM = function(obj) {
 
  // obj.data is what i need
  let n_bins = obj.k;
  let bin_width = this.data.range.x.span / n_bins;
  console.log(obj);
  for (let i = 0; i < n_bins; i++) {
    //console.log('this');
    this.RECT_OUTLINE({'x':i*bin_width,'y':0}, bin_width, -obj.data[i].count, '#aaa', 1);
  }
 
}





/*
  let obj = {
    'val':val,
    'color_string':'#000',
    'rx':1
  }
*/
Box.prototype.DRAW_VALUE = function(obj) {
 let pixel = this.VAL2PIXEL(obj.val);
 this.ctx.fillStyle = obj.colorstring;
 this.ctx.beginPath();
 this.ctx.arc(pixel.x, pixel.y, obj.rx, 0, 2*Math.PI);
 this.ctx.fill();
}





/*
  obj = {
    'alpha':[alpha0, alpha1],
    'budget':[budget0, budget1],
    'px':[px0, px1],
    'py':[py0, py1],
    'marshallian':true,
    'hicksian':true,
    'log':false,
    'color_string':'#000',
    'line_width':2
    'rx':4
  }
*/

Box.prototype.DRAW_DEMAND_CURVE = function(obj) {

  let line_width = 2;
  let rx = 4;
 
  let line_color = {
    'marshallian':{
      'initial':{
        'x':'#ffe6b3', // CASE 0
        'y':'#ffe6b3'  // CASE 1
      },
      'final':{
        'x':'#d1e0e0',  // CASE 2
        'y':'#d1e0e0'   // CASE 3
      }
    },
    'hicksian':{
      'initial':{
        'x':'#f937',  // CASE 4 : INITIAL HICKSIAN X
        'y':'#ffc266'   // CASE 5 : INITIAL HICKSIAN Y
      },
      'final':{
        'x':'#c2d1f0',  // CASE 6 : FINAL HICKSIAN X
        'y':'#c2d1f0'   // CASE 7
      }
    }
  }


  // CORE PARAMETERS

  let alpha_0 = (obj.alpha) ? (obj.alpha[0]) : (null); // BE CAREFUL WITH NULL, NULL**NULL = 1
  let alpha_1 = (obj.alpha) ? (obj.alpha[1]) : (null);
 
  let beta_0 = (obj.beta) ? (obj.beta[0]) : (null);
  let beta_1 = (obj.beta) ? (obj.beta[1]) : (null);
 
  let budget_0 = (obj.budget) ? (obj.budget[0]) : (null);
  let budget_1 = (obj.budget) ? (obj.budget[1]) : (null);

  let px_0 = (obj.px) ? (obj.px[0]) : (null);
  let px_1 = (obj.px) ? (obj.px[1]) : (null);
 
  let py_0 = (obj.py) ? (obj.py[0]) : (null);
  let py_1 = (obj.py) ? (obj.py[1]) : (null);


  // THE RESULTING ALLOCATIONS

  // MARSHALLIAN
  let x_0 = ((alpha_0 * budget_0 / px_0) || null); // BE CAREFUL WITH NULL, NULL**NULL = 1
  let y_0 = ((beta_0 * budget_0 / py_0) || null);
  let u_0 = (x_0 === null || y_0 === null) ? (null) : (x_0**alpha_0*y_0**beta_0);

  let x_1 = ((alpha_1 * budget_1 / px_1) || null);
  let y_1 = ((beta_1 * budget_1 / py_1) || null);
  let u_1 = (x_1 === null || y_1 === null) ? (null) : (x_1**alpha_1*y_1**beta_1);
 
  // HICKSIAN; COMPENSATED
  let xc_0 = (u_0*(py_0/px_0*alpha_0/beta_0)**beta_0);
  let yc_0 = (u_0*(px_0/py_0*beta_0/alpha_0)**alpha_0);
 
  let xc_1 = (!(u_0*(py_1/px_1*alpha_1/beta_1)) || !beta_1) ? (null) : (u_0*(py_1/px_1*alpha_1/beta_1)**beta_1);
  let yc_1 = (!(u_0*(px_1/py_1*beta_1/alpha_1)) || !alpha_1) ? (null) : (u_0*(px_1/py_1*beta_1/alpha_1)**alpha_1);

 
  // PREP FOR LOOP

  let dx_pixel = 2; // if dx_pixel = 2, then we calculate x-y every 2nd pixel
  let dx = dx_pixel * (this.data.range.x.span / this.data.dimension.w );
 
  let temp = new Array(8);
  temp[0] = {'x':0,'y':alpha_0 * budget_0 / (dx/1000)};   // INITIAL MARSHALLIAN X
  temp[1] = {'x':0,'y':beta_0 * budget_0 / (dx/1000)};    // INITIAL MARSHALLIAN Y
 
  temp[2] = {'x':0,'y':alpha_1 * budget_1 / (dx/1000)};   // INITIAL HICKSIAN X
  temp[3] = {'x':0,'y':beta_1 * budget_1 / (dx/1000)};    // INITIAL HICKSIAN Y
 
  temp[4] = {'x':0,'y':u_0*(py_0/(dx/1000)*alpha_0/beta_0)**beta_0}; // MARSHALLIAN RESPONSE X
  temp[5] = {'x':0,'y':u_0*(px_0/(dx/1000)*beta_0/alpha_0)**alpha_0}; // MARSHALLIAN RESPONSE Y
 
  temp[6] = {'x':0,'y':u_0*(py_1/(dx/1000)*alpha_1/beta_1)**beta_1}; // HICKSIAN RESPONSE X
  temp[7] = {'x':0,'y':u_0*(px_1/(dx/1000)*beta_1/alpha_1)**alpha_1}; // HICKSIAN RESPONSE Y

  let initial_marshallian_x = (obj.x[0] && obj.marshallian);
  let initial_marshallian_y = (obj.y[0] && obj.marshallian);
  let final_marshallian_x = (obj.x[1] && obj.marshallian);
  let final_marshallian_y = (obj.y[1] && obj.marshallian);
  let initial_hicksian_x = (obj.x[0] && obj.hicksian);
  let initial_hicksian_y = (obj.y[0] && obj.hicksian);
  let final_hicksian_x = (obj.x[1] && obj.hicksian);
  let final_hicksian_y = (obj.y[1] && obj.hicksian);


  // DRAW IN LOOP
  for (let x = dx; x < this.data.range.x.max+dx; x += dx) {

    // CASE 6 : FINAL HICKSIAN X
    if (final_hicksian_x) {
     
      /*
      let price = x;
      let qty = u_0*(py_1/x*alpha_1/beta_1)**beta_1;
     
      if (obj.log) {
        let ln_price = Math.log(price);
        let ln_qty = Math.log(qty);
      }
      */
     
      if (obj.log) {
       
        let lnpx_1 = Math.log(px_1);
        let lnxc_1 = Math.log(u_0) + beta_1 * Math.log(py_1*alpha_1/beta_1) - beta_1 * lnpx_1;
       
        this.DRAW_LINE({
          'val':{'x':lnpx_1,'y':lnxc_1},
          'slope':-beta_1,
          'color_string':line_color.hicksian.final.x,
          'line_width':line_width
        });
       
        this.DRAW_POINT({
          'val':{'x':lnpx_1,'y':lnxc_1},
          'color_string':line_color.hicksian.final.x,
          'rx':rx
        });
     
      } else {
       
        let price = x;
        let qty = u_0*(py_1/x*alpha_1/beta_1)**beta_1;
        let val = {'x':price,'y':qty};
       
        this.CONNECT_VALUES({
          'vals':[temp[6], val],
          'color_string':line_color.hicksian.final.x,
          'line_width':line_color
        });
       
        this.DRAW_POINT({
          'val':{'x':px_1,'y':xc_1},
          'color_string':line_color.hicksian.final.x,
          'rx':rx
        });
       
        temp[6] = val;
       
      }
    }
   
    // CASE 7 : FINAL HICKSIAN Y
    if (final_hicksian_y) {
     
      if (obj.log) {
       
        let lnpy_1 = Math.log(py_1);
        let lnyc_1 = Math.log(u_0) + alpha_1 * Math.log(px_1*beta_1/alpha_1) - alpha_1 * lnpy_1;
       
        this.DRAW_LINE({
          'val':{'x':lnpy_1,'y':lnyc_1},
          'slope':-alpha_1,
          'color_string':line_color.hicksian.final.y,
          'line_width':line_width
        });
       
        this.DRAW_POINT({
          'val':{'x':lnpy_1,'y':lnyc_1},
          'color_string':line_color.hicksian.final.y,
          'rx':rx
        });
     
      } else {
     
        let y = u_0*(px_1/x*beta_1/alpha_1)**alpha_1;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[7], val, line_color.hicksian.final.y, line_width);
        temp[7] = val;
       
        let pixel = this.VAL2PIXEL({'x':py_1,'y':yc_1});
        this.ctx.fillStyle = line_color.hicksian.final.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
     
      }
    }


    // CASE 4
    if (initial_hicksian_x) {
     
      if (obj.log) {
       
        let lnpx_0 = Math.log(px_0);
        let lnxc_0 = Math.log(u_0) + beta_0 * Math.log(py_0*alpha_0/beta_0) - beta_0 * lnpx_0;
       
        let pixel = this.VAL2PIXEL({'x':lnpx_0,'y':lnxc_0});
        this.ctx.fillStyle = line_color.hicksian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
       
        this.DRAW_LINE({
          'val':{'x':lnpx_0,'y':lnxc_0},
          'slope':-beta_0,
          'color_string':line_color.hicksian.initial.x,
          'line_width':line_width
        });
       
      } else {
     
        let y = u_0*(py_0/x*alpha_0/beta_0)**beta_0;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[4], val, line_color.hicksian.initial.x, line_width);
        temp[4] = val;
       
        let pixel = this.VAL2PIXEL({'x':px_0,'y':u_0*(py_0/px_0*alpha_0/beta_0)**beta_0});
        this.ctx.fillStyle = line_color.hicksian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI); // THIS POINT WILL ACTUALLY NOT BE SEEN
        this.ctx.fill();
       
      }
    }

    // CASE 5
    if (initial_hicksian_y) {
     
      if (obj.log) {
       
        let lnpy_0 = Math.log(py_0);
        let lnyc_0 = Math.log(u_0) + alpha_0 * Math.log(px_0*beta_0/alpha_0) - alpha_0 * lnpy_0;
       
        this.DRAW_LINE({
          'val':{'x':lnpy_0,'y':lnyc_0},
          'slope':-alpha_0,
          'color_string':line_color.hicksian.initial.y,
          'line_width':line_width
        });
       
        this.DRAW_POINT({
          'val':{'x':lnpy_0,'y':lnyc_0},
          'color_string':line_color.hicksian.initial.y,
          'rx':rx
        });
     
      } else {
     
        let y = u_0*(px_0/x*beta_0/alpha_0)**alpha_0;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[5], val, line_color.hicksian.initial.y, line_width);
        temp[5] = val;
       
        let pixel = this.VAL2PIXEL({'x':py_0,'y':u_0*(px_0/py_0*beta_0/alpha_0)**alpha_0});
        this.ctx.fillStyle = line_color.hicksian.initial.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI); // THIS POINT WILL ACTUALLY NOT BE SEEN
        this.ctx.fill();
     
      }
    }

    // CASE 3 : FINAL MARSHALLIAN Y
    if (final_marshallian_y) {
     
      if (obj.log) {
       
        let lnpy_1 = Math.log(py_1);
        let lny_1 = Math.log(beta_1*budget_1) - lnpy_1;
       
        this.DRAW_LINE({
          'val':{'x':lnpy_1,'y':lny_1},
          'slope':-1,
          'color_string':line_color.marshallian.final.y,
          'line_width':line_width
        });
       
        this.DRAW_POINT({
          'val':{'x':lnpy_1,'y':lny_1},
          'color_string':line_color.marshallian.final.y,
          'rx':rx
        });
     
      } else {
     
        let y = beta_1 * budget_1 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[3], val, line_color.marshallian.final.y, line_width);
        temp[3] = val;
       
        let pixel = this.VAL2PIXEL({'x':py_1,'y':(beta_1 * budget_1 / py_1)});
        this.ctx.fillStyle = line_color.marshallian.final.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
     
      }
    }

    // CASE 2 : FINAL MARSHALLIAN X
    if (final_marshallian_x) {
     
      if (obj.log) {
       
        // need x, but we have px, alpha, M
       
        let lnpx_1 = Math.log(px_1);
        let lnx_1 = Math.log(alpha_1*budget_1) - lnpx_1;
       
        let pixel = this.VAL2PIXEL({'x':lnpx_1,'y':lnx_1});
        this.ctx.fillStyle = line_color.marshallian.final.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
       
        this.DRAW_LINE({
          'val':{'x':lnpx_1,'y':lnx_1},
          'slope':-1,
          'color_string':line_color.marshallian.final.x,
          'line_width':line_width
        });
       
      } else {
     
        let y = alpha_1 * budget_1 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[2], val, line_color.marshallian.final.x, line_width);
        temp[2] = val;
       
        let pixel = this.VAL2PIXEL({'x':px_1,'y':(alpha_1 * budget_1 / px_1)});
        this.ctx.fillStyle = line_color.marshallian.final.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
     
      }
    }
   
    // CASE 1 : INITIAL MARSHALLIAN Y
    if (initial_marshallian_y) {
     
      if (obj.log) {
       
        let lnpy_0 = Math.log(py_0);
        let lny_0 = Math.log(beta_0*budget_0) - lnpy_0;
       
        this.DRAW_LINE({
          'val':{'x':lnpy_0,'y':lny_0},
          'slope':-1,
          'color_string':line_color.marshallian.initial.y,
          'line_width':line_width
        });
       
        this.DRAW_POINT({
          'val':{'x':lnpy_0,'y':lny_0},
          'color_string':line_color.marshallian.initial.y,
          'rx':rx
        });
     
      } else {
     
        let y = beta_0 * budget_0 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[1], val, line_color.marshallian.initial.y, line_width);
        temp[1] = val;
       
        let pixel = this.VAL2PIXEL({'x':py_0,'y':(beta_0 * budget_0 / py_0)});
        this.ctx.fillStyle = line_color.marshallian.initial.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
     
      }
    }
   
    // CASE 0 : INITIAL MARSHALLIAN X
    if (initial_marshallian_x) {
     
      if (obj.log) {
       
        // need x, but we have px, alpha, M
       
        let lnpx_0 = Math.log(px_0);
        let lnx_0 = Math.log(alpha_0*budget_0) - lnpx_0;
       
        let pixel = this.VAL2PIXEL({'x':lnpx_0,'y':lnx_0});
        this.ctx.fillStyle = line_color.marshallian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();

        this.DRAW_LINE({
          'val':{'x':lnpx_0,'y':lnx_0},
          'slope':-1,
          'color_string':line_color.marshallian.initial.x,
          'line_width':line_width
        });

      } else {
     
        let y = alpha_0 * budget_0 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[0], val, line_color.marshallian.initial.x, line_width);
        temp[0] = val;
       
        let pixel = this.VAL2PIXEL({'x':px_0,'y':(alpha_0 * budget_0 / px_0)});
        this.ctx.fillStyle = line_color.marshallian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
     
      }
    }

  } // closing the loop

  return {
    'initial':{
      'marshallian':{'x':x_0,'y':y_0,'u':u_0},
      'hicksian':{'x':xc_0,'y':yc_0,'u':u_0}
    },
    'final':{
      'marshallian':{'x':x_1,'y':y_1,'u':u_1},
      'hicksian':{'x':xc_1,'y':yc_1,'u':u_0}
    }
  };
 
}


/*
 obj = {
  'alpha':alpha,
  'beta':beta,
  'u':u,
  'x':x,
  'y':y
  'M',M,
  'px':px,
  'py':py,
  'color_string':#000,
  'line_width':1,
  'inverted':false,
  'color_string':#000,
  'rx':3
 }
*/
Box.prototype.DRAW_ISOQUANT = function(obj) {

  // must have alpha and beta
  // and we must either have utility, or have what we need to make utility
 
  // case 1 : u
  // case 2 : u=f(x,y)
  // case 3 : x=f(M,px) : y=f(M,py) : u=f(x,y)
 
  let line_width = 2;
  let color_string = '#000';
  let rx = 4;
  let inverted = false;

  if (obj) {
    if (obj.color_string) {color_string = obj.color_string};
  }


  let alpha, alpha_inv, beta, beta_inv;
  let u;
  let x, y;

  if (!obj.alpha || !obj.beta) {
    console.log('you need alpha and beta');
    return;
  } else {
    alpha = obj.alpha;
    alpha_inv = 1/alpha;
    beta = obj.beta;
    beta_inv = 1/beta;
  }

  // FIRST CASE :
  if (obj.u) {
    u = obj.u;
  }

  // SECOND CASE : u = u(x, y)
  if (!obj.u && (obj.x && obj.y)) {
    x = obj.x;
    y = obj.y;
    u = x**alpha*y**beta;
  }

  // THIRD CASE : u = u(budget, px, py)
  let budget, px, py;
  if (!obj.u && (!obj.x && !obj.y) && (obj.budget && obj.px && obj.py)) {
    // console.log('CASE 3');
    budget = obj.budget;
    px = obj.px;
    py = obj.py;
    x = alpha*budget/px;
    y = beta*budget/py;
    u = x**alpha*y**beta;
  }

  let dx_pixel = 2; // if dx_pixel = 2, then we calculate x-y every 2nd pixel
  let dx = dx_pixel * (this.data.range.x.span / this.data.dimension.w );

  let temp = {
    'x':this.data.range.x.min,
    'y':(u/this.data.range.x.min**obj.alpha)**beta_inv
  };
 
  for (let x = this.data.range.x.min+dx; x < this.data.range.x.max+dx; x += dx) {

    let y = (u/x**alpha)**beta_inv;
    let val;
   
    if (obj.inverted) {
      val = {'x':x, 'y':y};
      this.CONNECTVALUES({'x':this.data.range.x.max-temp.x, 'y':this.data.range.y.max-temp.y}, {'x':this.data.range.x.max-x, 'y':this.data.range.y.max-y}, color_string, line_width);
      temp = val;
    } else {
      val = {'x':x, 'y': y};
      this.CONNECTVALUES(temp, val, color_string, line_width);
      temp = val;
    }
   
  }

  // SHOW ALLOCATION
  let pixel = this.VAL2PIXEL({'x':x,'y':y});
  this.ctx.fillStyle = color_string;
  this.ctx.beginPath();
  this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
  this.ctx.fill();
 
 
}

/*
  let obj = {
    'budget':budget,
    'px':px,
    'py':py
  }
*/
Box.prototype.DRAW_BUDGET_LINE = function(obj) {

  let budget = obj.budget;
  let px = obj.px;
  let py = obj.py;

  let line_width = 2;
  let color_string = '#000';

  if (obj.color_string) {color_string = obj.color_string};
  if (obj.line_width) {line_width = obj.line_width};
 
  let x_int = {'x':budget/px,'y':0};
  let y_int = {'x':0,'y':budget/py};

  let pixel0 = this.VAL2PIXEL(x_int);
  let pixel1 = this.VAL2PIXEL(y_int);

  this.ctx.lineWidth = line_width;
 
  this.ctx.strokeStyle = color_string;
  this.ctx.fillStyle = color_string;
  this.ctx.beginPath();
  this.ctx.moveTo(pixel0.x, pixel0.y);
  this.ctx.lineTo(pixel1.x, pixel1.y);
  this.ctx.stroke();
};

/*
let obj = {
  'points':[
    {'x':0,'y':0},
    {'x':0,'y':0},
    {'x':0,'y':0}
  ]
}
*/
Box.prototype.RESCALE_BASED_ON_CM = function(obj) {

  console.log(obj);

  let cx = 0;
  let cy = 0;
 
  let x_min = +(9**5);
  let x_max = -(9**5);
  let y_min = +(9**5);
  let y_max = -(9**5);

  for (let i = 0; i < obj.points.length; i++) {
    cx += obj.points[i].x;
    cy += obj.points[i].y;
   
    if (obj.points[i].x > x_max) {
      x_max = obj.points[i].x;
    }
    if (obj.points[i].x < x_min) {
      x_min = obj.points[i].x;
    }
    if (obj.points[i].y > y_max) {
      y_max = obj.points[i].y;
    }
    if (obj.points[i].y < y_min) {
      y_min = obj.points[i].y;
    }

  }

  let dx = x_max - x_min;
  let dy = y_max - y_min;

  this.RANGE_X(0, x_max*5/4);
  this.RANGE_Y(0, y_max*5/4);

  return {
    'cx':cx,
    'cy':cy,
    'dx':dx,
    'dy':dy,
    'x_min':x_min,
    'x_max':x_max,
    'y_min':y_min,
    'y_max':y_max
  }

}

/*
let obj = {
  'points':[
    {'x':0,'y':0},
    {'x':0,'y':0},
    {'x':0,'y':0}
  ]
}
*/
Box.prototype.RESCALE_BASED_ON_CENTROID = function(obj) {

  console.log(obj);
  let a = obj.points[0];
  let b = obj.points[1];
  let c = obj.points[2];

  let cx = (a.x + b.x + c.x)/3;
  let cy = (a.y + b.y + c.y)/3;
 
  let ra = ((a.x - cx)**2 + (a.y - cy)**2)**0.5;
  let rb = ((b.x - cx)**2 + (b.y - cy)**2)**0.5;
  let rc = ((c.x - cx)**2 + (c.y - cy)**2)**0.5;

  let r = 0;
  if (ra > rb) {
    r = ra;
  } else {
    r = rb;
  }
  if (rc > r) {
    r = rc;
  }
 
  if (a.x == b.x && b.x == c.x &&  a.y == b.y && b.y == c.y) {
    r = 0.1;
  }
 
  let z = r*3;
  if (z < 0.5) {
    z = 0.5;
  }

 // RESCALE
 this.rangex(cx-z, cx+z);
 this.rangey(cy-z, cy+z);
 
}