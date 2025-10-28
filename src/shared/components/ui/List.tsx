import type { TListProps, TListItemProps, TListItemDetailProps } from './interface';

export const List = ({ children, className = '' }: TListProps) => (
  <ul className={`divide-y divide-gray-200 ${className}`}>
    {children}
  </ul>
);

export const ListItem = ({ children, onClick, className = '', hoverable = false }: TListItemProps) => (
  <li
    onClick={onClick}
    className={`px-4 py-4 ${hoverable && onClick ? 'hover:bg-gray-50 cursor-pointer' : ''} ${className}`}
  >
    {children}
  </li>
);

export const ListItemDetail = ({ label, value }: TListItemDetailProps) => (
  <div className="flex justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);
