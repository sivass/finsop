import { Dispatch, SetStateAction, useState } from 'react';

interface User {
  userId: string;
  name: string;
  accountType: string;
  role: string;
  homeCountry: string;
  status: string;
}

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onSelect: Dispatch<SetStateAction<string | null>>;
}

export default function UserList({ users, selectedUserId, onSelect }: UserListProps) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col h-full">
      <input
        type="text"
        placeholder="Search 100+ managers..."
        className="mb-4 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ul className="flex-1 overflow-y-auto space-y-2">
        {filtered.map(user => (
          <li
            key={user.userId}
            onClick={() => onSelect(user.userId)}
            className={`p-3 rounded-lg cursor-pointer flex flex-col ${
              selectedUserId === user.userId
                ? 'bg-primary/10 border border-primary'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user.role} • {user.userId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
