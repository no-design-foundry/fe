import React from "react";

function Line({ points, scaleFactor, isDashed, stroke }) {
  return (
    <line
      x1={points[0][0]}
      y1={points[0][1]}
      x2={points[1][0]}
      y2={points[1][1]}
      stroke={stroke || "black"}
      strokeWidth={scaleFactor}
      {...(isDashed ? { strokeDasharray: "5 10"} : {})}
    />
  );
}

export default Line;
