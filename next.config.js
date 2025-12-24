/*
const MiddlewareWebpackPlugin =
  require("@middleware.io/sourcemap-uploader/dist/webpack-plugin").default;

const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new MiddlewareWebpackPlugin(
        "zuxpjjypnejbbwhkvkobudfitutobptgonae", // Account key of the application.
        "2.0.0", // Application verison
        ".next/", // By default path of next.js where sourcemap resides.
        ".next/" // Base path where your sourcemap will reside after upload.
      )
    );

    if (isServer) {
      config.devtool = "source-map";
    }
    return config;
  },
  experimental: {
    serverSourceMaps: true,
    instrumentationHook: true,
    serverComponentsExternalPackages: ['@middleware.io/agent-apm-nextjs'],
  },
};
module.exports = nextConfig;
*/
/*
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    // serverComponentsExternalPackages: ['@middleware.io/agent-apm-nextjs']
  }
}
module.exports = nextConfig*/
