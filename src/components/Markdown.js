import React from "react";
import { useFela } from "react-fela";
import ReactMarkdown from "react-markdown";

const mdRule = () => ({
  maxWidth: "50vw",
  "& > p:not(:last-child)": {
    marginBottom: ".5em",
  },
  portrait: {
    maxWidth: "unset",
  },
});

function Markdown({ markdown }) {
  const { css } = useFela();
  return (
    <ReactMarkdown
      children={`${markdown}`}
      linkTarget="_blank"
      className={css(mdRule)}
    />
  );
}

export default Markdown