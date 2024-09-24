import { Link, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import prisma from '~/db/client';

// Loader function to fetch feeds from the database
export const loader: LoaderFunction = async () => {
  const feedList = await prisma.feeds.findMany();
  return json(feedList);
};

export default function AllFeeds() {
  const mediaList = useLoaderData();

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">All Feeds</h1>
          <Link to="/all-feeds/create">
            <Button>Add Feed</Button>
          </Link>
        </header>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((media) => (
            <Card key={media.id}>
              <CardHeader>
                <CardTitle>
                  <span className="text-lg font-semibold text-gray-900">
                    {media.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{media.description}</p>
                <div className="flex justify-end mt-4">
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    // onClick={() => handleDelete(media.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
