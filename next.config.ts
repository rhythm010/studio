import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
 allowedDevOrigins: [
 '8080-idx-companion1-1746542574812.cluster-6frnii43o5blcu522sivebzpii.cloudworkstations.dev'
  ],
};

export default nextConfig;
