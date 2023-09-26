import React from "react";
import { useFela } from "react-fela";
import ReactMarkdown from "react-markdown";
import { getStaticPaths as getStaticPathsImported } from "./index";

const mdRule = () => ({
  maxWidth: "50vw",
  "& > p:not(:last-child)": {
    marginBottom: ".5em",
  },
  portrait: {
    maxWidth: "unset",
  },
});

function About({ markdown }) {
  const { css } = useFela();
  return (
    <ReactMarkdown
      children={`${markdown}`}
      linkTarget="_blank"
      className={css(mdRule)}
    />
  );
}

export default About;

export const getStaticPaths = getStaticPathsImported;

export function getStaticProps({ params }) {
  const { slug } = params;
  let markdown;
  switch (slug) {
    case "rotorizer":
      markdown = require("@/abouts/rotorizer.md");
      break;
    case "rasterizer":
      markdown = require("@/abouts/rasterizer.md");
      break;
  }
  return {
    props: {
      markdown,
    },
  };
}
