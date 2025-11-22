const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for Docker deployment
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      { // MinIO storage support (if configured)
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || "",
      },
      { // Demo product images (can be removed after seeding your own products)
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      { // Demo product images (can be removed after seeding your own products)
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      { // Demo product images (can be removed after seeding your own products)
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ].filter(pattern => pattern.hostname), // Remove empty hostnames
  },
}

module.exports = nextConfig
