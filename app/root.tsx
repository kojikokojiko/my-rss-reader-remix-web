import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
} from '@remix-run/react';
import './tailwind.css';
import Header from '~/components/header/header';
import Sidebar from '~/components/sidebar/sidebar';
import type { RssFeed } from '~/types/rssFeed';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import prisma from '~/db/client';
import { json, redirect } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  try {
    const folders = await prisma.my_feeds_folders.findMany();
    console.log('Fetched folders:', folders); // デバッグ用に確認
    return json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error); // エラーハンドリング
    return json({ folders: [] }); // デフォルト値を返す
  }
};
export const action: ActionFunction = async ({ request }) => {
  // フォームデータを取得
  const form = await request.formData();
  const folderName = form.get('folder-name');
  if (typeof folderName !== 'string' || folderName.trim() === '') {
    return json({ error: 'Folder name is required' }, { status: 400 });
  }
  await prisma.my_feeds_folders.create({
    data: {
      name: folderName.trim(),
    },
  });

  return json({ success: true });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>(); // Loaderデータを取得

  // デフォルト値を設定してエラーを防止
  const folders = data?.folders ?? [];
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <div className="flex flex-1 sm:gap-4 sm:py-4 sm:pl-14">
            <Sidebar folders={folders} />
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>

        {/* {children} */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
