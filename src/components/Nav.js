import React from "react";
import { useFela } from "react-fela";
import data from "@/data";
import Link from "next/link";
import { useRouter } from "next/router";

const linkRule = ({
  linkActive,
  aboutLinkActive,
  isHome,
}) => ({
  position: "relative",
  extend: [
    {
      condition: linkActive || aboutLinkActive,
      style: {
        textDecoration: "underline !important",
      },
    },
    {
      condition: isHome,
      style: {
        "& > *:not(:first-child)": {
          position: "absolute",
          left: 0,
          top: 0,
        },
      },
    },
  ],
})

const aboutLinkRule = ({ aboutLinkActive }) => ({
  extend: {
    condition: aboutLinkActive,
    style: {
      textDecoration: "underline !important",
    },
  },
});

const navRule = ({isInFilter}) => ({
  marginBottom: "1em",
  position: "sticky",
  top: 0,
  margin: -14,
  padding: 14,
  zIndex: 1,
  extend: [{
    condition: !isInFilter,
    style: {
      backgroundColor: "white",
    }
  }]
  // left: 14
});

function NavLink({ href, children, identifier, isNew }) {
  const { asPath, query, route } = useRouter();
  const aboutLinkActive = route.endsWith("/about") && ("/" + (query?.slug ?? "")) === href;
  
  const { css } = useFela({
    linkActive: asPath === href,
    aboutLinkActive: aboutLinkActive,
    identifier,
  });
  return (
    <>
      <Link href={href} className={css(linkRule)}>
        {children}
      </Link>
      {isNew && <strong> new!</strong>}
      {(asPath === href || aboutLinkActive) && (
        <>
          <span>, </span>
          <Link href={aboutLinkActive ? href : [href, "about"].filter(part => part?.length > 1).join("/")} className={css(aboutLinkRule)}>
            about
            {/* {aboutLinkActive ? href : [href, "about"].filter(part => part?.length > 1).join("/")} */}
          </Link>
        </>
      )}
    </>
  );
}

function Nav() {
  const router = useRouter();
  const isInFilter = data.some(entry => (entry.type === "filterDetailView") && (router.query.slug === entry.slug));
  const { css } = useFela({isInFilter});

  return (
    <nav className={css(navRule)}>
      <ul>
        <li>
          <NavLink href="/">no design foundry</NavLink>
        </li>
        {data.filter(entry => entry.type === "filterDetailView" && !(entry.isHidden)).map((filter) => (
          <li key={filter.identifier} hidden={router.pathname==="/"}>
            <NavLink
              href={"/" + filter.slug}
              identifier={filter.identifier}
              isNew={filter.isNew}
            >
              {filter.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
