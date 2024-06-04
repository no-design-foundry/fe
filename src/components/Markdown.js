import React from "react";
import { useFela } from "react-fela";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const backgroundColor = `rgb(${[255, 255, 255].map(val => val * .95).join(", ")})`

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
  "lineHeight": 1.1,
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
    display: "block"
  },
  "& code": {
    maxWidth: "100%",
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
    marginBottom: 20
  },
  "& p, & code, & h1, & h2": {
    marginBottom: "10px",
  },
  "& blockquote": {
    paddingLeft: "3ch",
  },
  "& blockquote ~ code": {
    marginLeft: "3ch",
  }
});

function Markdown({ markdown }) {
  const { css } = useFela();
  return (
    <ReactMarkdown
      children={`${markdown}`}
      linkTarget="_blank"
      className={css(mdRule)}
      rehypePlugins={[rehypeRaw]}
      components={{pre: ({node, inline, className, children, ...props}) => {
        return (
          children
        )
      },
      img: ({node, inline, className, children, ...props}) => {
        return (
          <img className={className} {...props} width="100%" height="auto" />
        )
    }}}
    />
  );
}

export default Markdown