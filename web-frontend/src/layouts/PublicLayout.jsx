import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[var(--bg-primary,#FAF8F5)] overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto touch-scroll">
        <main className="flex-1 flex flex-col min-h-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
