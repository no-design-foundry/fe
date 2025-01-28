import React, { useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";

const INDENT = 2

const childStyle = ({ level }) => ({
  // marginLeft: `${level * INDENT}ch`,
  ...(level === 1 && {
    padding: 10,
    background: "#F2F2F2",
    borderRadius: 10,
    margin: 10,
  }),
});

const headerRule = ({ level }) => ({
  textDecoration: "underline",
  "& > * + *": { marginLeft: 20 },
  "& + ul": {
    marginLeft: `${level * INDENT}ch`,
  }
})

const lastChildStyle = () => ({
  display: "flex",
  "& > * + *": { marginLeft: 20 },
});

function LastChildElement({ data }) {
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
  const [expanded, setExpanded] = useState(!false);

  return (
    <div className={css(childStyle)}>
      <div
        className={css(headerRule)}
        {...(children && { onClick: () => setExpanded(!expanded) })}
      >
        <span>{key}</span>
        <LastChildElement data={otherValues} />
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
                  <>
                    <span>{key}</span>
                    <LastChildElement data={item[key]} />
                  </>
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
  return (
    <div>
      <ChildElement data={json} />
    </div>
  );
}

export default ReactJson;