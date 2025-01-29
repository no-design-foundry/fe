import React, { useContext, useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";
import { TTXContext } from "@/pages/workshop/explorer";

const INDENT = 1;

const childStyle = ({ level }) => ({
  maxWidth: "80vw",
  extend: [
    {
      condition: level > 1,
      style: {
        width: "100%",
      },
    },
  ],
});

const buttonRule = ({ level }) => ({
  extend: [
    {
      condition: level === 1,
      style: {
        padding: 10,
        background: "#F2F2F2",
        borderRadius: 10,
        marginVertical: 2,
      },
    },
  ],
});

const headerStyle = ({ level }) => ({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  // marginLeft: `${level * INDENT}ch`,
});

const lastChildStyle = ({ level }) => ({
  display: "flex",
  "& > * + *": {
    marginLeft: "10px",
  },
  extend: [
    {
      condition: level > 0,
      style: {
        "&:not(:first-child)": {
          borderTop: "1px solid black",
        },
        paddingVertical: "4px",
      },
    },
  ],
});

const getIndentRule = (level) => () => ({
  extend: [
    {
      condition: level > 1,
      style: {
        marginLeft: `${level * INDENT}ch`,
      },
    },
  ],
});

const indicatorRule = {
  textDecoration: "none",
  marginLeft: "auto",
};

const attributesRule = () => ({
  whiteSpace: "pre-wrap",
  marginLeft: "10px",
  "& > * + *": {
    marginLeft: "10px",
  },
});

const inputRule = () => ({
  border: "none",
  display: "inline",
  width: "auto !important",
  minWidth: "2ch",
});

function buildQuerySelectorPath(keys) {
  return keys.reduce((acc, key, index) => {
    if (typeof key === "number") {
      return `${acc} > *:nth-child(${key})`;
    }
    if (index === 0) {
      return key;
    }
    else {
      return `${acc} > ${key}`;
    }
  }, "");
}

function Attributes({ data, keys }) {
  const { css } = useFela();
  const { rawXmlFont } = useContext(TTXContext);

  function handleOnChange(e) {
    const { key } = e.target.dataset;
    const { value } = e.target
    const path = buildQuerySelectorPath(keys)
    if (key === "content") {
      rawXmlFont.current.querySelector(path).textContent = value
    }
    else {
      rawXmlFont.current.querySelector(path).setAttribute(key, value)
    }
  }

  return (
    <span className={css(attributesRule)}>
      {Object.entries(data).map(([key, value]) => (
        <span key={key}>
          <strong>{key}</strong>
          <span> = </span>
          <input
            className={css(inputRule)}
            type="text"
            data-key={key}
            onChange={handleOnChange}
            defaultValue={value.trim()}
          />
        </span>
      ))}
    </span>
  );
}

function ChildElement({ data, keys = [], level = 0 }) {
  const { css } = useFela({ level });
  const key = Object.keys(data)[0];
  const { children, ...attributes } = data[key];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={css(buttonRule, childStyle)}>
      <div
        className={css(headerStyle)}
        onClick={() => children && setExpanded(!expanded)}
      >
        <span>{key}</span>
        {attributes && <Attributes keys={[...keys, key]} data={attributes} />}
        {children && (
          <span className={css(indicatorRule)}>{expanded ? "▲" : "▼"}</span>
        )}
      </div>
      {expanded && (
        <ul className={css(getIndentRule(level + 1))}>
          {children?.map((child, index) => {
            const childKey = Object.keys(child)[0];
            const childData = child[childKey];
            return (
              <li key={index} className={css(lastChildStyle)}>
                {childData.children ? (
                  <ChildElement
                    keys={[...keys, key]}
                    data={child}
                    level={level + 1}
                  />
                ) : (
                  <div className={css(buttonRule({ level: level + 1 }))}>
                    <span>{childKey}</span>
                    <Attributes keys={[...keys, key, index]} data={childData} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReactJson({ src }) {
  const json = convertXML(src);
  return <ChildElement data={json} />;
}

export default ReactJson;
