import { Link, useLoaderData, useLocation } from '@remix-run/react';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

interface Feed {
  id: number;
  title: string;
  url: string;
}

interface MyFeed {
  feed: Feed;
}

interface MyFolderLayoutProps {
  feeds: MyFeed[];
  children: React.ReactNode;
}

export const MyFolderLayout: React.FC<MyFolderLayoutProps> = ({
  myFeeds,
  children,
}) => {
  const location = useLocation();

  return (
    <div className="flex overflow-hidden">
      {children}
      <ScrollArea className="w-96 border-l border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">FEEDS</h3>
          {!location.pathname.endsWith('/add-feed') && (
            <Link
              to={`${location.pathname}/feeds`}
              onClick={() => console.log('Link clicked!')}
            >
              <Button variant="outline" size="sm">
                ＋
              </Button>
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {myFeeds.map((myFeed) => {
            const title = myFeed.feed.title || 'Unnamed Feed';
            return (
              <Card key={myFeed.feed.id}>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage alt={title} />
                      <AvatarFallback>{title[0]}</AvatarFallback>
                    </Avatar>
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-gray-500">{myFeed.feed.url}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
