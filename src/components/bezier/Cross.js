import React from "react";

function DiagonalLine({ point, distance, angle, strokeWidth }) {
  const offsetAngle = angle + Math.PI / 4;
  return (
    <line
      x1={point[0] - 20 * Math.cos(offsetAngle) * distance}
      x2={point[0] + 20 * Math.cos(offsetAngle) * distance}
      y1={point[1] - 20 * Math.sin(offsetAngle) * distance}
      y2={point[1] + 20 * Math.sin(offsetAngle) * distance}
      strokeWidth={strokeWidth || 2}
      stroke="red"
    />
  );
}

function Cross({ point, angle, scaleFactor }) {
  return (
    <>
      <DiagonalLine
        point={point}
        distance={+1}
        angle={angle}
        strokeWidth={2 * scaleFactor}
      />
      <DiagonalLine
        point={point}
        distance={-1}
        angle={angle + Math.PI / 2}
        strokeWidth={2 * scaleFactor}
      />
    </>
  );
}

export default Cross;
