import React, { useState, useEffect, useRef } from "react";

const ButtonGrid = () => {
  const [speed, setSpeed] = useState(250);
  const [showSpeed, setShowSpeed] = useState(1);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [grid, setGrid] = useState([]);
  const [sliderPosition, setSliderPosition] = useState(2);
  const [direction, setDirection] = useState(1);
  const [remainingTime, setRemainingTime] = useState(15);

  // Fetching data from the backend
  const fetchGridData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/grid');
      const data = await response.json();
      if (Array.isArray(data.grid)) {
        setGrid(data.grid);
      } else {
        console.error('Invalid grid data:', data.grid);
      }
      
    } catch (error) {
      console.error('Error fetching grid data:', error);
    }
  };

  useEffect(() => {
    // Fetch initial grid data
    fetchGridData();
  }, []);

  // Handle click for blinking and score
  const handleButtonClick = (row, col) => {
    if (isRunning && !isInitial) {
      let pastslider = sliderPosition;
      
      if (grid[row][col] !== 0 || grid[row][col] !== 1) {
        if (col === pastslider || col === pastslider + 1) {
          setScore(score - 10);
        } else if (grid[row][col] === 3) {
          setScore(score + 10);
          
          const newGrid = [...grid];
          let randomRow, randomCol;
          do {
            randomRow = Math.floor(2 + Math.random() * 8);
            randomCol = Math.floor(2 + Math.random() * 8);
          } while (newGrid[randomRow][randomCol]); // Repeat if the new location is already blue
    
          newGrid[randomRow][randomCol] = 3;
          newGrid[row][col] = 0;
    
          setGrid(newGrid);
        }
      }
    }
  };
  
  // let timeratio = 1000 / speed;
  const [timeratio,settimeratio] =useState(1000/speed);

  // This is used to control the red slider movement
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

        // Move timeratio inside the interval function
        // timeratio = timeratio - 1;
        settimeratio(timeratio-1);

        if (timeratio === 0) {
          setRemainingTime((prevTime) => prevTime - 1);
          settimeratio(1000/speed);
        }
      }, speed);
    }

    return () => clearInterval(intervalId);
  }, [sliderPosition, direction, speed, isRunning]);

  // When we start the game
  const handleStart = () => {
    setIsRunning(true);
    setScore(0);
  };

  // When we stop the game
  const handleStop = async () => {
    setIsRunning(false);
    setIsInitial(true);
    setSliderPosition(2);
    setRemainingTime(15);
    try {
      await fetchGridData();
      setDirection(1);
    } catch (error) {
      console.error('Error fetching grid data:', error);
    }
  };

  useEffect(() => {
    // Handle game over when time runs out
    if (remainingTime === 0) {
      alert("game Over")
      handleStop();
    }
  }, [remainingTime]);
  
   return (
    <div className="container">
      <div style={{ backgroundColor: "black" }}>
        <h1 style={{ color: "white" }}>Score {score}</h1>
        <p style={{color:"white"}}>Time Remaining: {remainingTime}</p>
        {/* Button Grid */}
        <div></div>
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
                  border: 0,
                  borderRadius: "15px",
                  background:
                    colIndex === 0 || colIndex === 1
                      ? "green"
                      : colIndex === sliderPosition ||
                        colIndex === sliderPosition + 1
                      ? "red"
                      : grid[rowIndex][colIndex] == 3
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
          disabled={isRunning}
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
          disabled={isRunning}
        >
          Increase speed
        </button>
        <br />
       <p style={{color:"white"}}> Current speed: {showSpeed}</p> 
      </div>
    </div>
  );
};

export default ButtonGrid;
