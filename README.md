# Maze
it crawls thru the maze

https://dactyrafficle.github.io/Maze/

create all the cells, edges and corners

we only need the corners so we can draw the edges nicely, thats it

each cell has 4 edges

each edge has 2 cells

assign a unique id to every cell

/* Kruskal maze generation algorithm */

initially, every edge is a wall

then, pick an edge at random. if the 2 cells it joins have different ids, then delete the edge (or make it isWall = false) and make every cell that has the same id as those 2 cells have a new id, so now they all have the same id

if they already have the same id, then ignore it !

do this until every cell in the maze has the same id
