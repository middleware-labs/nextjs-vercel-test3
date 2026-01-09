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
/*const nextConfig = {
  experimental: {
    instrumentationHook: true,
    // serverComponentsExternalPackages: ['@middleware.io/agent-apm-nextjs'] // Not needed with @vercel/otel
  }
}

module.exports = nextConfig*/

 // BACKUP: Old code with @middleware.io/agent-apm-nextjs
/*const nextConfig = {
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['@middleware.io/agent-apm-nextjs']
  }
}
module.exports = nextConfig*/

// Next.js configuration with redirects to generate redirect logs
const nextConfig = {
  // Redirects configuration - these will generate redirect logs in Vercel
  async redirects() {
    return [
      {
        source: '/old-home',
        destination: '/',
        permanent: false, // 307 Temporary Redirect - generates redirect logs
      },
      {
        source: '/legacy',
        destination: '/',
        permanent: true, // 308 Permanent Redirect - generates redirect logs
      },
      {
        source: '/redirect-test',
        destination: '/person/1',
        permanent: false,
      },
      {
        source: '/old-api/:path*',
        destination: '/api/:path*',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
