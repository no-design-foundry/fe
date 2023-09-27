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

const navRule = () => ({
  marginBottom: "1em",
  position: "fixed",
  top: 14,
  left: 14
});

function NavLink({ href, children, identifier }) {
  const { asPath, query, route } = useRouter();
  const aboutLinkActive = route.endsWith("/about") && ("/" + (query?.slug ?? "")) === href;
  // console.log(query?.slug, href)
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
  const { css } = useFela();
  return (
    <nav className={css(navRule)}>
      <ul>
        <li>
          <NavLink href="/">no design foundry</NavLink>
        </li>
        {data.map((filter) => (
          <li key={filter.identifier}>
            <NavLink
              href={"/" + filter.slug}
              colors={filter.layerColors}
              identifier={filter.identifier}
              variableSliders={filter.variableFontControlSliders}
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
