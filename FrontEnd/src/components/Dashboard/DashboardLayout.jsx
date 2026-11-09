import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { WelcomeSection } from './WelcomeSection';
import { StatisticsCards } from './StatisticsCards';
import { RecentNotes } from './RecentNotes';
import { PopularTags } from './PopularTags';
import { QuickActions } from './QuickActions';
import { FolderOverview } from './FolderOverview';
import { RecentActivity } from './RecentActivity';
import { IntegratedTrashView } from './IntegratedTrashView';
import { IntegratedFoldersView } from './IntegratedFoldersView';
import { IntegratedSettingsView } from './IntegratedSettingsView';
import { NewFolderModal } from './NewFolderModal';
import { ImportExportModal } from './ImportExportModal';
import { UpgradeProModal } from './UpgradeProModal';
import { SettingsModal } from '../modals/SettingsModal';
import { useTheme } from '../../context/ThemeContext';
import dashboardBgDark from '../../assets/dashboard/dashboard-bg-dark.png';
import dashboardBgLight from '../../assets/dashboard/dashboard-bg-light.png';
import '../../styles/authenticatedTheme.css';

export const DashboardLayout = ({
  notes = [],
  stats = { totalNotes: 48, folders: 6, tags: 12, favorites: 9 },
  folders = [],
  tags = [],
  activities = [],
  storage = { usedMb: 245, totalGb: 2, percentage: 12 },
  activeNav = 'dashboard',
  onSelectNav,
  onSelectNote,
  onNewNote,
  onCreateFolder,
  onImportNote,
  onTogglePin,
  onToggleFavorite,
  onDeleteNote,
  onSelectTag,
  onSelectFolder,
  onViewAllNotes,
  onViewAllFolders,
  onOpenSettings
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [importExportMode, setImportExportMode] = useState('import');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleOpenImport = () => {
    setImportExportMode('import');
    setIsImportExportModalOpen(true);
  };

  const handleOpenExport = () => {
    setImportExportMode('export');
    setIsImportExportModalOpen(true);
  };

  return (
    <div className={`app-theme-${isDark ? 'dark' : 'light'} min-h-screen w-full flex overflow-x-hidden font-sans`}>
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={onSelectNav}
        folders={folders}
        storage={storage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navigation Toolbar */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notes={notes}
          onSelectSearchResult={onSelectNote}
          onOpenSettings={onOpenSettings || (() => setIsSettingsModalOpen(true))}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Workspace Content Canvas */}
        <main
          className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1700px] w-full mx-auto space-y-6"
          style={{
            backgroundImage: `url(${isDark ? dashboardBgDark : dashboardBgLight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundAttachment: 'fixed'
          }}
        >
          {activeNav === 'trash' ? (
            <IntegratedTrashView onBackToDashboard={() => onSelectNav && onSelectNav('dashboard')} />
          ) : activeNav === 'folders' ? (
            <IntegratedFoldersView
              onBackToDashboard={() => onSelectNav && onSelectNav('dashboard')}
              onOpenFolderInEditor={onSelectFolder}
            />
          ) : activeNav === 'settings' || activeNav === 'profile' ? (
            <IntegratedSettingsView
              onBackToDashboard={() => onSelectNav && onSelectNav('dashboard')}
              initialTab={activeNav === 'profile' ? 'profile' : 'profile'}
            />
          ) : (
            /* Main 2-Column Responsive Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
              {/* Column 1: Main Workspace (~72-74% width on desktop = 8 or 9 cols) */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-5 lg:space-y-6">
                {/* Welcome / Hero Banner */}
                <WelcomeSection />

                {/* 4 Statistics Cards */}
                <StatisticsCards
                  stats={stats}
                  onCardClick={onSelectNav}
                />

                {/* Recent Notes List Panel */}
                <RecentNotes
                  notes={notes}
                  onSelectNote={onSelectNote}
                  onViewAll={onViewAllNotes}
                  onViewTrash={() => onSelectNav && onSelectNav('trash')}
                  onSelectTag={onSelectTag}
                  onTogglePin={onTogglePin}
                  onToggleFavorite={onToggleFavorite}
                  onDeleteNote={onDeleteNote}
                />

                {/* Popular Tags */}
                <PopularTags
                  tags={tags}
                  onSelectTag={onSelectTag}
                />
              </div>

              {/* Column 2: Right-Side Information Column (~26-28% width = 4 or 3 cols) */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-5 lg:space-y-6">
                {/* Quick Actions */}
                <QuickActions
                  onNewNote={onNewNote}
                  onNewFolder={() => setIsFolderModalOpen(true)}
                  onImport={handleOpenImport}
                  onExport={handleOpenExport}
                />

                {/* My Folders */}
                <FolderOverview
                  folders={folders}
                  onSelectFolder={onSelectFolder}
                  onViewAllFolders={onViewAllFolders}
                />

                {/* Recent Activity Timeline */}
                <RecentActivity
                  activities={activities}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Supporting Modals */}
      <NewFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreateFolder={onCreateFolder}
        existingFolders={folders}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        initialMode={importExportMode}
        notes={notes}
        onImportNote={onImportNote}
      />

      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
