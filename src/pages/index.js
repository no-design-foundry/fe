import data from "@/data";
import Link from "next/link";
import React from "react";
import { useFela } from "react-fela";
import FilterThumbnail from "@/components/FilterThumbnail";

const sectionRule = () => ({
  marginTop: "1em",
});

const filterThumbnailWrapperRule = () => ({
  display: "flex",
  flexDirection: "column",
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
  "untilTabletS,noHover": {
    display: "flex",
    flexDirection: "column",
  },
});

const titleWrapperRule = () => ({
  display: "flex",
  justifyContent: "space-between",
});

function Index({ draftMode }) {
  const { css } = useFela();

  return (
    <div>
      <div className={css(lottieGridRule, sectionRule)}>
        {data
          .filter(
            (entry) => entry.type === "filterDetailView"
            // && (draftMode ? true : !entry.isHidden)
          )
          .map((entry) => (
            <div key={entry.slug} className="hover-area">
              {React.createElement(
                entry.isHidden
                  ? (props) => React.createElement("div", props)
                  : Link,
                {
                  className: css(filterThumbnailWrapperRule),
                  ...(entry.isHidden ? {} : { href: entry.slug }),
                },
                <>
                  <div className={css(titleWrapperRule)}>
                    <span>{entry.title}</span>
                    <span className="hover-child">
                      {entry.isHidden ? "Coming Soon!" : "See More"}
                    </span>
                  </div>
                  <FilterThumbnail
                    slug={entry.slug}
                    isPreview={entry.isHidden}
                    scaleThumbnailOnMobile={entry.scaleThumbnailOnMobile}
                  />
                </>
              )}
            </div>
          ))}
        {/* <div>
          <div>New stuff!</div>
          <div>
            <button onClick={handleOnNotification}>Get Notified</button>
            <button onClick={handleOnNotification}>Get Notified</button>
            <button onClick={handleOnNotification}>Get Notified</button>
            <button onClick={handleOnNotification}>Get Notified</button>
            <button onClick={handleOnNotification}>Get Notified</button>
          </div>
        </div> */}
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

export function getStaticProps({ draftMode = false }) {
  return {
    props: { draftMode },
  };
}
