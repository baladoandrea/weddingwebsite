import React from 'react';
import SidebarMenu from './SidebarMenu';
import useWebsiteTexts from '../utils/useWebsiteTexts';

interface HeaderProps {
  showMenuButton?: boolean;
}

export default function Header({ showMenuButton = true }: HeaderProps) {
  const { getText } = useWebsiteTexts();
  const headerTitle = getText('site-header-title', 'Marta & Sergio');

  return (
    <header className="site-header">
      <div className="header-content">
        <h1 className="header-title">{headerTitle}</h1>
        {showMenuButton && <SidebarMenu />}
      </div>
    </header>
  );
}