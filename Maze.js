
function Maze(n_rows, n_cols) {

  this.n_rows = n_rows;
  this.n_cols = n_cols;
 
  this.cells = {};
  this.corners = {};
  this.edges = {};
 
  this.n_cells = this.n_rows * this.n_cols;
  this.n_corners = (this.n_rows + 1) * (this.n_cols + 1);
  this.n_edges = (this.n_cols + 1) * this.n_rows + this.n_cols * (this.n_rows + 1)

  // VERIFICATION
  this.n_cells2 = null;   // this.n_rows * this.n_cols
  this.n_corners2 = null; // (this.n_rows + 1) * (this.n_cols + 1);
  this.n_edges2 = null;   // (this.n_cols + 1) * this.n_rows + this.n_cols * (this.n_rows + 1)
 
  this.PREVIOUS = null;
  this.CURRENT = null;
  this.NEXT = null;

  // THE ANIMATION
  this.b = new Box();
  this.b.CANVAS_SIZE(500, 500);                      // THIS IS THE NO OF PIXELS
  this.b.RANGE_X(-100, (this.n_cols + 1)*100);       // SET THE RANGE IN X
  this.b.RANGE_Y(-100, (this.n_rows + 1)*100);       // SET THE RANGE IN Y
  this.c = this.b.returnCanvas();

  this.ANIMATION = {};
  this.ANIMATION.FRAME_COUNT = 0;
  

  
  
}

Maze.prototype.INITIALIZE_INFOBOX = function() {

  this.INFOBOX = {};
  this.INFOBOX.table = document.createElement('table');
  this.INFOBOX.table.classList.add('mytables');
  
  for (let y = 0; y < 3; y++) {
    
    this.INFOBOX.table['r' + y] = document.createElement('tr');
    this.INFOBOX.table.appendChild(this.INFOBOX.table['r' + y]);
    
    for (let x = 0; x < 3; x++) {
      
      this.INFOBOX.table['r' + y]['c' + x] = document.createElement('td');
      this.INFOBOX.table['r' + y].appendChild(this.INFOBOX.table['r' + y]['c' + x]);
      
    }
  }
  
  this.INFOBOX.PROSPECTIVE_NORTH = this.INFOBOX.table.r0.c1;
  this.INFOBOX.PROSPECTIVE_EAST = this.INFOBOX.table.r1.c2;
  this.INFOBOX.PROSPECTIVE_SOUTH = this.INFOBOX.table.r2.c1;
  this.INFOBOX.PROSPECTIVE_WEST = this.INFOBOX.table.r1.c0;
  this.INFOBOX.ACTIVE_CELL = this.INFOBOX.table.r1.c1;
  
  this.INFOBOX.PROSPECTIVE_NORTH.innerHTML = 'n';
  this.INFOBOX.PROSPECTIVE_EAST.innerHTML = 'e';
  this.INFOBOX.PROSPECTIVE_SOUTH.innerHTML = 's';
  this.INFOBOX.PROSPECTIVE_WEST.innerHTML = 'w';
  this.INFOBOX.ACTIVE_CELL.innerHTML = 'x';

  return this.INFOBOX.table;
}

Maze.prototype.REDRAW = function() {
  this.b.CLEAR_CANVAS();
 
  // DRAW THE CELLS
  Object.keys(this.cells).forEach(function(a) {

    let cell = this.cells[a];
    this.b.ctx.fillStyle = '#fc0a';
    

    
    if (cell.STATE.IS_NEXT_ACTIVE) {
      // this.b.ctx.fillStyle = '#b3e0ff';
    }
    
    
    if (cell.STATE.VISITED) {
      this.b.ctx.fillStyle = '#b3e0ff';
    }
    
    if (cell.STATE.DEAD) {
      this.b.ctx.fillStyle = '#dddd';
    }
    
    if (cell.STATE.ACTIVE) {
      this.b.ctx.fillStyle = '#7094db';
    }
    
    this.b.POINT(cell);
    
  }.bind(this));


  // DRAW THE EDGES
  Object.keys(this.edges).forEach(function(a) {

    let edge = maze.edges[a];
    this.b.ctx.fillStyle = '#acea';
    this.b.ctx.strokeStyle = '#acea';
    this.b.ctx.lineWidth = 1;
    
    if (edge.isWall) {

      this.b.ctx.strokeStyle = '#3c3c';
      this.b.ctx.lineWidth = 4;
    } else {

      // this.b.POINT(edge);
    }

    this.b.CONNECT_POINTS({
      'vals':[edge.corners[0].val, edge.corners[1].val]
    });

  }.bind(this));

}

