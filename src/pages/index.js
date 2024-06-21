import data from "@/data";
import Link from "next/link";
import React from "react";
import { useFela } from "react-fela";
import FilterThumbnail from "@/components/FilterThumbnail";

const sectionRule = () => ({
  marginTop: "1em",
});

const postUlRule = () => ({
  fontFamily: "cursive",
  listStyleType: "disc",
  marginLeft: "2.5ch",
});

const lottieGridRule = () => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px 4px",
  untilTabletS: {
    display: "flex",
    flexDirection: "column"
  }
});

function Index() {
  const { css } = useFela();

  return (
    <div>
      <div className={css(lottieGridRule, sectionRule)}>
        {
          data.filter((entry) => entry.type === "filterDetailView" && !(entry.isHidden)).map((entry) => (
            <div key={entry.slug}>
              <Link href={entry.slug}>
                <div>{entry.title}</div>
                <FilterThumbnail slug={entry.slug}/>
              </Link>
            </div>
          ))
        }
      </div>
      <div className={css(sectionRule)}>
        <div>Posts</div>
        <ul className={css(postUlRule)}>
          {data
            .filter((entry) => entry.type === "post")
            .map((entry) => (
              <li key={entry.slug}>
                <Link href={`post/${entry.slug}`}>{entry.title}</Link>
              </li>
            ))}
        </ul>
        </div>
    </div>
  );
}

export default Index;
