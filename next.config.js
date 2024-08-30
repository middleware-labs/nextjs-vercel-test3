const nextConfig = {
    experimental: {
        instrumentationHook: true,
        serverComponentsExternalPackages: ['@middleware.io/agent-apm-nextjs']
    }
}
module.exports = nextConfig
