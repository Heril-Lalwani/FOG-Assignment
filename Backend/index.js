const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes

// Generate random grid data
const generateRandomGrid = () => {
  const blueTileCount = 15;
  const grid = Array.from({ length: 10 }, () => Array(10).fill(0));

  // Set the first two columns to green
  for (let i = 0; i < 10; i++) {
    grid[i][0] = 1;
    grid[i][1] = 1;
  }

  // Set exactly 15 tiles to be blue
  for (let i = 0; i < blueTileCount; i++) {
    let randomRow, randomCol;
    do {
      // Generate random coordinates
      randomRow = Math.floor(2 + Math.random() * 8);
      randomCol = Math.floor(2 + Math.random() * 8);
    } while (grid[randomRow][randomCol] === 3); // Repeat if the tile is already blue

    // Set the tile to be blue
    grid[randomRow][randomCol] = 3;
  }

  return grid;
};

// Serve the grid data
app.get('/api/grid', (req, res) => {
  const grid = generateRandomGrid();
  res.json({ grid });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
