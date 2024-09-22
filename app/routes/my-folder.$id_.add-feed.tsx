import { useState, useEffect } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useParams, useOutletContext } from '@remix-run/react';
import { json } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import prisma from '~/db/client';
import PlusIcon from '~/components/icons/plus';
import { ExternalLink } from 'lucide-react';
import { Entry } from '~/types/entry';

export default function AddFeed() {
  // const { setFolderId } = useOutletContext<{
  //   setFolderId: (id: string) => void;
  // }>();
  const folderId = useParams().id;

  const [feedUrl, setFeedUrl] = useState('');
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
    } catch (err: any) {
      setError(`Failed to fetch RSS feed: ${err.message}`);
      console.error('Error fetching RSS feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerFeed = async () => {
    // Implement this function
  };

  return (
    <main className="flex-grow overflow-auto p-6">
      {/* <Card className="w-full max-w-3xl mx-auto"> */}
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
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{feedData.feed.title}</h2>
            <p>{feedData.feed.description}</p>
            <h3 className="text-lg font-semibold">Recent Items</h3>
            <ul className="list-disc pl-5 space-y-2">
              {feedData.items.slice(0, 5).map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p> {/* 記事の概要を表示 */}
                      {/* 発行日 */}
                      <span className="text-gray-500 text-sm">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </span>
                    </div>
                    <ExternalLink
                      className="ml-1 h-4 w-4"
                      aria-label="External link"
                    />
                  </a>
                </li>
              ))}
            </ul>
            <Button onClick={registerFeed}>Register Feed</Button>
          </div>
        )}
      </CardContent>
      {/* </Card> */}
    </main>
  );
}
