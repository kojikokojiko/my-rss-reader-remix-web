import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { useState } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import prisma from '~/db/client';

export const action: ActionFunction = async ({ request }) => {
  //   const { id: folderId } = useParams();
  const form = await request.formData();
  const feedUrl = form.get('feed-url');
  const folderId = form.get('folderId');

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

    // return redirect(`/my-folder/${folderId}`);
    return json({ success: true, newFeed, newMyFeed });
  } catch (error) {
    console.error('Error adding feed or my_feed:', error);
    return json({ error: 'Failed to add feed or my_feed' }, { status: 500 });
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  const folderIdString = params.id; // 子ルートのパラメータは文字列として取得される
  // console.log('folderId as string:', folderIdString);

  // 数値に変換し、変換が成功したかどうかを確認
  const folderId =
    folderIdString !== undefined ? parseInt(folderIdString, 10) : undefined;

  try {
    const feeds = await prisma.my_feeds.findMany({
      where: { folder_id: folderId },
      include: { feed: true },
    });
    // データ取得に成功した場合、找得したデータを返す
    return { feeds };
  } catch (error) {
    console.error('データベースクエリのエラー:', error);

    // 適切なエラーレスポンスを返す
    throw new Response('データの取得に失敗しました。', { status: 500 });
  }
};

export const MyFolderLayout = () => {
  const { feeds } = useLoaderData<typeof loader>(); // Loaderから取得したデータを利用

  const location = useLocation();
  return (
    // <div className="flex min-h-screen w-full flex-row">
    <div className="flex overflow-hidden ">
      <Outlet />
      <ScrollArea className="w-96  border-l border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">YOUR FEEDS</h3>
          {/* パスの末尾が "add-feed" でない場合にリンクを表示 */}
          <p>location.pathname: {location.pathname}</p>
          {!location.pathname.endsWith('/add-feed') && (
            <Link
              to={`${location.pathname}/add-feed`}
              onClick={() => console.log('Link clicked!')}
            >
              <Button variant="outline" size="sm">
                ＋
              </Button>
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {feeds.map((feedRecord) => {
            const title = feedRecord.feed.title || 'Unnamed Feed';
            return (
              <Card key={feedRecord.feed.id}>
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
                  <p className="text-xs text-gray-500">{feedRecord.feed.url}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MyFolderLayout;
