import React from 'react';
import SidebarMenu from './SidebarMenu';

interface HeaderProps {
  showMenuButton?: boolean;
}

export default function Header({ showMenuButton = true }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-content">
        <h1 className="header-title">Marta & Sergio</h1>
        {showMenuButton && <SidebarMenu />}
      </div>
    </header>
  );
}