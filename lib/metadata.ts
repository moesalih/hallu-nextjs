export const appName = 'Hallu'
export const appDescription = ''
export const accentColor = '#2299dd'

//////////

export const isProduction = process.env.VERCEL_ENV === 'production'
export const appDomain = isProduction ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL
export const appUrl = appDomain ? `https://${appDomain}` : 'http://localhost:3000'

function generateMiniAppMetadata({ image }) {
  const miniapp = {
    version: '1',
    imageUrl: image || `${appUrl}/opengraph-image`,
    button: {
      title: appName,
      action: {
        type: 'launch_frame',
        name: appName,
        // url: appUrl,
        splashImageUrl: `${appUrl}/icon?rounded=1`,
        splashBackgroundColor: '#111111',
      },
    },
  }
  return miniapp
}

export async function generateMetadataFromProps({ image }) {
  return {
    icons: `${appUrl}/icon?rounded=1`,
    title: appName,
    description: appDescription,
    openGraph: {
      title: appName,
      description: appDescription,
    },
    other: {
      'fc:miniapp': JSON.stringify(generateMiniAppMetadata({ image })),
    },
  }
}
