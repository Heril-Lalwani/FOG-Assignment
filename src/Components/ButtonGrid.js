import React, { useState, useEffect } from "react";

const ButtonGrid = () => {
  const [speed, setSpeed] = useState(250);
  const [showSpeed, setShowSpeed] = useState(1);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  // random blue tile generator
// random blue tile generator
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

  const [grid, setGrid] = useState(generateRandomGrid());
  const [sliderPosition, setSliderPosition] = useState(2);
  const [direction, setDirection] = useState(1);

  const handleButtonClick = (row, col) => {
      if (isRunning && !isInitial) {
      // Flash effect for blue tiles
      let pastslider = sliderPosition;
      let previouscolor = grid[row][col];
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          // Toggle the visibility of the button
        
          const newGrid = [...grid];
          newGrid[row][col] = 0;
          setGrid(newGrid);
          newGrid[row][col] = previouscolor;
          setGrid(newGrid); 


        }, i * 25); // Flash every 300 milliseconds
      }

      if (col === pastslider || col === pastslider + 1) {
        setScore(score - 10);
      } else if (grid[row][col] === 3) {
        setScore(score + 10);
      }

      //   const newGrid = [...grid];
      // Move the blue block to another random location
      //     let randomRow, randomCol;
      //     do {
      //       randomRow = Math.floor(2 + Math.random() * 8);
      //       randomCol = Math.floor(2 + Math.random() * 8);
      //     } while (newGrid[randomRow][randomCol]); // Repeat if the new location is already blue

      //     newGrid[randomRow][randomCol] = true;
      //     newGrid[row][col] = false;

      //     setGrid(newGrid);
    }
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        // Automatically move the slider in the current direction
        const nextPosition = sliderPosition + direction;

        // Change direction when reaching the end
        if (nextPosition === 2 || nextPosition === 8) {
          setDirection(-direction);
        }

        setSliderPosition(nextPosition);
        setIsInitial(false);
      }, speed);
    }

    return () => clearInterval(intervalId);
  }, [sliderPosition, direction, speed, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsInitial(true);
    setSliderPosition(2);
    setGrid(generateRandomGrid());
    setScore(0);
    setDirection(1);
  };

  return (
    <div>
      <div style={{backgroundColor : "black"}}>
      <h1 style={{color:"white"}}>Score {score}</h1>
      {/* Button Grid */}
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((col, colIndex) => (
            <button
              key={colIndex}
              onClick={() => handleButtonClick(rowIndex, colIndex)}
              style={{
                width: "50px",
                height: "50px",
                margin: "2px",
                border: 0 ,
                borderRadius: "15px",
                background:
                  colIndex === 0 || colIndex === 1
                    ? "green"
                    : colIndex === sliderPosition ||
                      colIndex === sliderPosition + 1
                    ? "red"
                    : grid[rowIndex][colIndex]==3
                    ? "blue"
                    : "black",
              }}
            ></button>
          ))}
        </div>
      ))}
      <br />
      <br />
      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>
      <br />
      <br />
      <button
        onClick={() => {
          if (speed !== 250) {
            setSpeed(speed + 50);
            setShowSpeed(showSpeed - 1);
          }
        }}
        // disabled={isRunning}
      >
        Decrease speed
      </button>
      <button
        onClick={() => {
          if (speed !== 50) {
            setSpeed(speed - 50);
            setShowSpeed(showSpeed + 1);
          }
        }}
        // disabled={isRunning}
      >
        Increase speed
      </button>
      <br />
      Current speed: {showSpeed}
    </div>
    </div>
  );
};

export default ButtonGrid;
