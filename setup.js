
// make a maze, like tetris blocks
// place them, until end
// fill in gaps, as tetris

let container;
let ANIMATION;
let FPS;
let maze;
let n_min = 5;
let n_max = 24;
let n;  // number of cells per side

window.onload = function() {

  maze = new Maze();
  
  container = document.getElementById('container');
  container.appendChild(maze.c);
  
  n = n_min;
  fps = 2*n**0.5;
  fps_el.innerHTML = fps.toFixed(3);
  n_el.innerHTML = n.toFixed(3);
  
  maze.INITIALIZE_MAZE(n, n);
  maze.CREATE_CELLS();
  maze.INITIALIZE_CELLS();

  maze.CREATE_CORNERS();
  maze.CREATE_EDGES();

  maze.MAKE_WALLS();
  maze.GET_CELL_NEIGHBORS();
  
  maze.ANALYZE_NEIGHBORS();
  maze.REDRAW();

  START_ANIMATION(n, fps);

} // CLOSING window.onload


function START_ANIMATION(n, fps) {

  ANIMATION = window.setInterval(function() {
   
    if (maze.CURRENT.STATE.END) {
  
      console.log(Math.random());

      maze.INITIALIZE_MAZE(n, n);
      maze.CREATE_CELLS();
      maze.INITIALIZE_CELLS();

      maze.CREATE_CORNERS();
      maze.CREATE_EDGES();

      maze.MAKE_WALLS();
      maze.GET_CELL_NEIGHBORS();
      
      maze.ANALYZE_NEIGHBORS();
      maze.REDRAW();
      
      window.clearInterval(ANIMATION);
      
      console.log('FPS : ' + fps);
      
      n++;
      fps = 2*n**0.5;
      fps_el.innerHTML = fps.toFixed(3);
      n_el.innerHTML = n.toFixed(3);
      
      if (n >= n_max) {
        n = n_min;
      }
      
      START_ANIMATION(n, fps);
      
    } else {

      maze.MOVE_TO_NEW_ACTIVE_CELL();
      
      maze.ANALYZE_NEIGHBORS();
      maze.REDRAW();
    }
    
  }, 1000/fps);  // CLOSING animation
  
}

