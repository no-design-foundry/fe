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
  width: "100%",
  minWidth: "2ch",
  padding: 4,
  borderRadius: 4,
  fontFamily: "monospace",
});

const headRule = () => ({
  textAlign: "left",
});

const tableRule = () => ({
  "& td": {
    padding: 2,
  },
});

function buildQuerySelectorPath(keys) {
  return keys.reduce((acc, key, index) => {
    if (typeof key === "number") {
      return `${acc} > *:nth-child(${key})`;
    }
    if (index === 0) {
      return key;
    } else {
      return `${acc} > ${key}`;
    }
  }, "");
}

function Attributes({ data, keys }) {
  const { css } = useFela();
  const { rawXmlFont } = useContext(TTXContext);

  function handleOnChange(e) {
    const { key } = e.target.dataset;
    const { value } = e.target;
    const path = buildQuerySelectorPath(keys);
    if (key === "content") {
      rawXmlFont.current.querySelector(path).textContent = value;
    } else {
      rawXmlFont.current.querySelector(path).setAttribute(key, value);
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
            size={value.length}
          />
        </span>
      ))}
    </span>
  );
}

function hasChildren(children) {
  const returnValue = children.some((child) =>
    Object.values(child)
      .reduce((acc, childKey) => {
        acc = [...acc, ...Object.keys(childKey)];
        return acc;
      }, [])
      .some((key) => key === "children")
  );
  return returnValue;
}

function Input({value, keys, lastKey}) {
  const { rawXmlFont } = useContext(TTXContext);
  value = value?.trim()
  const {css} = useFela()

  function handleOnChange(e) {
    const { value } = e.target;
    const path = buildQuerySelectorPath(keys);
    console.log(lastKey, value)
    if (lastKey === "content") {
      rawXmlFont.current.querySelector(path).textContent = value;
    } else {
      rawXmlFont.current.querySelector(path).setAttribute(lastKey, value);
    }
  }

  return (
    <input
      type="text"
      size={Math.max(value?.length ?? 1, 4)}
      className={css(inputRule)}
      defaultValue={value}
      onChange={handleOnChange}
    />
  );
}

function ChildTable({ data, level, keys }) {
  const { css } = useFela();
  const uniqueKeys = [
    ...data.reduce((acc, child) => {
      const key = Object.keys(child)[0];
      const childData = child[key];
      for (const childKey of Object.keys(childData)) {
        acc.add(childKey);
      }
      return acc;
    }, new Set()),
  ];

  return (
    <table className={css(tableRule, getIndentRule(level))}>
      <thead className={css(headRule)}>
        <tr>
          <th>Type</th>
          {uniqueKeys.map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((child, index) => {
          const [rowKey, rowValues] = Object.entries(child)[0];
          return (
            <tr key={index}>
              <td>{rowKey}</td>
              {uniqueKeys.map((key, index) => {
                return <td key={index}><Input value={rowValues[key]} keys={[...keys, index]} lastKey={key}></Input></td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
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
      {expanded ? (
        hasChildren(children) ? (
          children?.map((child, index) => {
            return <ChildElement key={index} data={child} level={level + 1} />;
          })
        ) : (
          <ChildTable keys={[...keys, key]} data={children} level={level + 1} />
        )
      ) : null}
      {/* {expanded && (
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
      )} */}
    </div>
  );
}

function ReactJson({ src }) {
  const json = convertXML(src);
  return <ChildElement data={json} />;
}

export default ReactJson;
