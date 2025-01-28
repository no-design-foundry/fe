import React, { useState } from "react";
import { useFela } from "react-fela";

const childStyle = ({ level }) => ({
  marginLeft: `${level * 2}px`,
  extend: [
    {
      condition: level === 2,
      style: {
        padding: 10,
        marginVertical: 20,
        background: "#F2F2F2",
        borderRadius: 10,
      },
    },
  ],
});

const Child = React.memo(({ data, level = 0 }) => {
  const { css } = useFela({ level });
  const [expandedKeys, setExpandedKeys] = useState({});

  const toggleExpand = (key) => {
    setExpandedKeys((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  if (typeof data !== "object" || data === null) {
    return <span className={css(childStyle)}>{data}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <ul className={css(childStyle)}>
        {data.map((item, index) => (
          <li key={index}>
            <Child data={item} level={level + 1} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={css(childStyle)}>
      {Object.keys(data).map((key) => (
        <li key={key}>
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => toggleExpand(key)}
          >
            {key}
          </span>
          {typeof data[key] !== "object" || data[key] === null ? (
            <span>: {data[key]}</span>
          ) : (
            expandedKeys[key] && (
              <div>
                <Child data={data[key]} level={level + 1} />
              </div>
            )
          )}
        </li>
      ))}
    </ul>
  );
});

function ReactJson({ src }) {
  return (
    <div>
      <Child data={src} />
    </div>
  );
}

export default ReactJson;