import React from "react";
import { useFela } from "react-fela";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import dynamic from "next/dynamic";
import BezierPlayground from "./BezierPlayground";
import BezierInterpolationPlayground from "./BezierInterpolationPlayground";

const componentMapper = {
  BezierPlayground,
  BezierInterpolationPlayground
};

const backgroundColor = `rgb(${[255, 255, 255]
  .map((val) => val * 0.95)
  .join(", ")})`;

const mdRule = () => ({
  "& img": {
    backgroundColor: backgroundColor,
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

const h1Rule = () => ({
  fontSize: "2em",
  // fontWeight: "bold",
  fontStyle: "italic",
  fontFamily: "cursive",
  marginTop: ".5em",
})

const h2Rule = () => ({
  fontSize: "1.5em",
  // fontWeight: "bold",
  fontStyle: "italic",
  fontFamily: "cursive",
  marginTop: ".25em"
})

// "& h1, & h2": {
//   fontSize: "2em",
//   // fontWeight: "bold",
//   fontStyle: "italic",
//   fontFamily: "cursive",
//   marginTop: 50,
// },

function Markdown({ markdown }) {
  const { css } = useFela();


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
            if (props.curvea) {
              props.curveA = JSON.parse(props.curvea);
              props.curveB = JSON.parse(props.curveb);
            }
            return componentMapper[component](props);
          } else {
            return <div {...props} />;
          }
        },
        h1: ({ node, inline, className, children, ...props }) => {
          const {css} = useFela()
          return <h1 className={css(h1Rule)} {...props}>{children}</h1>;
        },
        h2: ({ node, inline, className, children, ...props }) => {
          const {css} = useFela()
          return <h1 className={css(h2Rule)} {...props}>{children}</h1>;
        },
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
