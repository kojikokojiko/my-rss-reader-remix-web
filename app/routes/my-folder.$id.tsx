import { useState, useEffect } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useParams, useOutletContext } from '@remix-run/react';
import { json } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import prisma from '~/db/client';
import PlusIcon from '~/components/icons/plus';
import { Entry } from '~/types/entry';

export const loader: LoaderFunction = async () => {
  const entries = await prisma.entries.findMany();
  return json(entries);
};

export default function MyFolder() {
  // const { setFolderId } = useOutletContext<{
  //   setFolderId: (id: string) => void;
  // }>();
  const folderId = useParams().id;
  const entries = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  // useEffect(() => {
  //   // Only set the folder ID if it's defined
  //   if (folderId) {
  //     setFolderId(folderId);
  //   }
  // }, [setFolderId, folderId]);

  return (
    <main className="flex-grow overflow-auto p-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tech News</h1>
            <div className="flex space-x-2 items-center">
              <Button variant="outline" size="sm" onClick={handleToggleView}>
                {viewMode === 'grid'
                  ? 'Switch to List View'
                  : 'Switch to Grid View'}
              </Button>
              <Button variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Stay up-to-date with the latest news and trends in the tech
            industry.
          </p>
        </div>

        <div
          className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col items-center'
          }`}
        >
          {entries.map((entry: Entry) => (
            <a
              href={entry.link || undefined}
              key={entry.id}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-inherit"
            >
              <Card
                className={`group flex flex-col cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-lg ${
                  viewMode === 'list'
                    ? 'flex-row h-auto mb-4 max-w-4xl w-full'
                    : 'h-full flex justify-between'
                }`}
              >
                <CardContent
                  className={`${
                    viewMode === 'list'
                      ? 'flex flex-row items-center justify-between w-full p-4'
                      : ''
                  }`}
                >
                  <img
                    src="/favicon.ico"
                    alt="Article thumbnail"
                    width={400}
                    height={225}
                    className={`aspect-video rounded-md object-cover ${
                      viewMode === 'list' ? 'w-1/3' : ''
                    }`}
                  />

                  <div
                    className={`mt-4 space-y-2 ${
                      viewMode === 'list' ? 'ml-4 w-2/3' : ''
                    }`}
                  >
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {entry.description}
                    </p>
                  </div>
                </CardContent>
                {entry.pubDate && (
                  <CardFooter
                    className={`${
                      viewMode === 'list'
                        ? 'mt-4 flex items-center justify-between w-2/3 ml-auto'
                        : ''
                    }`}
                  >
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.pubDate).toLocaleDateString()}
                    </div>
                  </CardFooter>
                )}
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