// CREATE CELLS : @mxn, n_cells = m*n
Maze.prototype.CREATE_CELLS = function() {

  for (let y = 50; y < this.n_rows*100; y += 100) {  
    for (let x = 50; x < this.n_cols*100; x += 100) {
 
      this.cells[y + '-' + x] = {};
      this.cells[y + '-' + x] = new Cell({
       
        'cx':x,
        'cy':y,
        'STATE':{
          'ACTIVE':false, // ACTIVE,
          'IS_NEXT_ACTIVE':false, // 
          'DEAD':false, // DEAD,
          'VISITED':false, // VISITED,
          'END':false // END
        }
      });
     
      this.n_cells2++;
    }
  }
 
  // initialize
  this.CURRENT = this.cells['50-50'];
  this.CURRENT.ACTIVATE();
 
  // last cell
  let row = this.n_rows*100-50;
  let col = this.n_cols*100-50;
  this.cells[row + '-' + col].STATE.END = true;

}

// CREATE CORNERS : @mxn, n_cells = (m+1)*(n+1)
Maze.prototype.CREATE_CORNERS = function() {

  for (let y = 0; y < (this.n_rows + 1)*100; y += 100) {  
    for (let x = 0; x < (this.n_cols + 1)*100; x += 100) {
     
      this.corners[y + '-' + x] = {};
      this.corners[y + '-' + x] = new Corner({
       
        'cx':x,
        'cy':y,
        'color_string':'#fcfa'
      });
   
      this.n_corners2++;
    }
  }
}

// CREATE EDGES : @mxn, n_edges = (n+1)*m + n*(m+1)
Maze.prototype.CREATE_EDGES = function() {

  let shift;
  for (let y = 0; y < (this.n_rows + 0.5)*100; y += 50) {  
   
    if ((y % 100) === 0) {
      shift = 50;
      for (let x = shift; x < (this.n_cols + 0.5)*100; x += 100) {
        this.edges[y + '-' + x] = {};
        this.edges[y + '-' + x] = new Edge({
          'cx':x,
          'cy':y,
          'corners':[this.corners[y + '-' + (x-50)], this.corners[y + '-' + (x+50)]]
        });
       
        this.n_edges2++;
      }    
    } else {
      shift = 0;
      for (let x = shift; x < (this.n_cols + 0.5)*100; x += 100) {
        this.edges[y + '-' + x] = {};
        this.edges[y + '-' + x] = new Edge({
          'cx':x,
          'cy':y,
          'corners':[this.corners[(y-50) + '-' + x], this.corners[(y+50) + '-' + x]]
        });
       
        this.n_edges2++;
      }
    }
  }
}
Maze.prototype.MAKE_WALLS = function() {
  this.edges['100-50'].WALLIFY();
  this.edges['100-150'].WALLIFY();
  this.edges['50-300'].WALLIFY();
  
  this.edges['200-50'].WALLIFY();
  this.edges['150-300'].WALLIFY();
  this.edges['200-250'].WALLIFY();
  
  this.edges['300-50'].WALLIFY();
  this.edges['300-150'].WALLIFY();
  this.edges['300-250'].WALLIFY();

  this.edges['400-150'].WALLIFY();
  this.edges['400-250'].WALLIFY();
  
  this.edges['500-50'].WALLIFY();
  this.edges['650-100'].WALLIFY();
  
  this.edges['550-200'].WALLIFY();
  
  this.edges['650-300'].WALLIFY();
  this.edges['550-300'].WALLIFY();
  this.edges['450-300'].WALLIFY();
  
  this.edges['250-400'].WALLIFY();
  this.edges['350-400'].WALLIFY();
  this.edges['400-350'].WALLIFY();
}

