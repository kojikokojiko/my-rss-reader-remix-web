import SidebarNav from './sidebar-nav';
// import SubscribedFeeds from './subscribed-feeds';
import { ScrollArea } from '~/components/ui/scroll-area';
// import type { RssFeed } from '~/types/rssFeed';
import { Link, Form, useActionData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import RssIcon from '~/components/icons/rss';
import { useState, useRef, useEffect } from 'react';
import FolderIcon from '../icons/folder';
interface SidebarProps {
  folders: { id: string; name: string; title: string }[];
}

export default function Sidebar({ folders }: SidebarProps) {
  // const [folderList, setFolderList] = useState(folders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const modalRef = useRef(null);
  const actionData = useActionData();

  useEffect(() => {
    if (actionData && actionData.success) {
      setIsModalOpen(false);
      setNewFolderName('');
    }
  }, [actionData]);
  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
      <ScrollArea className="w-64 border-r">
        <nav className="flex flex-col gap-2 p-4">
          <SidebarNav />
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Folders</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              ＋
            </Button>
          </div>
          {/* <ScrollArea className="flex-1 overflow-auto "> */}
          <div className="grid gap-1 p-2">
            {folders.map((folder) => (
              <FeedButton key={folder.id} label={folder.name} id={folder.id} />
            ))}
          </div>
          {/* </ScrollArea> */}
        </nav>
      </ScrollArea>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            ref={modalRef}
            tabIndex={-1}
            className="bg-white p-4 rounded shadow-md w-full max-w-md mx-auto"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-lg font-medium mb-4">Add New Folder</h2>
            <Form method="post">
              <input type="hidden" name="actionType" value="addFolder" />
              <input
                type="text"
                name="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder Name"
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
    </aside>
  );
}

interface FeedButtonProps {
  label: string;
  id: string;
}

function FeedButton({ label, id }: FeedButtonProps) {
  return (
    <Link to={`/my-folder/${id}`}>
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 rounded-md px-3 py-2 text-left hover:bg-muted"
      >
        <FolderIcon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
}
