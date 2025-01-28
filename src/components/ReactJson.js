import React, { use, useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";

export const childStyle = ({ level }) => ({
  marginLeft: `${level * 5}px`,
  extend: [
    {
      condition: level == 1,
      style: {
        padding: 10,
        background: "#F2F2F2",
        borderRadius: 10,
        margin: 10,
      },
    },
  ],
});

export const lastChildStyle = ({ level }) => ({
  marginLeft: (level + 1) * 5,
  display: "flex",
  "& > * + *": {
    marginLeft: 20,
  },
});

function LastChildElement({ data, level }) {
  return Object.entries(data).map(([key, value]) => (
    <span key={key}>
      {key}={value}
    </span>
  ));
}

function ChildElement({ data, level = 0 }) {
  const { css } = useFela({ level });
  const key = Object.keys(data)[0];
  const { children, ...otherValues } = data[key];
  const [expanded, setExpanded] = useState(false);

  function handleOnClick() {
    setExpanded(!expanded);
  }

  return (
    <div className={css(childStyle)}>
      <div className={css(lastChildStyle)} {...(children ? { onClick: handleOnClick } : {})}>
        <span>{key}</span>
        <LastChildElement data={otherValues} level={level} />
        {children && <span>{expanded ? "↑" : "↓"}</span>}
      </div>
      {expanded && (
        <ul>
          {children?.map((item, index) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <div className={css(lastChildStyle)} key={index}>
                {value.children ? (
                  <ChildElement key={index} data={item} level={level + 1} />
                ) : (
                  <LastChildElement
                    key={index}
                    data={item[key]}
                    level={level + 1}
                  />
                )}
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReactJson({ src }) {
  const json = convertXML(src);
  console.log(json)
  return (
    <div>
      <ChildElement data={json} />
    </div>
  );
}

export default ReactJson;
