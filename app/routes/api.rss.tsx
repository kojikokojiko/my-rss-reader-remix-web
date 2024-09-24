// routes/api/rss.tsx
import { json, LoaderFunction } from '@remix-run/node';
import prisma from '~/db/client';
import { JSDOM } from 'jsdom';

// OGPデータ取得関数
const fetchOGPData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch the URL: ${response.statusText}`);
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const getMetaContent = (property: string) => {
      const element = document.querySelector(`meta[property='${property}']`);
      return element ? element.getAttribute('content') : null;
    };

    return {
      ogImage: getMetaContent('og:image'),
    };
  } catch (error) {
    console.error(`Error fetching OGP data for ${url}:`, error);
    return {
      ogImage: null,
    };
  }
};
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

    // 各記事のOGPデータを並列処理で取得
    const items = await Promise.all(
      Array.from(document.querySelectorAll(media.item_selector)).map(
        async (item) => {
          const title = item.querySelector(
            media.item_title_selector
          )?.textContent;
          const link = item.querySelector(
            media.item_link_selector
          )?.textContent;
          const description = item.querySelector(
            media.item_desc_selector
          )?.textContent;
          const pubDate = item.querySelector(
            media.item_pubdate_selector
          )?.textContent;

          // OGPデータを取得
          const ogpData = link ? await fetchOGPData(link) : { ogImage: null };

          return {
            title,
            link,
            description,
            pubDate,
            ...ogpData, // OGPデータを展開
          };
        }
      )
    );

    const feed = {
      mediaId: media.id,
      feed: {
        title:
          document.querySelector(media.feed_title_selector)?.textContent ||
          'No title',
        description:
          document.querySelector(media.feed_desc_selector)?.textContent ||
          'No description',
        lastUpdated:
          document.querySelector(media.feed_last_updated_selector)
            ?.textContent || 'No date',
      },
      items,
    };

    return json({ feed });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
