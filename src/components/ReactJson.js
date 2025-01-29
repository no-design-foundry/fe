import React, { useContext, useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";
import { TTXContext } from "@/pages/workshop/explorer";

const INDENT = 1;

const inputRule = () => ({
  border: "none",
  width: "100%",
  minWidth: "2ch",
  paddingHorizontal: 4,
  borderRadius: 4,
  fontFamily: "monospace",
});

const rowLegendRule = () => ({
  borderRight: "1px solid black",
});

const clickableRule = () => ({
  cursor: "pointer",
  userSelect: "none",
});

const textAreaRule = () => ({
  width: "70ch",
  fontSize: "inherit",
});

const attributesRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    paddingLeft: 10,
  },
});

const cellRule = () => ({
  borderTop: "1px solid black",
  width: "100%",
  padding: 10,
});

const emptyCellRule = () => ({});

const attributesWrapperRule = () => ({
  display: "flex",
  alignItems: "baseline",
  "& > * + *": {
    paddingLeft: 10,
  },
});

const expandableTableRule = () => ({
  gridColumn: "1 / -1",
  width: "100%",
});

const tableRule = ({ level, uniqueKeysLength }) => ({
  paddingLeft: `${level * INDENT}ch`,
  extend: [
    {
      condition: uniqueKeysLength === 0,
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
      },
    },
    {
      condition: uniqueKeysLength > 0,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${uniqueKeysLength + 1}, max-content)`,
      },
    },
  ],
  // gap: 4
});

function buildQuerySelectorPath(keys) {
  return keys.reduce((acc, key, index) => {
    if (typeof key === "number") {
      return `${acc} > *:nth-child(${key + 1})`;
    }
    if (index === 0) {
      return key;
    } else {
      return `${acc} > ${key}`;
    }
  }, "");
}

function Attributes({ data, pathKeys }) {
  const { css } = useFela();

  return Object.entries(data).map(([key, value]) => (
    <span key={key} className={css(attributesRule)}>
      <span>{key}</span>
      <Input pathKeys={pathKeys} lastKey={key} value={value.trim()} />
    </span>
  ));
}

function Input({ type, value, pathKeys, lastKey }) {
  const { rawXmlFont } = useContext(TTXContext);
  const [size, setSize] = useState(Math.max(value?.length ?? 1, 5));
  value = value?.trim();
  const { css } = useFela();

  function handleOnChange(e) {
    const { value } = e.target;
    const path = buildQuerySelectorPath(pathKeys);
    let originalValue;
    if (lastKey === "content") {
      originalValue = rawXmlFont.current.querySelector(path).textContent;
      rawXmlFont.current.querySelector(path).textContent = value;
    } else {
      originalValue = rawXmlFont.current
        .querySelector(path)
        .getAttribute(lastKey);
      rawXmlFont.current.querySelector(path).setAttribute(lastKey, value);
    }
    console.log({ originalValue });
    setSize(Math.max(value.length, 4));
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
      <div className={css(cellRule, rowLegendRule)}>
        {"children" in child[key] ? (
          <i
            className={css(clickableRule)}
            onClick={() => setExpanded(!expanded)}
          >
            {`${expanded ? "▲" : "▼"} ${key}`}
          </i>
        ) : uniqueKeys.length ? (
          <i>{key}</i>
        ) : (
          <i className={css(attributesWrapperRule)}>
            <span>{key}</span>
            <Attributes data={child[key]} pathKeys={[...pathKeys]} />
          </i>
        )}
      </div>
      {uniqueKeys.map((uniqueKey, index) => (
        <div className={css(cellRule)}>
          {child?.[key]?.[uniqueKey] && (
            <Input
              type={
                key === "assembly" && uniqueKey === "content"
                  ? "textarea"
                  : "text"
              }
              value={child[key][uniqueKey]}
              pathKeys={pathKeys}
              lastKey={uniqueKey}
            />
          )}
        </div>
      ))}
      <div className={css(expandableTableRule)}>
        {expanded && (
          <Table
            data={child}
            level={level}
            pathKeys={[...pathKeys]}
            expanded={expanded}
          />
        )}
      </div>
    </>
  );
}

function Table({ data, level, pathKeys }) {
  const key = Object.keys(data)[0];
  const { children } = data[key];
  const uniqueKeys =
    Object.values(data[key]).length === 1
      ? getUniqueKeys(data[key]).filter((key) => key !== "children")
      : [];
  const { css } = useFela({
    level,
    uniqueKeysLength: uniqueKeys.length,
  });
  return (
    <div className={css(tableRule)}>
      {uniqueKeys.length ? (
        <div className={css(cellRule, emptyCellRule, rowLegendRule)}></div>
      ) : null}
      {uniqueKeys.map((uniqueKey) => (
        <strong className={css(cellRule)}>{uniqueKey}</strong>
      ))}
      {children?.map((child, index) => (
        <>
          <Tr
            child={child}
            uniqueKeys={uniqueKeys}
            level={level + 1}
            pathKeys={[...pathKeys, index]}
          ></Tr>
        </>
      ))}
    </div>
  );
}

const tableListEntryRule = () => ({
  background: "#F2F2F2",
  padding: 20,
  borderRadius: 10,
  "& + *": {
    marginTop: 5,
  },
  "& > * + *": {
    marginTop: 10,
  },
});

const mainRule = () => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

function TableListEntry({ data }) {
  const key = Object.keys(data)[0];
  const [expanded, setExpanded] = useState();
  const { css } = useFela();

  function handleOnClick() {
    setExpanded(!expanded);
  }
  return (
    <div className={css(tableListEntryRule)}>
      <strong onClick={handleOnClick} className={css(clickableRule)}>{`${
        expanded ? "▲" : "▼"
      } ${key}`}</strong>
      {expanded && <Table data={data} level={0} pathKeys={["&"]} />}
    </div>
  );
}

function ReactJson({ src }) {
  const json = convertXML(src);
  const key = Object.keys(json)[0];
  const { css } = useFela();
  return (
    <div className={css(mainRule)}>
      {json[key].children.map((child) => (
        <TableListEntry key={key} data={child} />
      ))}
    </div>
  );
}

export default ReactJson;
