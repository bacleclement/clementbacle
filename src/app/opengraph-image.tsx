import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Clément Bacle — Software Engineer & AI Builder'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F0F12',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#E85C30',
            fontSize: 13,
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 48,
          }}
        >
          clementbacle.dev
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#F5F0EB',
              fontSize: 64,
              fontFamily: 'serif',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex' }}>I build software</div>
            <div style={{ display: 'flex' }}>and AI workflows —</div>
            <div style={{ display: 'flex' }}>then write about both.</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: '#636059',
            fontSize: 16,
            fontFamily: 'monospace',
            letterSpacing: '0.04em',
          }}
        >
          Clément Bacle · senior fullstack engineer · Lille, France
        </div>
      </div>
    ),
    size,
  )
}