Maze.prototype.GET_CELL_NEIGHBORS = function() {
 
  Object.keys(maze.cells).forEach(function(a) {  
    let cell = maze.cells[a];

    // ca marche : the neighbor cells
    cell.NEIGHBORS.NORTH.cell = (this.cells[(cell.cy + 100) + '-' + (cell.cx + 0)] || null);
    cell.NEIGHBORS.EAST.cell  = (this.cells[(cell.cy + 0) + '-' + (cell.cx + 100)] || null);
    cell.NEIGHBORS.SOUTH.cell = (this.cells[(cell.cy - 100) + '-' + (cell.cx - 0)] || null);
    cell.NEIGHBORS.WEST.cell  = (this.cells[(cell.cy + 0) + '-' + (cell.cx - 100)] || null);
    
    if (cell.NEIGHBORS.NORTH.cell !== null) {cell.NEIGHBORS.NORTH.isCell = true;}
    if (cell.NEIGHBORS.EAST.cell !== null) {cell.NEIGHBORS.EAST.isCell = true;}
    if (cell.NEIGHBORS.SOUTH.cell !== null) {cell.NEIGHBORS.SOUTH.isCell = true;}
    if (cell.NEIGHBORS.WEST.cell !== null) {cell.NEIGHBORS.WEST.isCell = true;}

    // now the edges : there are necessarily 4 of them. you fucking idiot.
    cell.NEIGHBORS.NORTH.edge = this.edges[(cell.cy + 50) + '-' + (cell.cx + 0)];
    cell.NEIGHBORS.EAST.edge  = this.edges[(cell.cy + 0) + '-' + (cell.cx + 50)];
    cell.NEIGHBORS.SOUTH.edge = this.edges[(cell.cy - 50) + '-' + (cell.cx - 0)];
    cell.NEIGHBORS.WEST.edge  = this.edges[(cell.cy + 0) + '-' + (cell.cx - 50)];

    if (cell.NEIGHBORS.NORTH.edge.isWall) {cell.NEIGHBORS.NORTH.isWall = true;}
    if (cell.NEIGHBORS.EAST.edge.isWall) {cell.NEIGHBORS.EAST.isWall = true;}
    if (cell.NEIGHBORS.SOUTH.edge.isWall) {cell.NEIGHBORS.SOUTH.isWall = true;}
    if (cell.NEIGHBORS.WEST.edge.isWall) {cell.NEIGHBORS.WEST.isWall = true;}

  }.bind(this));
}  


Maze.prototype.ANALYZE_NEIGHBORS = function() {

  if (this.CURRENT.STATE.END) {
    return;
  }
  
  // THE OPTIONS
  let arr = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
  
  // IF THERE ARE 0 OR 1 MOVES REMAINING, THE CELL DIES
  this.n_possible_moves = 0;
  this.possible_moves = [];
  
  console.log('.........................');
  console.log('FRAME COUNT : ' + this.ANIMATION.FRAME_COUNT);

  // PART ONE : SEE WHAT CELLS ARE PHYSICALLY POSSIBLE (NO WALLS)

  // FOR LOOP > ARR.FOREACH IN THIS CASE FOR THE EXIT CONDITIONS
  for (let i = 0; i < arr.length; i++) {
    
    let obj = this.CURRENT.NEIGHBORS[arr[i]];
    let cell = obj.cell;
    
    // IS IT A CELL ?
    if (!obj.isCell) {
      continue;
    }
    
    // CHECK FOR A WALL
    if (obj.isWall) {  
      continue;
    }
    
    // IS IT A DEAD END ?
    if (cell.STATE.DEAD) {
      continue;
    }

    // IF WE GET HERE, THE OBJ IS A CELL, WITH NO WALL, AND NOT A DEAD END
    this.n_possible_moves++;
    this.possible_moves.push(cell);

  }; // CLOSING FOR LOOP FOR CELL
  

  console.log(' > POSSIBLE MOVES : ' + this.n_possible_moves);

  
  // now we know how many possible moves there are, we can start making some decisions
  
  // console.log(this.possible_moves);
  if (this.n_possible_moves === 0) {
    console.log('NOWHERE TO GO!');
  }
    
  // IF ONLY 1 POSSIBLE MOVE, C'EST CLAIR
  if (this.n_possible_moves === 1) {

    this.possible_moves[0].STATE.NEXT = true;
    this.NEXT = this.possible_moves[0];
    
    this.CURRENT.STATE.DEAD = true; // actually means the current CURRENT is now dead
  } // CLOSING 1 POSSIBLE MOVE
  

  // IF THERE ARE 2 POSSIBLE MOVES, WE MUST DECIDE
  
  if (this.n_possible_moves === 2) {
  
    let cell0 = this.possible_moves[0];
    let cell1 = this.possible_moves[1];
  
    // 2.0 : BOTH UNVISITED : CHOOSE BY RPOS (N-E-S-W)
    // 2.1 : VISITED UNVISITED : PICK UNVISITED
    // 2.2 : BOTH VISITED : KILL CURRENT AND RETURN THE WAY WE CAME !
    
    // 2.0 : BOTH UNVISITED
    if (!cell0.STATE.VISITED && !cell1.STATE.VISITED) {
      
      cell0.STATE.NEXT = true;
      this.NEXT = cell0;
    }
    
    // 2.1 : VISITED UNVISITED
    if (cell0.STATE.VISITED && !cell1.STATE.VISITED) {
      cell1.STATE.NEXT = true;
      this.NEXT = cell1;
    } else {
      cell0.STATE.NEXT = true;
      this.NEXT = cell0;
    }

    // 2.2 : BOTH VISITED : KILL CURRENT AND RETURN THE WAY WE CAME !
    if (cell0.STATE.VISITED && cell1.STATE.VISITED) {
      this.CURRENT.STATE.DEAD = true;
      this.NEXT = this.PREVIOUS;  
    }
    
  } // CLOSING 2 POSSIBLE MOVES
  
  
  if (this.n_possible_moves === 3) {
    
    // 3.0 : all 3 are free
    // 3.1 : 2 are free, 1 is not
    // 3.2 : 1 is free, 2 are not 
    // 3.3 : 0 are free, 3 are not
    
    this.possible_moves[0].STATE.NEXT = true;
    this.NEXT = this.possible_moves[0];
  }
  
}



