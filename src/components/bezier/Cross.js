import React from "react";

function DiagonalLine({ point, size, direction, angle, strokeWidth }) {
  const offsetAngle = angle + Math.PI / 4;
  return (
    <line
      x1={point[0] - size * Math.cos(offsetAngle) * direction}
      x2={point[0] + size * Math.cos(offsetAngle) * direction}
      y1={point[1] - size * Math.sin(offsetAngle) * direction}
      y2={point[1] + size * Math.sin(offsetAngle) * direction}
      strokeWidth={strokeWidth || 2}
      stroke="red"
    />
  );
}

function Cross({ point, angle, scaleFactor }) {
  return (
    <g>
      <DiagonalLine
        point={point}
        direction={+1}
        size={20 * scaleFactor}
        angle={angle}
        strokeWidth={2 * scaleFactor}
        />
      <DiagonalLine
        point={point}
        direction={-1}
        size={20 * scaleFactor}
        angle={angle + Math.PI / 2}
        strokeWidth={2 * scaleFactor}
      />
    </g>
  );
}

export default Cross;
