module.exports = {
  images: {
    domains: ['cdn.sanity.io'],
    loader: 'custom',
    // Trimmed from the Next defaults to cut the number of srcset variants
    // (fewer URLs for crawlers to fetch) and cap the largest delivered width
    // at 1920px — no page on the site needs a wider image.
    deviceSizes: [640, 750, 828, 1080, 1920],
    imageSizes: [160, 256, 384],
  },
}
