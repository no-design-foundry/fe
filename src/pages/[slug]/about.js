import Markdown from "@/components/Markdown";
import data from "@/data";
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

function About({ markdown }) {
  const { css } = useFela();
  return <Markdown markdown={markdown} />;
}

export default About;

export function getStaticPaths() {
  return {
    paths: data.filter(entry => entry.type === "filterDetailView").map((entry) => ({ params: { slug: entry.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { slug } = params;
  const markdown = require(`@/abouts/${slug}.md`);
  return {
    props: {
      markdown,
    },
  };
}
