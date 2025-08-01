const MiddlewareWebpackPlugin =
  require("@middleware.io/sourcemap-uploader/dist/webpack-plugin").default;

const nextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["@middleware.io/agent-apm-nextjs"],
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new MiddlewareWebpackPlugin(
        "lneevcqdcnzccpdpbhelkxpjffdxeznkryvb", // Account key of the application.
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
};
module.exports = nextConfig;
