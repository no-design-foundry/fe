import React from "react";

function Handle({ point, scaleFactor, onMouseDown, fill }) {
  return (
    <circle
      cx={point[0]}
      cy={point[1]}
      r={8 * scaleFactor}
      fill={fill || "black"}
      onMouseDown={onMouseDown}
      draggable="true"
      onTouchStart={onMouseDown}
    />
  );
}

export default Handle;
