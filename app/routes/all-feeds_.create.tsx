import { useState } from 'react';
import { Form, redirect, useParams } from '@remix-run/react';
import { json, ActionFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import prisma from '~/db/client';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const feedUrl = formData.get('feed-url') as string;
  const feedTitle = formData.get('feed-title') as string;
  const feedDescription = formData.get('feed-description') as string;
  const feedLastUpdated = formData.get('feed-last-updated') as string;
  const mediaId = formData.get('media-id') as string;

  // const { folderId, feedId } = await request.json();

  try {
    const existingFeed = await prisma.feeds.findFirst({
      where: { url: feedUrl },
    });

    let newFeed;
    if (!existingFeed) {
      // If the feed doesn't exist, create a new one
      newFeed = await prisma.feeds.create({
        data: {
          url: feedUrl,
          title: feedTitle,
          description: feedDescription,
          last_updated: new Date(feedLastUpdated),
          media_id: parseInt(mediaId),
        },
      });
    } else {
      newFeed = existingFeed;
    }

    // return json({ newFeed }, { status: 201 });
    return redirect(`/all-feeds`);
  } catch (error) {
    console.error('Error registering feed:', error);
    return json({ message: 'Failed to register feed' }, { status: 500 });
  }
};

export default function AddFeed() {
  const folderId = useParams().id;

  const [feedUrl, setFeedUrl] = useState('');
  const [mediaId, setMediaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedData, setFeedData] = useState<any>(null);

  const fetchRssFeed = async () => {
    console.log('Fetching RSS feed:', feedUrl);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/rss?url=${encodeURIComponent(feedUrl)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Network response was not ok: ${JSON.stringify(errorData)}`
        );
      }

      const { feed } = await response.json();
      setFeedData(feed);
      setMediaId(feed.mediaId);
    } catch (err: any) {
      setError(`Failed to fetch RSS feed: ${err.message}`);
      console.error('Error fetching RSS feed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow overflow-auto p-6">
      <CardHeader>
        <CardTitle className="text-xl">Add New RSS Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="url"
            placeholder="Enter RSS feed URL"
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            aria-label="RSS feed URL"
          />
          <Button onClick={fetchRssFeed} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Feed'}
          </Button>
        </div>

        {error && (
          <p className="text-red-500 mb-4" role="alert">
            {error}
          </p>
        )}

        {feedData && (
          <Form method="post" className="space-y-8">
            <input type="hidden" name="feed-url" value={feedUrl} />
            <input
              type="hidden"
              name="feed-title"
              value={feedData.feed.title}
            />
            <input
              type="hidden"
              name="feed-description"
              value={feedData.feed.description}
            />
            <input
              type="hidden"
              name="feed-last-updated"
              value={feedData.feed.lastUpdated}
            />
            <input type="hidden" name="media-id" value={mediaId} />
            <input type="hidden" name="folder-id" value={folderId} />

            <div className="rounded  pt-4  bg-white">
              <h2 className="text-2xl font-bold">{feedData.feed.title}</h2>
              <p className="text-gray-700">{feedData.feed.description}</p>
              <p className="text-gray-700">Media ID : {mediaId}</p>
              <p className="text-gray-700">
                Last Updated : {feedData.feed.lastUpdated}
              </p>
            </div>

            <Button>Register Feed</Button>

            <h3 className="text-lg font-semibold">Recent Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedData.items.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white"
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-gray-50 transition"
                  >
                    {item.ogImage && (
                      <img
                        src={item.ogImage}
                        alt="OG"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-700 mb-2">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </Form>
        )}
      </CardContent>
    </main>
  );
}
