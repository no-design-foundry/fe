import React, { useState } from "react";
import { convertXML } from "simple-xml-to-json";
import { useFela } from "react-fela";

const INDENT = 1;

const childStyle = ({ level }) => ({
  maxWidth: "80vw",
  extend: [
    {
      condition: level > 1,
      style: {
        width: "100%",
      }
    },
  ]
});

const buttonRule = ({level}) => ({
  extend: [{
    condition: level === 1,
    style: {
      padding: 10,
      background: "#F2F2F2",
      borderRadius: 10,
      marginVertical: 2,
    }
  }]
})


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
      }
    }
  ]
})

const getIndentRule = (level) => () => ({
  extend: [{
    condition: level > 1,
    style: {
      marginLeft: `${level * INDENT}ch`,
    }
  }]
});

const indicatorRule = {
  textDecoration: "none",
  marginLeft: "auto",
}

const attributesRule = () => ({
  whiteSpace: "pre-wrap",
  marginLeft: "10px",
  "& > * + *": {
    marginLeft: "10px",
  }
})

function Attributes({ data }) {
  const {css} = useFela()
  return (
    <span className={css(attributesRule)}>
      {Object.entries(data).map(([key, value]) => (
        <span key={key}>
          {`${key}=${value}`}
        </span>
      ))}
    </span>
  );
}

function ChildElement({ data, level = 0 }) {
  const { css } = useFela({ level });
  const key = Object.keys(data)[0];
  const { children, ...attributes } = data[key];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={css(buttonRule, childStyle)}>
      <div className={css(headerStyle)} onClick={() => children && setExpanded(!expanded)}>
        <span>{key}</span>
        {attributes && <Attributes data={attributes} />}
        {children && <span className={css(indicatorRule)}>{expanded ? "▲" : "▼"}</span>}
      </div>
      {expanded && (
        <ul className={css(getIndentRule(level + 1))} >
          {children?.map((child, index) => {
            const childKey = Object.keys(child)[0];
            const childData = child[childKey];
            return (
              <li key={index} className={css(lastChildStyle)}>
                {childData.children ? (
                  <ChildElement data={child} level={level + 1} />
                ) : (
                  <div className={css(buttonRule({level: level + 1}))}>
                    <span>{childKey}</span>
                    <Attributes data={childData} />
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
