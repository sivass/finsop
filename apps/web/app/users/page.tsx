"use client";
import UserList from '@/components/users/UserList';
import UserDetail from '@/components/users/UserDetail';
import { useState, useEffect } from 'react';

interface User {
  userId: string;
  name: string;
  accountType: string;
  role: string;
  homeCountry: string;
  status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => {
      setUsers(data);
      if (data.length > 0) {
        setSelectedUserId(data[0].userId);
      }
    })
    .catch(console.error);
}, []);

  return (
    <div className="flex h-full min-h-screen overflow-hidden">
      {/* Left: User List */}
      <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
        <UserList users={users} selectedUserId={selectedUserId} onSelect={setSelectedUserId} />
      </div>

      {/* Right: User Details */}
      <div className="flex-1 overflow-y-auto p-6 bg-background-light dark:bg-background-dark">
        {selectedUserId && <UserDetail userId={selectedUserId} />}
      </div>
    </div>
  );
}
