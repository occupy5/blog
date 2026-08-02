import type { NextRequest } from 'next/server';
import { googleFonts } from 'takumi-js/helpers';
import { ImageResponse } from 'takumi-js/response';

export const runtime = 'nodejs';

const fonts = googleFonts({
  families: [
    {
      name: 'Noto Sans SC',
      weight: 600,
    },
  ],
  timeout: 20_000,
});

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const title = searchParams.get('title');
  const description = searchParams.get('description');

  if (!title) {
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          fontFamily: 'Noto Sans SC',
          background: 'linear-gradient(to bottom, #5b90ff, #86e1fc)',
        }}
        lang='zh-Hans'
      >
        <div
          style={{
            backgroundColor: '#1e2030',
            color: '#c8d3f5',
            fontWeight: 600,
            display: 'flex',
            flexDirection: 'column',
            marginTop: '2rem',
            marginBottom: '2rem',
            marginLeft: '2rem',
            marginRight: '2rem',
            flexGrow: '1',
            borderRadius: '1rem',
          }}
        >
          <p
            style={{
              fontSize: 100,
              marginTop: 'auto',
              marginBottom: 'auto',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            shenn.xyz
          </p>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts,
        headers: {
          'Cache-Control':
            'public, max-age=86400, stale-while-revalidate=604800',
        },
      },
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        fontFamily: 'Noto Sans SC',
        background: 'linear-gradient(to bottom, #5b90ff, #86e1fc)',
      }}
      lang='zh-Hans'
    >
      <div
        style={{
          backgroundColor: '#1e2030',
          color: '#c8d3f5',
          fontWeight: 600,
          display: 'flex',
          flexDirection: 'column',
          marginTop: '2rem',
          marginBottom: '2rem',
          marginLeft: '2rem',
          marginRight: '2rem',
          flexGrow: '1',
          borderRadius: '1rem',
        }}
      >
        <p
          style={{
            fontSize: 50,
            marginTop: '2rem',
            marginBottom: 'auto',
            marginLeft: '4rem',
            marginRight: '4rem',
          }}
        >
          shenn.xyz
        </p>
        <div
          style={{
            fontSize: 70,
            marginLeft: '4rem',
            marginRight: '4rem',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 'auto',
            marginBottom: '2rem',
            marginLeft: '4rem',
            marginRight: '4rem',
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    },
  );
};
