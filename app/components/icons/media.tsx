export default function MediaListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="6" rx="1" ry="1" />
      <rect x="3" y="9" width="18" height="6" rx="1" ry="1" />
      <rect x="3" y="15" width="18" height="6" rx="1" ry="1" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}
