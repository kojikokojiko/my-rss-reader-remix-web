// routes/myfeeds.tsx
import { Button } from '~/components/ui/button';
// import { ScrollArea } from '~/components/ui/scroll-area';
import RssIcon from '~/components/icons/rss';
import { Link, useLoaderData } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import prisma from '~/db/client';
import { RssFeed } from '~/types/rssFeed';

// export const loader: LoaderFunction = async () => {
//   try {
//     const folders = await prisma.entries.findMany();
//     console.log(folders); // デバッグ用に確認
//     console.log('nul'); // デバッグ用に確認
//     return json({ folders });
//   } catch (err) {
//     console.error('Error fetching folders:', err); // エラーを表示
//     return json({ folders: [] });
//   }
// };
export const loader: LoaderFunction = async () => {
  const rssFeeds: RssFeed[] = await prisma.entries.findMany();
  return json(rssFeeds);
};

// interface LoaderData {
//   folders: { id: string; name: string }[];
// }

export default function SubscribedFeeds() {
  // const data = useLoaderData(); // 型定義を明示的に
  const rssFeeds = useLoaderData<RssFeed[]>();
  // //データの表示確認 (デバッグ用)
  console.log(rssFeeds);
  // const { folders } = data || { folders: [] }; // デフォルト値

  return (
    <>
      <div className="text-xs font-medium text-muted-foreground ">
        Subscribed Feeds
      </div>
      {/* <ScrollArea className="flex-1 overflow-auto "> */}
      <div className="grid gap-1 p-2">
        {rssFeeds.map((feed) => (
          <FeedButton key={feed.id} label={feed.title} id={feed.id} />
        ))}
      </div>
      {/* </ScrollArea> */}
    </>
  );
}

interface FeedButtonProps {
  label: string;
  id: string;
}

function FeedButton({ label, id }: FeedButtonProps) {
  return (
    <Link to={`/my-feed/${id}`}>
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
      >
        <RssIcon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
