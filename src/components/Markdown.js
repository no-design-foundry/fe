import React from "react";
import { useFela } from "react-fela";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import BezierPlayground from "./BezierPlayground";
import dynamic from "next/dynamic";
import BezierInterpolationPlayground from "./BezierInterpolationPlayground";

const componentMapper = {
  BezierPlayground,
};

const backgroundColor = `rgb(${[255, 255, 255]
  .map((val) => val * 0.95)
  .join(", ")})`;

const mdRule = () => ({
  "& img": {
    backgroundColor: backgroundColor,
  },
  "& h1, & h2": {
    fontSize: "2em",
    // fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "cursive",
    marginTop: 50,
  },
  lineHeight: 1.1,
  "& > *": {
    maxWidth: "72ch",
  },
  "& > p:not(:last-child)": {
    marginBottom: ".5em",
  },
  "& a": {
    textDecoration: "underline",
  },
  "& em, & figcaption": {
    fontSize: "1.2em",
    fontFamily: "cursive",
    fontStyle: "italic",
    display: "inline-block",
  },
  "& figcaption": {
    width: "100%",
    marginBottom: "1em",
    textAlign: "center",
    display: "block",
  },
  "& code": {
    overflowX: "auto",
    maxWidth: "calc( 100% - 2em )",
    "&:not(.inline)": {
      backgroundColor: backgroundColor,
      color: "rgba(0, 0, 0, 0.95)",
      padding: "1em",
      display: "block",
      width: "fit-content",
      whiteSpace: "pre",
      "&::before": {
        borderRadius: "4px",
      },
    },
    "&.inline": {
      fontSize: ".9em",
    },
  },
  "& hr": {
    marginBottom: 20,
  },
  "& p, & code, & h1, & h2": {
    marginBottom: "10px",
  },
  "& blockquote": {
    paddingLeft: "3ch",
  },
  "& blockquote ~ code": {
    marginLeft: "3ch",
  },
});

function Markdown({ markdown }) {
  const { css } = useFela();

  return <>
    <BezierInterpolationPlayground curveA={[[150,450],[200,50],[500,50],[950,450]]} curveB={[[50,450],[200,150],[800,50],[950,50]]}/>
    <BezierPlayground curve={[[50,450],[500,50],[950,450]]}/>
    <BezierPlayground curve={[[50,450],[200,50],[800,50],[950,450]]}/>
  </>

  return (
    <ReactMarkdown
      children={`${markdown}`}
      linkTarget="_blank"
      className={css(mdRule)}
      rehypePlugins={[rehypeRaw]}
      components={{
        div: ({ component, ...props }) => {
          if (component) {
            if (props.curve) {
              props.curve = JSON.parse(props.curve);
            }
            return componentMapper[component](props);
          } else {
            return <div {...props} />;
          }
        },
        bezierplayground: (props) => BezierPlayground(props),
        img: ({ node, inline, className, children, ...props }) => {
          return (
            <img className={className} {...props} width="100%" height="auto" />
          );
        },
      }}
      transformLinkUri={(uri) =>
        uri.startsWith("http") ? uri : `https://${uri}`
      }
    />
  );
}

export default Markdown;
