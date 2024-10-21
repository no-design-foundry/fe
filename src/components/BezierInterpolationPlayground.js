import React, { useEffect, useRef, useState } from "react";
import Path from "./bezier/Path";
import {
  controlWrapperRule,
  interpolatePath,
  interpolatePoint,
  svgRule,
  wrapperRule,
} from "./BezierPlayground";
import Point from "./bezier/Point";
import Handle from "./bezier/Handle";
import { useFela } from "react-fela";
import Line from "./bezier/Line";

function BezierInterpolationPlayground({ curveA, curveB }) {
  const isCubic = curveA.length === 4;

  const [time, setTime] = useState(0.5);
  const animatingInterval = useRef(null); // remains useRef
  const animatingDirection = useRef(1); // remains useRef
  const [timeIsAnimating, setTimeIsAnimating] = useState(false);
  const svgRef = useRef(null); // remains useRef
  const [scaleFactor, setScaleFactor] = useState(1); // changed from useRef to useState
  const [bezierPointsA, setBezierPointsA] = useState(curveA); // changed from useRef to useState
  const [bezierPointsB, setBezierPointsB] = useState(curveB); // changed from useRef to useState
  const [bezierPointsInterpolated, setBezierPointsInterpolated] = useState(
    interpolatePath(curveA, curveB)
  ); // changed from useRef to useState
  const [dragging, setDragging] = useState(null); // changed from useRef to useState
  const [render, setRender] = useState(0); // remains useState

  const { css } = useFela();

  function handleMouseDown(path, index) {
    if (path) {
      setDragging({ path, index });
    }
  }

  const handleMouseUp = () => {
    setDragging(null);
  };

  function handleOnResize() {
    const newScaleFactor = 1000 / svgRef.current.getBoundingClientRect().width;
    setScaleFactor(newScaleFactor);
  }

  function handleMouseMove(e) {
    if (dragging !== null) {
      const bezierPoints =
        dragging.path === "A" ? bezierPointsA : bezierPointsB;
      const otherBezierPoints =
        dragging.path === "A" ? bezierPointsB : bezierPointsA;
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
      if (isCubic && (dragging.index === 0 || dragging.index === 3)) {
        const point = newPoints[dragging.index];
        const difference = [x - point[0], y - point[1]];
        newPoints[dragging.index === 0 ? 1 : 2] = [
          newPoints[dragging.index === 0 ? 1 : 2][0] + difference[0],
          newPoints[dragging.index === 0 ? 1 : 2][1] + difference[1],
        ];
      }
      newPoints[dragging.index] = [x, y];
      if (dragging.path === "A") {
        setBezierPointsA(newPoints);
      } else {
        setBezierPointsB(newPoints);
      }
      setBezierPointsInterpolated(
        interpolatePath(bezierPointsA, bezierPointsB)
      );
      setRender((prev) => prev + 1);
    }
  }

  useEffect(() => {
    handleOnResize();
    setRender((prev) => prev + 1);
    window.addEventListener("resize", handleOnResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("resize", handleOnResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, scaleFactor]);

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
    setBezierPointsInterpolated(
      interpolatePath(bezierPointsA, bezierPointsB, time)
    );
    setRender((prev) => prev + 1);
  }, [time, bezierPointsA, bezierPointsB]);

  function drawBezier(bezier, pathKey, stroke) {
    return (
      <>
        <Path path={bezier} isCubic={isCubic} scaleFactor={1} />
        {[bezier[0], bezier[bezier.length - 1]].map((point, index) => (
          <Point
            key={index}
            point={point}
            scaleFactor={scaleFactor}
            onMouseDown={() =>
              handleMouseDown(pathKey, [0, bezier.length - 1][index])
            }
            fill={stroke}
          />
        ))}
        {isCubic ? (
          bezier
            .slice(1, 3)
            .map((point, index) => (
              <Handle
                key={index}
                point={point}
                scaleFactor={scaleFactor}
                onMouseDown={() => handleMouseDown(pathKey, [1, 2][index])}
                fill={stroke}
              />
            ))
        ) : (
          <Handle
            point={bezierPointsA[1]}
            scaleFactor={scaleFactor}
            onMouseDown={() => handleMouseDown(pathKey, 1)}
            fill={stroke}
          />
        )}
        <Line points={bezier.slice(0, 2)} scaleFactor={scaleFactor} stroke={stroke} />
        {isCubic ? (
          <Line points={bezier.slice(2, 4)} scaleFactor={scaleFactor} stroke={stroke} />
        ) : (
          <Line points={bezier.slice(1, 3)} scaleFactor={scaleFactor} stroke={stroke} />

        )}
      </>
    );
  }

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
        className={css(svgRule)}
        ref={svgRef}
        width="1000"
        viewBox="0 0 1000 500"
      >
        {drawBezier(bezierPointsInterpolated, null, "red")}
        <Path path={bezierPointsB} isCubic={isCubic} scaleFactor={1} />
        {bezierPointsA.map((_, index) => (
          <>
            <Line
              key={index}
              points={[bezierPointsA[index], bezierPointsB[index]]}
              isDashed={true}
            />
          </>
        ))}
        <Path
          path={bezierPointsInterpolated}
          isCubic={isCubic}
          scaleFactor={1}
          isHighlighted={true}
        />
        {drawBezier(bezierPointsA, "A")}
        {drawBezier(bezierPointsB, "B")}
      </svg>
    </div>
  );
}

export default BezierInterpolationPlayground;
