import React, { useContext, useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";
import { TTXContext } from "@/pages/workshop/explorer";

const INDENT = 1;


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
  fontSize: "inherit",
});

const inputWrapperRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    marginLeft: 10,
  },
});

const trRule = ({ level }) => ({
  // display: "block",
});

const thRule = () => ({
  textAlign: "left",
});

const tdRule = ({ level }) => ({
  textAlign: "left",
  paddingVertical: 4,
  paddingHorizontal: 10,
  extend: [
    {
      condition: level == 1,
      style: {
        background: "#F2F2F2",
        margin: 10,
        padding: 10,
        borderRadius: 10,
      },
    },
  ],
});

const attributesWrapperRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    marginLeft: 10,
  },
});

const tableRule = ({ level }) => ({
  paddingLeft: `${level * INDENT}ch`,
  extend: [
    {
      condition: level > 0,
      style: {
        width: "100%",
      },
    },
    {
      condition: level == 1,
      style: {
        background: "#F2F2F2",
        padding: 10,
        borderRadius: 10,
      },
    },
  ],
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

  return Object.entries(data).map(([key, value]) => (
    <span key={key} className={css(inputWrapperRule)}>
      <strong>{key}</strong>
      <Input keys={keys} lastKey={key} value={value.trim()} />
    </span>
  ));
}

function Input({ type, value, pathKeys }) {
  const { rawXmlFont } = useContext(TTXContext);
  const [size, setSize] = useState(Math.max(value?.length ?? 1, 5));
  value = value?.trim();
  const { css } = useFela();

  function handleOnChange(e) {
    const { value } = e.target;
    const path = buildQuerySelectorPath(pathKeys);
    console.log(path)
    // if (lastKey === "content") {
    //   rawXmlFont.current.querySelector(path).textContent = value;
    // } else {
    //   rawXmlFont.current.querySelector(path).setAttribute(lastKey, value);
    // }
    // setSize(Math.max(value.length, 4));
  }

  if (type === "textarea") {
    return (
      <textarea
        className={css(inputRule, textAreaRule)}
        rows={20}
        onChange={handleOnChange}
      >
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

function getUniqueKeys(data) {
  const key = Object.keys(data)[0];
  const uniqueKeys = [
    ...Object.values(data[key]).reduce((acc, child) => {
      const key = Object.keys(child)[0];
      const childData = child[key];
      for (const childKey of Object.keys(childData)) {
        acc.add(childKey);
      }
      return acc;
    }, new Set()),
  ];
  return uniqueKeys;
}

function Tr({ child, uniqueKeys, level, pathKeys }) {
  const [expanded, setExpanded] = useState(false);
  const { css } = useFela({ level });
  const key = Object.keys(child)[0];

  return (
    <>
      <tr className={css(trRule)}>
        <td className={css(tdRule)}>
          {"children" in child[key] ? (
            <div onClick={() => setExpanded(!expanded)}>
              {expanded ? "▲" : "▼"}
              {key}
            </div>
          ) : (
            <>
              {uniqueKeys.length ? (
                key
              ) : (
                <div className={css(attributesWrapperRule)}>
                  <span>{key}</span>
                  <Attributes data={child[key]} pathKeys={[...pathKeys]} />
                </div>
              )}
            </>
          )}
        </td>
        {uniqueKeys.map((uniqueKey, index) => (
          <td className={css(tdRule)}>
            {child?.[key]?.[uniqueKey] && (
              <Input
                value={child[key][uniqueKey]}
                pathKeys={[...pathKeys, uniqueKey]}
              />
            )}
          </td>
        ))}
      </tr>
      <tr>
        <td colSpan="100%">
          {expanded && <Table data={child} level={level} pathKeys={[...pathKeys]} />}
        </td>
      </tr>
    </>
  );
}

function Table({ data, level, pathKeys }) {
  const key = Object.keys(data)[0];
  const { children } = data[key];
  const { css } = useFela({ level });
  const uniqueKeys =
    Object.values(data[key]).length === 1
      ? getUniqueKeys(data[key]).filter((key) => key !== "children")
      : [];
  return (
    <table className={css(tableRule)}>
      <thead>
        <tr>
          {uniqueKeys.length ? (
            <th className={css(tdRule, thRule)}>Type</th>
          ) : null}
          {uniqueKeys.map((uniqueKey) => (
            <th className={css(tdRule, thRule)}>{uniqueKey}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children?.map((child, index) => (
          <Tr child={child} uniqueKeys={uniqueKeys} level={level + 1} pathKeys={[...pathKeys, index, Object.keys(child)[0]]}></Tr>
        ))}
      </tbody>
    </table>
  );
}

function ReactJson({ src }) {
  const json = convertXML(src);
  const { css } = useFela();
  return <Table data={json} pathKeys={[]} level={0} />;
}

export default ReactJson;
