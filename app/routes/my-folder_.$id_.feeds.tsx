import { Form, Link, useLoaderData, useParams } from '@remix-run/react';
import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import prisma from '~/db/client';

// Loader function to fetch feeds from the database
export const loader: LoaderFunction = async ({ params }) => {
  const folderId = parseInt(params.id as string, 10);
  const feedList = await prisma.feeds.findMany();
  const myFeeds = await prisma.my_feeds.findMany({
    where: { folder_id: folderId },
    select: { feed_id: true },
  });
  const myFeedIds = new Set(myFeeds.map((feed) => feed.feed_id));

  return json({ feedList, myFeedIds: Array.from(myFeedIds), folderId });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const feedId = parseInt(formData.get('feedId') as string, 10);
  const folderId = parseInt(formData.get('folderId') as string, 10);
  const action = formData.get('action') as string;

  if (action === 'register') {
    await prisma.my_feeds.create({
      data: { folder_id: folderId, feed_id: feedId },
    });
  } else if (action === 'unregister') {
    await prisma.my_feeds.deleteMany({
      where: { folder_id: folderId, feed_id: feedId },
    });
  }

  return json({ success: true });
};

export default function AllFeeds() {
  const { feedList, myFeedIds, folderId } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">All Feeds</h1>
          <Link to="/all-feeds/create">
            <Button>Add Feed</Button>
          </Link>
        </header>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedList.map((feed) => (
            <Card key={feed.id}>
              <CardHeader>
                <CardTitle>
                  <span className="text-lg font-semibold text-gray-900">
                    {feed.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feed.description}</p>
                <div className="flex justify-end mt-4">
                  <Form method="post">
                    <input type="hidden" name="feedId" value={feed.id} />
                    <input type="hidden" name="folderId" value={folderId} />
                    <input
                      type="hidden"
                      name="action"
                      value={
                        myFeedIds.includes(feed.id) ? 'unregister' : 'register'
                      }
                    />
                    <Button
                      type="submit"
                      variant={
                        myFeedIds.includes(feed.id) ? 'destructive' : 'default'
                      }
                    >
                      {myFeedIds.includes(feed.id) ? 'Unregister' : 'Register'}
                    </Button>
                  </Form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
