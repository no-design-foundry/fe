import Markdown from "@/components/Markdown";
import data from "@/data";
import React from "react";
import { useFela } from "react-fela";

const markdownWrapperRule = () => ({
  marginTop: "1em",
});

function About({ markdown }) {
  const { css } = useFela();
  return (
    <div className={css(markdownWrapperRule)}>
      <Markdown markdown={markdown} />
    </div>
  );
}

export default About;

export function getStaticPaths() {
  return {
    paths: data
      .filter((entry) => entry.type === "filterDetailView" && !entry.isHidden)
      .map((entry) => ({ params: { slug: entry.slug } })),
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
