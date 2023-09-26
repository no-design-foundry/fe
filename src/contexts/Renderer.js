import React from "react";
import { createRenderer } from "fela";
import { RendererProvider } from "react-fela";
import extend from 'fela-plugin-extend'
import multipleSelectors from 'fela-plugin-multiple-selectors'
import namedKeys from 'fela-plugin-named-keys'

const renderer = createRenderer({
  plugins: [
    extend(),
    namedKeys({
      landscape: '@media (orientation: landscape)',
      portrait: '@media (orientation: portrait)',
    }),
    multipleSelectors()
  ]
});

export default ({children}) => (
  <RendererProvider renderer={renderer}>
    {children}
  </RendererProvider>
);
