import { Link } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import RssIcon from '~/components/icons/rss';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link to="/" className="flex items-center gap-2">
        <RssIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">My RSS Reader</span>
      </Link>
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search feeds..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <img
              src="/favicon.ico"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
              style={{ aspectRatio: '36/36', objectFit: 'cover' }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
