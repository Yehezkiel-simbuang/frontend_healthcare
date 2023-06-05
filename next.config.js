/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

module.exports = {
    nextConfig,
    images: { loader: "custom" },
    env: {
        NEXT_PUBLIC_WEB3_TOKEN: process.env.NEXT_PUBLIC_WEB3_TOKEN,
    },
};
