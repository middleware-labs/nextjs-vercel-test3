// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add your custom meta tags here */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Add your external scripts here */}
          <script
            src="https://cdnjs.middleware.io/browser/libs/0.0.1/middleware-rum.min.js"
            type="text/javascript"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (window.Middleware){
                  Middleware.track({
                    serviceName:"Testing Python & Next.js3.4",
                    projectName:"Testing Python & Next.js3.4",
                    accountKey:"mneotgoiuddsxemqjncpbdskjipwwksqnpfj",
                    target:"https://p2i13hg.middleware.io",
                    tracePropagationTargets: [/nextjs-vercel-test3.vercel.app/i, /localhost:3000/i]
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
