"use client";
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';

interface NavItem {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  const principalNavItems: NavItem[] = [
    { name: 'Create Classroom', link: '/create-classroom' },
    { name: 'Teachers', link: '/teachers-edit' },
    { name: 'Students', link: '/students-edit' },
    { name: 'All Time Table', link: '/all-time-table' },
  ];

  const studentNavItems: NavItem[] = [
    { name: 'Time Table', link: '/time-table' },
    { name: 'All Students', link: '/all-students-classroom' },
  ];

  const teacherNavItems: NavItem[] = [
    { name: 'Create Time Table', link: '/create-time-table' },
    { name: 'All Students', link: '/all-students' },
  ];

  const navItems: NavItem[] = session?.user?.role === 'principal'
    ? principalNavItems
    : session?.user?.role === 'teacher'
    ? teacherNavItems
    : session?.user?.role === 'student'
    ? studentNavItems
    : [];

    const handleSignOut = () => {
      signOut({ redirect: true, callbackUrl: '/signin' });
    };

  return (
    <nav className="w-full bg-gray-100 text-black border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-sm px-6 hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </div>
        {session && (
          <Button onClick={handleSignOut}>
            Log Out
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
