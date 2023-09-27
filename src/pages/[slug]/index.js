import React, { useContext, useEffect } from "react";
import { useFela } from "react-fela";
import FontPreview from "@/components/FontPreview";
import FilterContext, { FilterContextWrapper } from "@/contexts/FilterContext";
import OutputFontContext from "@/contexts/OutputFontContext";
import data from "@/data";
import Form from "@/components/Form";

const wrapperRule = () => ({
  position: "absolute",
  zIndex: -1,
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // pointerEvents: "none",
  userSelect: "none",
  overflow: "hidden",
});

const previewRule = () => ({
  position: "absolute",
  display: "inline-block",
});

function Index({ filterData }) {
  //   const { identifier } = useContext(FilterContext);
  const { previewStrings } = useContext(OutputFontContext);

  //   const { title } = useContext(FilterContext);
  const { css } = useFela();

  return (
    <div className={css(wrapperRule)} data-font-preview>
      <FilterContextWrapper data={filterData}>
        <FontPreview className={css(previewRule)}>
          {previewStrings?.[filterData.identifier] ?? filterData.title}
        </FontPreview>
        <Form key={filterData.identifier}></Form>
      </FilterContextWrapper>
    </div>
  );
}

export default Index;

export function getStaticPaths() {
  return {
    paths: data.map((entry) => ({ params: { slug: entry.slug } })),
    fallback: false,
  };
}

export function getStaticProps(context) {
  const filterData = data.find((filter) => filter.slug === context.params.slug);
  return {
    props: { filterData },
  };
}
