// routes/api/rss.tsx
import { json, LoaderFunction } from '@remix-run/node';
import prisma from '~/db/client';
import { JSDOM } from 'jsdom';

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
    const dom = new JSDOM(xmlText, { contentType: 'text/xml' });
    const document = dom.window.document;

    const feed = {
      feed: {
        title:
          document.querySelector(media.feed_title_selector)?.textContent ||
          'No title',
        description:
          document.querySelector(media.feed_desc_selector)?.textContent ||
          'No description',
      },
      items: Array.from(document.querySelectorAll(media.item_selector)).map(
        (item) => ({
          title: item.querySelector(media.item_title_selector)?.textContent,
          link: item.querySelector(media.item_link_selector)?.textContent,
          description: item.querySelector(media.item_desc_selector)
            ?.textContent,
          pubDate: item.querySelector(media.item_pubdate_selector)?.textContent,
        })
      ),
    };

    return json({ feed });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
