import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { renderToNodeList } from "react-fela";
import getFelaRenderer from "../getFelaRenderer";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const renderer = getFelaRenderer();

    // renderer.renderStatic({background: colors.main}, "html,body,[data-sticky]");

    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => <App {...props} renderer={renderer} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = renderToNodeList(renderer);
    return {
      ...initialProps,
      styles: [...initialProps.styles, ...styles],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <script data-goatcounter="https://nodesignfoundry.goatcounter.com/count" src="/count.js" async defer></script>
          
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96-light.png" media="(prefers-color-scheme: light)" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96-dark.png" media="(prefers-color-scheme: dark)" />
          
          <meta name="description" content="Apply effects on your fonts ✌. Rotorize, Rasterize, ..."/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
