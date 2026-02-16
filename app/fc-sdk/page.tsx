'use client'

import fcsdk from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

import { DeveloperIcon } from '@/lib/components/icons'
import { TitleHeader } from '@/lib/components/misc'
import { Input, MonoButtonWithStatus, Section } from '@/lib/components/ui'
import { appUrl } from '@/lib/metadata'
import { formatAddress, formatJSON } from '@/lib/utils/format'

export default function FarcasterMiniApp() {
  const [context, setContext] = useState<any>()
  const [walletAddresses, setWalletAddresses] = useState<any>()

  useEffect(() => {
    fcsdk.actions.ready()
    fcsdk.context.then(setContext)
    fcsdk.wallet?.ethProvider?.request({ method: 'eth_requestAccounts' }).then(setWalletAddresses).catch(console.log)
  }, [])

  const [pattern, setPattern] = useState('')
  const [customEmbedUrl, setCustomEmbedUrl] = useState('')

  // console.log(fcsdk, context, walletAddresses)

  return (
    <div>
      <TitleHeader
        Icon={DeveloperIcon}
        title="Farcaster SDK"
        shareText={`Check out Farcaster SDK demo on Sonar.\n\n\n✴︎ mini app by @moe!\n`}
      />

      <div className="flex flex-col gap-3 m-4">
        {context && (
          <>
            {context?.user?.fid && (
              <Section>
                <div className="text-sm  opacity-50 mb-3 uppercase">User</div>
                <div className="flex flex-row gap-3 items-center">
                  <img className="rounded-full w-10 h-10" src={context?.user?.pfpUrl} />
                  <div className="font-semibold text-xl">{context?.user?.username}</div>
                  <div className="text-sm opacity-50 pt-1">{context?.user?.fid}</div>
                </div>
              </Section>
            )}

            {walletAddresses?.length > 0 && (
              <Section>
                <div className="text-sm  opacity-50 mb-3 uppercase">Wallet</div>
                <div className="font-mono font-medium text-xl mb-4">{formatAddress(walletAddresses[0])}</div>

                <div className="flex flex-col flex-wrap gap-3 items-start">
                  <MonoButtonWithStatus
                    onClick={() =>
                      fcsdk.wallet?.ethProvider?.request({
                        method: 'eth_chainId',
                      })
                    }
                  >
                    chainId
                  </MonoButtonWithStatus>
                  <MonoButtonWithStatus
                    onClick={() =>
                      fcsdk.wallet?.ethProvider?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x2105' }],
                      })
                    }
                  >
                    switchEthereumChain (base)
                  </MonoButtonWithStatus>
                  <MonoButtonWithStatus
                    onClick={() =>
                      fcsdk.wallet?.ethProvider?.request({
                        method: 'eth_sendTransaction',
                        params: [
                          {
                            from: walletAddresses[0],
                            to: '0x5F77DBc7686327D3BF6eC1887E5a3AdA0aE60841',
                            value: ('0x' + (100000000000000).toString(16)) as `0x${string}`,
                          },
                        ],
                      })
                    }
                  >
                    sendTransaction
                  </MonoButtonWithStatus>
                  <MonoButtonWithStatus
                    onClick={() =>
                      fcsdk.wallet?.ethProvider?.request({
                        method: 'eth_signTypedData_v4',
                        params: [
                          walletAddresses[0],
                          JSON.stringify({
                            domain: {
                              name: 'Frames v2 Demo',
                              version: '1',
                              chainId: 8453,
                            },
                            types: {
                              EIP712Domain: [
                                { name: 'name', type: 'string' },
                                { name: 'version', type: 'string' },
                                { name: 'chainId', type: 'uint256' },
                              ],
                              Message: [{ name: 'content', type: 'string' }],
                            },
                            message: {
                              content: 'Hello from Frames v2!',
                            },
                            primaryType: 'Message',
                          }),
                        ],
                      })
                    }
                  >
                    signTypedData_v4
                  </MonoButtonWithStatus>
                </div>
              </Section>
            )}

            <Section>
              <div className="font-mono text-sm  opacity-50 mb-3">sdk.actions</div>
              <div className="flex flex-col flex-wrap gap-3 items-start">
                <MonoButtonWithStatus onClick={() => fcsdk.actions.viewProfile?.({ fid: 3 })}>
                  viewProfile
                </MonoButtonWithStatus>
                <MonoButtonWithStatus
                  onClick={() => fcsdk.actions.viewCast?.({ hash: '0xd81f802e98c1432bb698cb7d4cb6c2ff5057867d' })}
                >
                  viewCast
                </MonoButtonWithStatus>

                <MonoButtonWithStatus
                  onClick={() =>
                    fcsdk.actions.composeCast?.({ text: 'Hello', embeds: [global?.window?.location.origin] })
                  }
                >
                  composeCast
                </MonoButtonWithStatus>

                <Input
                  size="sm"
                  onChange={(e) => setCustomEmbedUrl(e.target.value)}
                  placeholder="Custom Embed URL (e.g. https://example.com)"
                  type="text"
                  autocomplete="off"
                  value={customEmbedUrl}
                />
                {customEmbedUrl && (
                  <MonoButtonWithStatus
                    onClick={() => fcsdk.actions.composeCast?.({ text: 'Hello', embeds: [customEmbedUrl] })}
                  >
                    composeCast (custom embed url)
                  </MonoButtonWithStatus>
                )}

                <MonoButtonWithStatus
                  onClick={() => fcsdk.actions.openUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                >
                  openUrl
                </MonoButtonWithStatus>
                <MonoButtonWithStatus
                  onClick={() => fcsdk.actions.openMiniApp({ url: 'https://miniapp-starter.val.run/' })}
                >
                  openMiniApp
                </MonoButtonWithStatus>
                {/* <MonoButtonWithStatus onClick={() => fcsdk.actions.openUrl('https://warpcast.com/~/compose')}>
                openUrl (warpcast)
              </MonoButtonWithStatus> */}
                <MonoButtonWithStatus onClick={() => fcsdk.actions.setPrimaryButton({ text: 'Primary Button' })}>
                  setPrimaryButton
                </MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.actions.addMiniApp()}>addMiniApp</MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.actions.signIn({} as any)}>signIn</MonoButtonWithStatus>

                <MonoButtonWithStatus onClick={() => fcsdk.actions.requestCameraAndMicrophoneAccess()}>
                  requestCameraAndMicrophoneAccess
                </MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.actions.close()}>close</MonoButtonWithStatus>

                <MonoButtonWithStatus
                  onClick={() =>
                    fcsdk.actions.swapToken({
                      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                      buyToken: 'eip155:8453/native',
                      sellAmount: '3000000',
                    })
                  }
                >
                  swapToken
                </MonoButtonWithStatus>
                <MonoButtonWithStatus
                  onClick={() =>
                    fcsdk.actions.sendToken({
                      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                      amount: '500000',
                      recipientFid: 2073,
                    })
                  }
                >
                  sendToken
                </MonoButtonWithStatus>
                <MonoButtonWithStatus
                  onClick={() =>
                    fcsdk.actions.viewToken({
                      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                    })
                  }
                >
                  viewToken
                </MonoButtonWithStatus>
              </div>
            </Section>

            <Section>
              <div className="font-mono text-sm  opacity-50 mb-3">other</div>
              <div className="flex flex-col flex-wrap gap-3 items-start">
                <MonoButtonWithStatus onClick={() => fcsdk.quickAuth.getToken()}>
                  quickAuth.getToken
                </MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.getCapabilities()}>getCapabilities</MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.getChains()}>getChains</MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.isInMiniApp()}>isInMiniApp</MonoButtonWithStatus>
              </div>
            </Section>

            <Section>
              <div className="font-mono text-sm  opacity-50 mb-3">sdk.haptics</div>
              <div className="flex flex-col flex-wrap gap-3 items-start">
                <MonoButtonWithStatus onClick={() => fcsdk.haptics?.notificationOccurred?.('success')}>
                  haptics (success notification)
                </MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.haptics?.impactOccurred?.('heavy')}>
                  haptics (heavy impact)
                </MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => fcsdk.haptics?.selectionChanged?.()}>
                  haptics (selection)
                </MonoButtonWithStatus>
              </div>
            </Section>

            <Section>
              <div className="font-mono text-sm  opacity-50 mb-3">Custom Haptics</div>
              <div className="flex flex-col flex-wrap gap-3 items-start">
                <MonoButtonWithStatus onClick={() => hapticsPattern('... * * ...')}>
                  haptics (pattern: ... * * ...)
                </MonoButtonWithStatus>
                <MonoButtonWithStatus onClick={() => hapticsPattern('......')}>
                  haptics (pattern: ......)
                </MonoButtonWithStatus>

                <Input
                  size="md"
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Custom Pattern (e.g. ... * * ...)"
                  type="text"
                  autocomplete="off"
                  value={pattern}
                />
                {pattern && (
                  <MonoButtonWithStatus onClick={() => hapticsPattern(pattern)}>haptics (custom)</MonoButtonWithStatus>
                )}
              </div>
            </Section>

            <ExpandableSection title="sdk.context" defaultExpanded>
              {formatJSON(context)}
            </ExpandableSection>
          </>
        )}

        {!context && (
          <Section>
            <div className="text-md  opacity-50 ">
              Farcaster is an open, programmable social network designed for developers to build mini apps with
              integrated user authentication and financial features. Mini apps on Farcaster can be shared directly
              within the social feed and installed in users' primary Farcaster clients, enabling seamless access and
              real-time notifications from the mini apps themselves.
              <br />
              <br />
              Open this web app in{' '}
              <a href="https://farcaster.xyz" target="_blank" className="underline">
                Farcaster
              </a>{' '}
              to see the Mini App.
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Section>
      <div className="flex flex-row gap-3 items-center justify-between">
        <div className="font-mono text-sm  opacity-50">{title}</div>
        <div className="text-sm cursor-pointer opacity-50 p-1" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {expanded && <div className="font-mono text-xs opacity-50 whitespace-pre-wrap break-all mt-1">{children}</div>}
    </Section>
  )
}

async function hapticsPattern(pattern: string) {
  function delay(ms?: number) {
    return new Promise((resolve) => setTimeout(resolve, ms || 150))
  }
  function hapticsChar(char: string) {
    if (char === 's') return fcsdk.haptics?.notificationOccurred?.('success').then(() => delay())
    if (char === '*') return fcsdk.haptics?.impactOccurred?.('heavy').then(() => delay())
    if (char === '.') return fcsdk.haptics?.selectionChanged?.().then(() => delay())
    if (char === ' ') return delay()
  }
  const chars = pattern.replace(/…/g, '...').split('') || []
  for (const char of chars) {
    await hapticsChar(char)
  }
}
// hapticsPattern('... * * ...')
