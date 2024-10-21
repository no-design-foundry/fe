import React from "react";

function Path({ path, isCubic, scaleFactor, isDashed, isHighlighted }) {
  return (
    <path
      d={`M${path[0][0]},${path[0][1]} ${isCubic ? "C" : "Q"}${path
        .slice(1)
        .map(([x, y]) => `${x},${y}`)
        .join(" ")}`}
      strokeWidth={2 * scaleFactor}
      stroke={isHighlighted? "red" : "black"}
      fill="none"
      {...(isDashed ? { strokeDasharray: "5 10", stroke: "black" } : {})}
    />
  );
}

export default Path;
