import React from "react";
import BaseApp from "next/app";
import FelaProvider from "../FelaProvider";
import {OutputFontContextWrapper} from "@/contexts/OutputFontContext";
import { FilterContextWrapper } from "@/contexts/FilterContext";
import Nav from "@/components/Nav";
import style from "@/style.scss"

class App extends BaseApp {
  render() {
    const { Component, pageProps, renderer, router } = this.props;

    return (
      <FelaProvider renderer={renderer}>
        <OutputFontContextWrapper>
            <Nav/>
            <Component {...pageProps} />
        </OutputFontContextWrapper>
      </FelaProvider>
    );
  }
}

export default App;
