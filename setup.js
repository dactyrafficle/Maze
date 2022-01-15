
// a global
let n = 4;
let maze = new Maze(n, n);

maze.CREATE_CELLS();
maze.INITIALIZE();
maze.CREATE_CORNERS();
maze.CREATE_EDGES();

maze.MAKE_WALLS();
maze.GET_CELL_NEIGHBORS();

