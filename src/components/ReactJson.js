import React, { useContext, useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";
import { TTXContext } from "@/pages/workshop/explorer";

const INDENT = 1;

const childStyle = ({ level }) => ({
  // maxWidth: "80vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  extend: [
    {
      condition: level > 1,
      style: {
        // width: "100%",
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
  display: "flex",
  alignItems: "center",
});

const getIndentRule = (level) => () => ({
  extend: [
    {
      condition: level > 1,
      style: {
        paddingLeft: `${level * INDENT}ch`,
      },
    },
  ],
});

const indicatorRule = {
  textDecoration: "none",
  // marginLeft: "auto",
};

const attributesRule = () => ({
  flexWrap: "wrap",
  display: "flex",
  whiteSpace: "pre-wrap",
  marginLeft: "10px",
  "& > *:not(:last-child)": {
    marginRight: "10px",
  },
});

const inputRule = () => ({
  border: "none",
  width: "100%",
  minWidth: "2ch",
  paddingVertical: 2,
  marginVertical: 2,
  paddingHorizontal: 4,
  borderRadius: 4,
  fontFamily: "monospace",
});

const textAreaRule = () => ({
  width: "70ch",
  fontSize: "inherit"
})

const inputWrapperRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    marginLeft: 10,
  },
});

const clickableRule = () => ({
  cursor: "pointer",
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

  return (
    <span className={css(attributesRule)}>
      {Object.entries(data).map(([key, value]) => (
        <span key={key} className={css(inputWrapperRule)}>
          <strong>{key}</strong>
          <Input keys={keys} lastKey={key} value={value.trim()} />
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

function Input({ type, value, keys, lastKey }) {
  const { rawXmlFont } = useContext(TTXContext);
  const [size, setSize] = useState(Math.max(value?.length ?? 1, 5));
  value = value?.trim();
  const { css } = useFela();

  function handleOnChange(e) {
    const { value } = e.target;
    const path = buildQuerySelectorPath(keys);
    if (lastKey === "content") {
      rawXmlFont.current.querySelector(path).textContent = value;
    } else {
      rawXmlFont.current.querySelector(path).setAttribute(lastKey, value);
    }
    setSize(Math.max(value.length, 4));
  }
  if (type === "textarea") {
    return (
      <textarea className={css(inputRule, textAreaRule)} rows={20} onChange={handleOnChange}>
        {value}
      </textarea>
    );
  } else {
    return (
      <input
        type="text"
        size={size}
        className={css(inputRule)}
        defaultValue={value}
        onChange={handleOnChange}
      />
    );
  }
}

function ChildTable({ data, level, keys }) {
  const { css } = useFela({ level });
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
                return (
                  <td key={index}>
                    {rowValues[key] && (
                      <Input
                        value={rowValues[key]}
                        keys={[...keys, index]}
                        lastKey={key}
                        type={rowKey === "assembly" ? "textarea" : "text"}
                      ></Input>
                    )}
                  </td>
                );
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
    <div className={css(buttonRule, childStyle, getIndentRule(level))}>
      <div className={css(headerStyle)}>
        <span
          className={css(clickableRule)}
          onClick={() => children && setExpanded(!expanded)}
        >
          {children ? (
            <>
              <span className={css(indicatorRule)}>{expanded ? "▲" : "▼"}</span>
              <u>{key}</u>
            </>
          ) : (
            key
          )}
        </span>
        {attributes && <Attributes keys={[...keys, key]} data={attributes} />}
      </div>
      {expanded ? (
        hasChildren(children) ? (
          children?.map((child, index) => {
            return <ChildElement key={index} data={child} level={level + 1} />;
          })
        ) : (
          <ChildTable keys={[...keys, key]} data={children} level={level} />
        )
      ) : null}
    </div>
  );
}

function ReactJson({ src }) {
  const json = convertXML(src);
  return <ChildElement data={json} />;
}

export default ReactJson;
