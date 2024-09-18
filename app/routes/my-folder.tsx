import { Outlet, Form, Link, useActionData, useParams } from '@remix-run/react';
import { useState } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import prisma from '~/db/client';
export const action: ActionFunction = async ({ request, params }) => {
  const { id: folderId } = useParams();
  const form = await request.formData();
  const feedUrl = form.get('feed_url');

  console.log('folderId:', folderId);

  if (typeof feedUrl !== 'string') {
    return json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // 既存のフィードが存在するかを確認
    const existingFeed = await prisma.feeds.findFirst({
      where: { url: feedUrl },
    });

    let newFeed;

    // 既存のフィードが存在しない場合、新しくフィードを作成
    if (!existingFeed) {
      newFeed = await prisma.feeds.create({
        data: {
          url: feedUrl,
        },
      });
    } else {
      // 既存のフィードが存在する場合、そのフィードを登録
      newFeed = existingFeed;
    }

    // `my_feeds`に登録
    const newMyFeed = await prisma.my_feeds.create({
      data: {
        folder_id: Number(folderId),
        feed_id: newFeed.id,
      },
    });

    return json({ success: true, newFeed, newMyFeed });
  } catch (error) {
    console.error('Error adding feed or my_feed:', error);
    return json({ error: 'Failed to add feed or my_feed' }, { status: 500 });
  }
};

export const MyFolderLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeedURL, setNewFeedURL] = useState('');

  return (
    // <div className="flex min-h-screen w-full flex-row">
    <div className="flex overflow-hidden ">
      <Outlet />
      <ScrollArea className="w-96  border-l border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">YOUR FEEDS</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            ＋
          </Button>
        </div>
        <div className="space-y-4">
          {[
            'Gizmodo',
            'Ars Technica - All content',
            'Wired',
            'Wired',
            'Wired',
            'Wired',
            'Wired',
            'Wired',
            'Wired',
          ].map((feed, index) => (
            <Card key={index}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      // src={`/placeholder.svg?text=${feed[0]}`}
                      alt={feed}
                    />
                    <AvatarFallback>{feed[0]}</AvatarFallback>
                  </Avatar>
                  {feed}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-500">
                  {Math.floor(Math.random() * 1000)}K followers
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* モーダルの実装 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            // ref={modalRef}
            tabIndex={-1}
            className="bg-white p-4 rounded shadow-md w-full max-w-md mx-auto"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-lg font-medium mb-4">ADD FEEDS</h2>
            <Form method="post">
              <input type="hidden" name="actionType" value="addFolder" />
              <input
                type="text"
                name="folder-name"
                value={newFeedURL}
                onChange={(e) => setNewFeedURL(e.target.value)}
                placeholder="FEEDS URL"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2"
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFolderLayout;
