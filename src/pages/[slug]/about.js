import Markdown from "@/components/Markdown";
import data from "@/data";
import React from "react";

function About({ markdown }) {
  return <Markdown markdown={markdown} />;
}

export default About;

export function getStaticPaths() {
  return {
    paths: data.filter(entry => entry.type === "filterDetailView" && !(entry.isHidden)).map((entry) => ({ params: { slug: entry.slug } })),
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
