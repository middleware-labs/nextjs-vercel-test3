/*
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://cdnjs.middleware.io/browser/libs/0.0.1/middleware-rum.min.js" type="text/javascript" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (window.Middleware){
                  Middleware.track({
                    serviceName:"TestingNext.js3.1.0",
                    projectName:"TestingNext.js3.1.0",
                    accountKey:"nvvsoiamyzypphdxrdvcqkmfksukkfsjggju",
                    target:"https://demo.middleware.io",
                    tracePropagationTargets: [/nextjs-vercel-test3.vercel.app/i,/localhost:3000/i]
                  });
                }
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
*/
