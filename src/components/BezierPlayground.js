import React, { useState, useEffect, useRef } from "react";
import { useFela } from "react-fela";
import Path from "./bezier/Path";
import Line from "./bezier/Line";
import Cross from "./bezier/Cross";
import Point from "./bezier/Point";
import Handle from "./bezier/Handle";
import { useLockBodyScroll } from "react-use";

export const svgRule = () => ({
  width: "100%",
  overflow: "visible",
});

export const wrapperRule = () => ({
  display: "flex",
  flexDirection: "column",
  spaceY: 10,
  background: "silver",
  borderRadius: 10,
  marginVertical: 10,
});

export const controlWrapperRule = () => ({
  position: "sticky",
  top: 45,
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 10,
  padding: 10
});

export function interpolate(a, b, t = 0.5) {
  return a + (b - a) * t;
}

export function interpolatePoint(a, b, t = 0.5) {
  return [interpolate(a[0], b[0], t), interpolate(a[1], b[1], t)];
}

export function interpolatePath(pathA, pathB, t = 0.5) {
  return pathA.map((point, index) => interpolatePoint(point, pathB[index], t));
}

// Function to generate the next order of Bezier control points
function doOneOrder(bezier, time) {
  let nextOrderBezier = [];
  for (let i = 0; i < bezier.length - 1; i++) {
    nextOrderBezier.push(interpolatePoint(bezier[i], bezier[i + 1], time));
  }
  return nextOrderBezier;
}

function BezierPlayground({ curve }) {
  const isCubic = curve.length === 4;
  const [time, setTime] = useState(0.5);
  const animatingInterval = useRef(null);
  const animatingDirection = useRef(1);
  const [timeIsAnimating, setTimeIsAnimating] = useState(false);
  const svgRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [bezierPoints, setBezierPoints] = useState(curve);
  const [dragging, setDragging] = useState(null);
  const [mathLines, setMathLines] = useState([]);
  const [lastOrderPoint, setLastOrderPoint] = useState(null);
  const [lastOrderPointAngle, setLastOrderPointAngle] = useState(null);

  const { css } = useFela();
  
  useLockBodyScroll(dragging != null)

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
      x = x * scaleFactor;
      y = y * scaleFactor;
      if (isCubic && (dragging === 0 || dragging === 3)) {
        const point = newPoints[dragging];
        const difference = [x - point[0], y - point[1]];
        newPoints[dragging === 0 ? 1 : 2] = [
          newPoints[dragging === 0 ? 1 : 2][0] + difference[0],
          newPoints[dragging === 0 ? 1 : 2][1] + difference[1],
        ];
      }
      newPoints[dragging] = [x, y];
      setBezierPoints(newPoints);
    }
  };

  useLockBodyScroll(!!dragging);
  
  const handleTouchMove = (e) => {
    handleMouseMove(e.touches[0])
  }
  
  const handleTouchEnd = () => {
    setDragging(null);
  }

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
      }, 1000 / 30);
    } else {
      clearInterval(animatingInterval.current);
      animatingInterval.current = null;
    }
    return () => clearInterval(animatingInterval.current);
  }, [timeIsAnimating]);

  useEffect(() => {
    let collector = [];
    let currentBezier = [...bezierPoints];
    if (isCubic) {
      collector.push([currentBezier[1], currentBezier[2]]);
    }
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

  function handleOnResize() {
    setScaleFactor(1000 / svgRef.current.getBoundingClientRect().width);
  }

  useEffect(() => {
    handleOnResize();
    window.addEventListener("resize", handleOnResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("resize", handleOnResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  });

  return (
    <div className={css(wrapperRule)}>
      <div className={css(controlWrapperRule)}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={time}
          onChange={(e) => setTime(parseFloat(e.target.value))}
        />
        <button onClick={() => setTimeIsAnimating(!timeIsAnimating)}>
          Animate
        </button>
      </div>
      <svg
        ref={svgRef}
        width="1000"
        className={css(svgRule)}
        viewBox="0 0 1000 500"
      >
        <Path path={bezierPoints} isCubic={isCubic} scaleFactor={scaleFactor} />
        <Line points={bezierPoints.slice(0, 2)} scaleFactor={scaleFactor} />
        {isCubic ? (
          <Line points={bezierPoints.slice(2, 4)} scaleFactor={scaleFactor} />
        ) : (
          <Line points={bezierPoints.slice(1, 3)} scaleFactor={scaleFactor} />
        )}
        {mathLines.map((line, index) => (
          <Line points={line} scaleFactor={scaleFactor} isDashed={true} />
        ))}
        {[bezierPoints[0], bezierPoints[bezierPoints.length - 1]].map(
          (point, index) => (
            <Point
              key={index}
              point={point}
              scaleFactor={scaleFactor}
              onMouseDown={() =>
                handleMouseDown([0, bezierPoints.length - 1][index])
              }
              onTouchEnd={handleTouchEnd}
            />
          )
        )}
        {isCubic ? (
          bezierPoints
            .slice(1, 3)
            .map((point, index) => (
              <Handle
                key={index}
                point={point}
                scaleFactor={scaleFactor}
                onMouseDown={() => handleMouseDown([1, 2][index])}
                onTouchEnd={handleTouchEnd}
              />
            ))
        ) : (
          <Handle
            point={bezierPoints[1]}
            scaleFactor={scaleFactor}
            onMouseDown={() => handleMouseDown(1)}
            onTouchEnd={handleTouchEnd}
          />
        )}

        {lastOrderPoint && (
          <Cross
            point={lastOrderPoint}
            angle={lastOrderPointAngle}
            scaleFactor={scaleFactor}
          />
        )}
      </svg>
    </div>
  );
}

export default BezierPlayground;
