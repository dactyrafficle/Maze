
// starts with a point
function Edge(obj) {
 
  // make the main bit the cx cy
  this.cx = obj.cx;
  this.cy = obj.cy;

  this.val = {
    'x':obj.cx,
    'y':obj.cy
  }
  
  this.corners = obj.corners;
  this.isWall = false;
}


Edge.prototype.WALLIFY = function() {
  this.isWall = true;
}

/*
Edge.prototype.DEWALLIFY = function() {
  this.isWall = false;
  this.color_string = '#9999';
  this.line_width = 1;
}
Edge.prototype.HIGHLIGHT = function() {
  if (this.isWall) {
    this.color_string = '#3d3f';
    this.line_width = 5;
  } else {
    this.color_string = '#9999';
    this.line_width = 2;
  }
}
Edge.prototype.DEHIGHLIGHT = function() {
  if (this.isWall) {
    this.color_string = '#3d3a';
    this.line_width = 4;
  } else {
    this.color_string = '#9999';
    this.line_width = 1;
  }
}
*/