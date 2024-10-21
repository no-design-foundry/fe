import React from "react";

function Point({ point, scaleFactor, onMouseDown, fill }) {
  return (
    <rect
      x={point[0] - 10 * scaleFactor}
      y={point[1] - 10 * scaleFactor}
      width={20 * scaleFactor}
      height={20 * scaleFactor}
      fill={fill || "black"}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    />
  );
}

export default Point;
