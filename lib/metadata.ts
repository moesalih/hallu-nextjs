export const appName = 'Sonar'
export const appDescription = 'Farcaster Explorer'
export const accentColor = '#7755ee'

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