Maze.prototype.SHOW_ANALYSIS = function() {
  
  let arr = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
  
  for (let i = 0; i < arr.length; i++) {
    
    this.INFOBOX['PROSPECTIVE_' + arr[i]].innerHTML = '';

    let obj = this.CURRENT.NEIGHBORS[arr[i]];
    let cell = obj.cell;

    let div = document.createElement('div');
    div.style.textAlign = 'left';
    div.style.padding = '1vh';
    
    div.innerHTML += '<div>...............................</div>';
    div.innerHTML += '<div> APOS : ' + 'x' + '</div>';
    // div.innerHTML += '<div> RPOS : ' + i + '</div>';

    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px 4px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'RPOS : ' + i;
      div.appendChild(x)
    })();

    // IS CELL
    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px 4px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'CELL : ' + obj.isCell;
      if (!obj.isCell) {
        x.style.border = '1px solid #333';
      }
      div.appendChild(x)
    })();
    
    if (!obj.isCell) {
      div.style.backgroundColor = '#dddd';
      this.INFOBOX['PROSPECTIVE_' + arr[i]].appendChild(div);
      continue;
    }
    
    // IS WALL
    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px 4px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'WALL : ' + obj.isWall;
      if (obj.isWall) {
        x.style.border = '1px solid #333';
      }
      div.appendChild(x)
    })();
    
    if (obj.isWall) {
      div.style.backgroundColor = '#dddd';
      this.INFOBOX['PROSPECTIVE_' + arr[i]].appendChild(div);
      continue;
    }
    
    // DEAD END
    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px 4px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'DEAD END: ' + cell.STATE.DEAD;
      if (cell.STATE.DEAD) {
        x.style.border = '1px solid #333';
      }
      div.appendChild(x)
    })();
    
    // div.innerHTML += '<div> DEAD : ' + cell.isDead + '</div>';
    
    // VISITED
    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px 4px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'VISITED : ' + cell.STATE.VISITED;
      if (cell.STATE.VISITED) {
        // x.style.border = '1px solid #333';
      }
      div.appendChild(x)
    })();

    // IS NEXT
    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px 4px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'NEXT : ' + cell.STATE.NEXT;
      if (cell.STATE.NEXT) {
        x.style.border = '2px solid #3c3c';
      }
      div.appendChild(x)
    })();
    
    // IS PREVIOUS
    (function() {
      let x = document.createElement('div');
      x.style.padding = '2px';
      x.style.margin = '1px';
      x.style.border = '1px solid transparent';
      x.innerHTML = 'PREVIOUS : ' + cell.STATE.PREVIOUS;
      if (cell.STATE.PREVIOUS) {
        // x.style.border = '2px solid #3c3c';
      }
      div.appendChild(x)
    })();
    
    // if its not a cell, dont go any further
    if (!obj.isCell || obj.isWall || cell.STATE.DEAD) {
      div.style.backgroundColor = '#dddd';
    } 
    
    if (cell.STATE.NEXT) {
      div.style.backgroundColor = '#3c35';
    } 
    
    
    this.INFOBOX['PROSPECTIVE_' + arr[i]].appendChild(div);
  }
}


Maze.prototype.DETERMINE_NEXT_ACTIVE_CELL = function() {
  
  if (this.CURRENT.STATE.END) {
    return;
  }

}

Maze.prototype.MOVE_TO_NEW_ACTIVE_CELL = function() {

  if (this.CURRENT.STATE.END) {
    return;
  }
  this.ANIMATION.FRAME_COUNT++;

  // current -> previous
  // next -> current
  
  // current -> previous
  
  // THE OLD PREVIOUS IS NO LONGER PREVIOUS; NOW WE CAN FORGET ABOUT IT
  if (this.PREVIOUS === null) {
    
  } else {
    this.PREVIOUS.STATE.PREVIOUS = false;
  }
  
  // REPLACE THE PREVIOUS WITH THE CURRENT
  this.PREVIOUS = this.CURRENT;
  this.PREVIOUS.STATE.PREVIOUS = true;

  // IF THERE IS A PREVIOUS_ACTIVE_CELL, REMOVE THE PREVIOUS TAG

  this.CURRENT.DEACTIVATE();
  this.CURRENT = this.NEXT;

  this.CURRENT.ACTIVATE();

}
