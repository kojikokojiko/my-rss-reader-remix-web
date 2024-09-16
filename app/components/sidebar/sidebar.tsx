import SidebarNav from './sidebar-nav';
import SubscribedFeeds from './subscribed-feeds';
import { ScrollArea } from '~/components/ui/scroll-area';
import type { RssFeed } from '~/types/rssFeed';
import { Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import RssIcon from '~/components/icons/rss';

interface SidebarProps {
  folders: { id: string; name: string; title: string }[];
}
export default function Sidebar({ folders }: SidebarProps) {
  console.log('Folders:', folders);
  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
      <ScrollArea className="w-64 border-r">
        <nav className="flex flex-col gap-2 p-4">
          <SidebarNav />
          <div className="text-xs font-medium text-muted-foreground ">
            Subscribed Feeds
          </div>
          {/* <ScrollArea className="flex-1 overflow-auto "> */}
          <div className="grid gap-1 p-2">
            {folders.map((folder) => (
              <FeedButton key={folder.id} label={folder.name} id={folder.id} />
            ))}
          </div>
          {/* </ScrollArea> */}
        </nav>
      </ScrollArea>
    </aside>
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
