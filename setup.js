
// a global
let maze = new Maze(7, 7);

maze.CREATE_CELLS();
maze.CREATE_CORNERS();
maze.CREATE_EDGES();

maze.MAKE_WALLS();
maze.GET_CELL_NEIGHBORS();

