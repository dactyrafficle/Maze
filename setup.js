
// a global
let n = 24;
let maze = new Maze();

maze.INITIALIZE_MAZE(n, n);
maze.CREATE_CELLS();
maze.INITIALIZE_CELLS();

maze.CREATE_CORNERS();
maze.CREATE_EDGES();

maze.MAKE_WALLS();
maze.GET_CELL_NEIGHBORS();

