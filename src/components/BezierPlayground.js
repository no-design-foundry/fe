import React, { useState, useEffect, useRef } from "react";
import { useFela } from "react-fela";

const svgRule = () => ({
  background: "silver",
  width: "100%",
})

const wrapperRule = () => ({
  display: "flex",
  flexDirection: "column",
  spaceY: 10
})

function interpolate(a, b, t = 0.5) {
  return a + (b - a) * t;
}

function interpolatePoint(a, b, t = 0.5) {
  return [interpolate(a[0], b[0], t), interpolate(a[1], b[1], t)];
}

function diagonalLine(point, direction, angle) {
  const offsetAngle = angle + (Math.PI / 4);
  return (
    <line
      x1={point[0] - 20 * Math.cos(offsetAngle) * direction}
      x2={point[0] + 20 * Math.cos(offsetAngle) * direction}
      y1={point[1] - 20 * Math.sin(offsetAngle) * direction}
      y2={point[1] + 20 * Math.sin(offsetAngle) * direction}
      strokeWidth="2"
      stroke="red"
    />
  );
}

// Function to generate the next order of Bezier control points
function doOneOrder(bezier, time) {
  let nextOrderBezier = [];
  for (let i = 0; i < bezier.length - 1; i++) {
    nextOrderBezier.push(interpolatePoint(bezier[i], bezier[i + 1], time));
  }
  return nextOrderBezier;
}

function BezierPlayground(){
  return 1
  const [time, setTime] = useState(0.5);
  const animatingInterval = useRef(null);
  const animatingDirection = useRef(1);
  const [timeIsAnimating, setTimeIsAnimating] = useState(false);
  const svgRef = useRef(null);
  const [bezierPoints, setBezierPoints] = useState([
    [50, 450],
    [200, 50],
    [800-300, 50],
    [950-300, 450],
  ]);
  const [dragging, setDragging] = useState(null);
  const [mathLines, setMathLines] = useState([]);
  const [lastOrderPoint, setLastOrderPoint] = useState(null);
  const [lastOrderPointAngle, setLastOrderPointAngle] = useState(null);
  
  const {css} = useFela()

  const handleMouseDown = (index) => {
    setDragging(index);
  };

  const handleMouseMove = (e) => {
    if (dragging !== null) {
      const newPoints = [...bezierPoints];
      const rect = svgRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      if (y < 0) y = 0;
      if (y > rect.height) y = rect.height;
      if (dragging === 0 || dragging === 3) {
        const point = newPoints[dragging];
        const difference = [
          x - point[0],
          y - point[1],
        ]
        newPoints[dragging === 0 ? 1 : 2] = [
          newPoints[dragging === 0 ? 1 : 2][0] + difference[0],
          newPoints[dragging === 0 ? 1 : 2][1] + difference[1],
        ];        
      }
      newPoints[dragging] = [x, y];
      setBezierPoints(newPoints);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (timeIsAnimating) {
      animatingInterval.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime >= 1) {
            animatingDirection.current = -1;
          } else if (prevTime <= 0) {
            animatingDirection.current = 1;
          }
          return prevTime + 0.008 * animatingDirection.current;
        });
      }, 1000 / 60);
    } else {
      clearInterval(animatingInterval.current);
      animatingInterval.current = null;
    }
    return () => clearInterval(animatingInterval.current);
  }, [timeIsAnimating]);

  useEffect(() => {
    let collector = [];
    let currentBezier = [...bezierPoints];
    while (currentBezier.length > 1) {
      currentBezier = doOneOrder(currentBezier, time);
      for (let i = 0; i < currentBezier.length - 1; i++) {
        collector.push([currentBezier[i], currentBezier[i + 1]]);
      }
      if (currentBezier.length === 2) {
        const angle = Math.atan2(
          currentBezier[1][1] - currentBezier[0][1],
          currentBezier[1][0] - currentBezier[0][0]
        );
        setLastOrderPointAngle(angle);
      }
      if (currentBezier.length === 1) {
        setLastOrderPoint(currentBezier[0]);
      }
    }
    setMathLines(collector);
  }, [time, bezierPoints]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div className={css(wrapperRule)}>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={time}
        onChange={(e) => setTime(parseFloat(e.target.value))}
      />
      <button onClick={() => setTimeIsAnimating(!timeIsAnimating)}>Animate</button>
      <svg
        ref={svgRef}
        width="1000"
        height="500"
        class={css(svgRule)}
      >
        <path
          d={`M${bezierPoints[0][0]},${bezierPoints[0][1]} C${bezierPoints[1][0]},${bezierPoints[1][1]} ${bezierPoints[2][0]},${bezierPoints[2][1]} ${bezierPoints[3][0]},${bezierPoints[3][1]}`}
          stroke="black"
          fill="transparent"
          strokeWidth="2"
        />
        <line
          x1={bezierPoints[0][0]}
          y1={bezierPoints[0][1]}
          x2={bezierPoints[1][0]}
          y2={bezierPoints[1][1]}
          stroke="black"
        />
        <line
          x1={bezierPoints[2][0]}
          y1={bezierPoints[2][1]}
          x2={bezierPoints[3][0]}
          y2={bezierPoints[3][1]}
          stroke="black"
        />
        {mathLines.map((line, index) => (
          <line
            key={index}
            x1={line[0][0]}
            y1={line[0][1]}
            x2={line[1][0]}
            y2={line[1][1]}
            strokeDasharray="5 10"
            stroke="black"
          />
        ))}
        {bezierPoints.slice(1, 3).map((point, index) => (
          <circle
            key={index}
            cx={point[0]}
            cy={point[1]}
            r={8}
            fill="black"
            onMouseDown={() => handleMouseDown([1, 2][index])}
          />
        ))}
        {[bezierPoints[0], bezierPoints[bezierPoints.length - 1]].map(
          (point, index) => (
            <rect
              key={index}
              x={point[0] - 10}
              y={point[1] - 10}
              width={20}
              height={20}
              fill="black"
              onMouseDown={() => handleMouseDown([0, 3][index])}
            />
          )
        )}

        {lastOrderPoint && (
          <>
            {diagonalLine(lastOrderPoint, +1, lastOrderPointAngle)}
            {diagonalLine(lastOrderPoint, -1, lastOrderPointAngle + Math.PI/2)}
          </>
          // <circle cx={lastOrderPoint[0]} cy={lastOrderPoint[1]} r={10} fill="none" strokeWidth="3" stroke="black" />
        )}
      </svg>
    </div>
  );
};

export default BezierPlayground;
