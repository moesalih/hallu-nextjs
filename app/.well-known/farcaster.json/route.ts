import { NextRequest, NextResponse } from 'next/server'

import { appUrl, appDescription, appName } from '@/lib/metadata'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const baseUrl = origin

  let accountAssociation = {}
  if (baseUrl == 'https://sonar.0xmoe.com') {
    accountAssociation = {
      header:
        'eyJmaWQiOjIwNzMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0OERCN2U3MWQxMTUyNjU5MTY5NjE2NzNCOTY4NjcwQTU0N2IwZkJFIn0',
      payload: 'eyJkb21haW4iOiJzb25hci4weG1vZS5jb20ifQ',
      signature: 'yOPKmbi3IO/o7lsBJ0FPhuFCuzMCUhr57zl7lFoyLsUPYfQUg5r2aVDd6HV+VQ0p2jNv/Sar5jVC6bGD9hXjmRs=',
    }
  }
  if (baseUrl == 'https://sonarr.cc') {
    accountAssociation = {
      header:
        'eyJmaWQiOjIwNzMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0OERCN2U3MWQxMTUyNjU5MTY5NjE2NzNCOTY4NjcwQTU0N2IwZkJFIn0',
      payload: 'eyJkb21haW4iOiJzb25hcnIuY2MifQ',
      signature: 'nDidvlwrIMzaKNDk0OI6TyzCuvU0MttGbiKsYTnUKbNzm4MQAcSxm4t949MtMAsuXby1e8/Y8ilPAG00jDc0oBs=',
    }
  }

  const manifest = {
    accountAssociation,
    frame: {
      name: appName,
      version: '1',
      iconUrl: baseUrl + '/icon',
      homeUrl: baseUrl,
      splashImageUrl: baseUrl + '/icon?rounded=1',
      splashBackgroundColor: '#111111',
      primaryCategory: 'social',
      subtitle: appDescription,
      description: appDescription,
      webhookUrl: baseUrl + '/webhook',
      castShareUrl: baseUrl,
      canonicalDomain: 'sonarr.cc',
    },
  }
  return Response.json(manifest)
}
