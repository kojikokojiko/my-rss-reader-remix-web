import { Link, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import prisma from '~/db/client';

export const loader: LoaderFunction = async () => {
  const mediaList = await prisma.media.findMany();
  return json(mediaList);
};

export default function MediaIndex() {
  const mediaList = useLoaderData();

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Media List</h1>
          <Link to="/media/create">
            <Button>Create New Media</Button>
          </Link>
        </header>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((media) => (
            <Card key={media.id}>
              <CardHeader>
                <CardTitle>
                  <span className="text-lg font-semibold text-gray-900">
                    {media.hostname}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mt-4">
                  <Link to={`/media/${media.id}/edit`}>
                    <Button className="mr-2">Edit</Button>
                  </Link>
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
