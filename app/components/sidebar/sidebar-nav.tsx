import { Button } from '~/components/ui/button';
import HomeIcon from '~/components/icons/home';
import FolderIcon from '~/components/icons/folder';
import { Separator } from '~/components/ui/separator';
import { Link } from '@remix-run/react';
import MediaListIcon from '~/components/icons/media';
import AllFeedsIcon from '../icons/all-feeds';

export default function SidebarNav() {
  return (
    <>
      <Link to="/">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
        >
          <HomeIcon className="h-4 w-4" />
          Trend
        </Button>
      </Link>
      <Link to="/media">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
        >
          <MediaListIcon className="h-4 w-4" />
          MediaList
        </Button>
      </Link>
      <Link to="/all-feeds">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
        >
          <AllFeedsIcon className="h-4 w-4" />
          All Feeds
        </Button>
      </Link>
      <Separator className="my-2" />
    </>
  );
}
