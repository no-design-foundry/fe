import React, { useContext, useEffect } from "react";
import { useFela } from "react-fela";
import FontPreview from "@/components/FontPreview";
import FilterContext, { FilterContextWrapper } from "@/contexts/FilterContext";
import OutputFontContext from "@/contexts/OutputFontContext";
import data from "@/data";
import Form from "@/components/Form";

const wrapperRule = () => ({
  zIndex: -1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // pointerEvents: "none",
  userSelect: "none",
  overflow: "hidden",
  flexGrow: 1
});

const previewRule = () => ({
  position: "absolute",
  display: "inline-block",
});

function Index({ filterData }) {
  const { previewStrings } = useContext(OutputFontContext);

  const { css } = useFela();

  return (
    <FilterContextWrapper data={filterData}>
      <div className={css(wrapperRule)}>
        <FontPreview className={css(previewRule)}>
          {previewStrings?.[filterData.identifier] ?? filterData.title}
        </FontPreview>
      </div>
      <Form key={filterData.identifier}></Form>
    </FilterContextWrapper>
  );
}

export default Index;

export function getStaticPaths() {
  return {
    paths: data
      .filter((entry) => entry.type === "filterDetailView" && !entry.isHidden)
      .map((entry) => ({ params: { slug: entry.slug } })),
    fallback: false,
  };
}

export function getStaticProps(context) {
  const filterData = data.find((filter) => filter.slug === context.params.slug);
  return {
    props: { filterData },
  };
}
