/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        domains: ['localhost'],
        unoptimized: true,
    },
};

module.exports = nextConfig;
