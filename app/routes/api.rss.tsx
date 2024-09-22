// routes/api/rss.tsx
import { json, LoaderFunction } from '@remix-run/node';
import prisma from '~/db/client';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const feedUrl = url.searchParams.get('url');

  if (!feedUrl) {
    return json({ error: 'URL not provided' }, { status: 400 });
  }

  try {
    // ホスト名を抽出
    const hostname = new URL(feedUrl).hostname;

    // ホスト名からメディア情報を取得
    const media = await prisma.media.findUnique({
      where: { hostname: hostname },
    });

    if (!media) {
      return json({ error: 'Media not found' }, { status: 404 });
    }

    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    return json({ xmlText, media });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
