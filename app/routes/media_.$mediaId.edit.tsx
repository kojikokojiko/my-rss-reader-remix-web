import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, Form } from '@remix-run/react';
import {
  json,
  LoaderFunction,
  ActionFunction,
  redirect,
} from '@remix-run/node';
import prisma from '~/db/client';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';

export const loader: LoaderFunction = async ({ params }) => {
  const media = await prisma.media.findUnique({
    where: { id: parseInt(params.mediaId as string, 10) },
  });

  if (!media) {
    throw new Response('Not Found', { status: 404 });
  }

  return json(media);
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const hostname = formData.get('hostname') as string;
  const feedTitleSelector = formData.get('feed_title_selector') as string;
  const feedDescSelector = formData.get('feed_desc_selector') as string;
  const itemSelector = formData.get('item_selector') as string;
  const itemTitleSelector = formData.get('item_title_selector') as string;
  const itemLinkSelector = formData.get('item_link_selector') as string;
  const itemDescSelector = formData.get('item_desc_selector') as string;
  const itemPubdateSelector = formData.get('item_pubdate_selector') as string;

  await prisma.media.update({
    where: { id: parseInt(params.mediaId as string, 10) },
    data: {
      hostname,
      feed_title_selector: feedTitleSelector,
      feed_desc_selector: feedDescSelector,
      item_selector: itemSelector,
      item_title_selector: itemTitleSelector,
      item_link_selector: itemLinkSelector,
      item_desc_selector: itemDescSelector,
      item_pubdate_selector: itemPubdateSelector,
    },
  });

  return redirect('/media');
};

export default function EditMedia() {
  const media = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hostname: media.hostname,
    feed_title_selector: media.feed_title_selector,
    feed_desc_selector: media.feed_desc_selector,
    item_selector: media.item_selector,
    item_title_selector: media.item_title_selector,
    item_link_selector: media.item_link_selector,
    item_desc_selector: media.item_desc_selector,
    item_pubdate_selector: media.item_pubdate_selector,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Edit Media</h1>
      <p className="text-gray-600 mb-6">
        Edit the details for the media source
      </p>
      <Form method="post" className="space-y-6">
        <div>
          <Label htmlFor="hostname">Hostname</Label>
          <Input
            id="hostname"
            name="hostname"
            value={formData.hostname}
            onChange={handleChange}
            placeholder="e.g., example.com"
            className="mt-1"
          />
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Feed Selectors</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="feed_title_selector">Feed Title Selector</Label>
              <Input
                id="feed_title_selector"
                name="feed_title_selector"
                value={formData.feed_title_selector}
                onChange={handleChange}
                placeholder="e.g., .feed-title"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Feed Description Selector</Label>
              <Input
                id="feed_desc_selector"
                name="feed_desc_selector"
                value={formData.feed_desc_selector}
                onChange={handleChange}
                placeholder="e.g., .feed-description"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Item Selectors</h2>
          <div>
            <Label htmlFor="item_selector">Item Selector</Label>
            <Input
              id="item_selector"
              name="item_selector"
              value={formData.item_selector}
              onChange={handleChange}
              placeholder="e.g., .item"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="item_title_selector">Item Title Selector</Label>
              <Input
                id="item_title_selector"
                name="item_title_selector"
                value={formData.item_title_selector}
                onChange={handleChange}
                placeholder="e.g., .item-title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="item_link_selector">Item Link Selector</Label>
              <Input
                id="item_link_selector"
                name="item_link_selector"
                value={formData.item_link_selector}
                onChange={handleChange}
                placeholder="e.g., .item-link"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="item_desc_selector">
                Item Description Selector
              </Label>
              <Input
                id="item_desc_selector"
                name="item_desc_selector"
                value={formData.item_desc_selector}
                onChange={handleChange}
                placeholder="e.g., .item-description"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="item_pubdate_selector">
                Item Pubdate Selector
              </Label>
              <Input
                id="item_pubdate_selector"
                name="item_pubdate_selector"
                value={formData.item_pubdate_selector}
                onChange={handleChange}
                placeholder="e.g., .item-pubdate"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Update Media
        </Button>
      </Form>
    </div>
  );
}
