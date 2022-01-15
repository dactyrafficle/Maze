
// IDK
function Cell(obj) {

  this.id = obj.id;
  this.linked = false;

  this.cx = obj.cx;
  this.cy = obj.cy;

  this.val = {
    'x':obj.cx,
    'y':obj.cy
  }

  this.STATE = {
    'ACTIVE':obj.STATE.ACTIVE,
    'NEXT':false,
    'PREVIOUS':false,
    'DEAD':obj.STATE.DEAD,
    'VISITED':obj.STATE.VISITED,
    'END':obj.STATE.END
  }

  this.NEIGHBORS = {
    'NORTH':{
      'isCell':false,
      'isWall':false,
      'cell':null,
      'edge':null
    },
    'EAST':{
      'isCell':false,
      'isWall':false,
      'cell':null,
      'edge':null
    },
    'SOUTH':{
      'isCell':false,
      'isWall':false,
      'cell':null,
      'edge':null
    },
    'WEST':{
      'isCell':false,
      'isWall':false,
      'cell':null,
      'edge':null
    }
  };
}

Cell.prototype.ACTIVATE = function() {
  this.STATE.ACTIVE = true;
  this.STATE.NEXT = false;
  this.STATE.VISITED = true; 
}
Cell.prototype.DEACTIVATE = function() {
  this.STATE.ACTIVE = false;
  this.STATE.NEXT = false;
}

/*
Cell.prototype.DEADENDIFY = function() {
  this.DEAD_END = true;
  this.color_string = '#ddd';
}

*/
