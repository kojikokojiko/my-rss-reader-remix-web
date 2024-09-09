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
import type { LoaderFunction } from '@remix-run/node';
import prisma from '~/db/client';
import { json } from '@remix-run/node';

// Loader関数を定義
export const loader: LoaderFunction = async () => {
  const rssFeeds: RssFeed[] = await prisma.entries.findMany();
  return json({ rssFeeds });
};

export function Layout({ children }: { children: React.ReactNode }) {
  // const { rssFeeds } = useLoaderData<{ rssFeeds: RssFeed[] }>();
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
            <Sidebar />
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
