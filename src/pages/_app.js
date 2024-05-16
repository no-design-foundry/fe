import React from "react";
import BaseApp from "next/app";
import FelaProvider from "../FelaProvider";
import { OutputFontContextWrapper } from "@/contexts/OutputFontContext";
import Nav from "@/components/Nav";
import style from "@/style.scss";
import { InputMemoryContextWrapper } from "@/contexts/InputMemoryContext";
import Head from "next/head";

const titles = {
  "/about": "about",
  "/rasterizer": "Rastr",
  "/rasterizer/about": "about Rastr",
  "/rotorizer": "Rotorizer",
  "/rotorizer/about": "about Rotorizer",
}

function getTitle(key) {
  if (key in titles) {
    return ` - ${titles[key]}`;
  }
  else {
    return "";
  } 
}

class App extends BaseApp {
  render() {
    const { Component, pageProps, renderer, router } = this.props;

    return (
      <FelaProvider renderer={renderer}>
        <OutputFontContextWrapper>
          <InputMemoryContextWrapper>
            <Nav />
            <Head>
              <title>{"ndf" + getTitle(router?.asPath)}</title>
            </Head>
            <Component {...pageProps} />
          </InputMemoryContextWrapper>
        </OutputFontContextWrapper>
      </FelaProvider>
    );
  }
}

export default App;
