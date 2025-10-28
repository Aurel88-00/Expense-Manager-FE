import { useState, useCallback, useTransition, useDeferredValue } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, TrendingUp, AlertTriangle } from 'lucide-react';
import { getNavigationItems, isNavigationItemActive } from '../utils';
import { ThemeToggle } from './ui/ThemeToggle';

const ExpenseManagementLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [, startTransition] = useTransition();
  
  const currentLocation = useLocation();
  const deferredLocation = useDeferredValue(currentLocation);
  const navigationItems = getNavigationItems();

  const checkNavigationItemActive = useCallback((navigationPath: string): boolean => {
    return isNavigationItemActive(navigationPath, deferredLocation.pathname);
  }, [deferredLocation.pathname]);

  const handleSidebarOpen = useCallback(() => {
    startTransition(() => {
      setIsSidebarOpen(true);
    });
  }, []);

  const handleSidebarClose = useCallback(() => {
    startTransition(() => {
      setIsSidebarOpen(false);
    });
  }, []);

  return (
    <div className="h-screen bg-background flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true" aria-labelledby="mobile-sidebar-title">
        <div className="fixed inset-0 bg-background/75" onClick={handleSidebarClose} aria-hidden="true" />
        <div className="fixed inset-y-0 left-0 flex w-full flex-col bg-card border-r border-border shadow-xl" id="mobile-sidebar">
          <div className="flex items-center justify-between h-16 px-5 border-b border-border bg-card">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <TrendingUp className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
              <h1 
                className="text-4xl font-bold text-foreground truncate cursor-default"
                title="Expense Manager"
                id="mobile-sidebar-title"
              >
                EMSystem
              </h1>
            </div>
            <button
              onClick={handleSidebarClose}
              className="ml-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close navigation menu"
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
         
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
            <div className="space-y-1" role="list">
              {navigationItems.map((navigationItem) => {
                const NavigationIcon = navigationItem.icon;
                const isItemActive = checkNavigationItemActive(navigationItem.href);
                
                return (
                  <Link
                    key={navigationItem.name}
                    to={navigationItem.href}
                    onClick={handleSidebarClose}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      isItemActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    aria-label={`Navigate to ${navigationItem.name}`}
                    aria-current={isItemActive ? 'page' : undefined}
                    role="listitem"
                  >
                    <NavigationIcon className={`mr-3 h-6 w-6 shrink-0 ${isItemActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} aria-hidden="true" />
                    {navigationItem.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col grow bg-card border-r border-border">
          <div className="flex items-center h-16 px-4 border-b border-border">
            <TrendingUp className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
            <h1 className="ml-3 text-4xl font-bold text-foreground whitespace-nowrap" title="Expense Manager" id="desktop-sidebar-title">
              EMSystem
            </h1>
          </div>
          
          
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
            {navigationItems.map((navigationItem) => {
              const NavigationIcon = navigationItem.icon;
              const isItemActive = checkNavigationItemActive(navigationItem.href);
              
              return (
                <Link
                  key={navigationItem.name}
                  to={navigationItem.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isItemActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary pl-2'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-label={`Navigate to ${navigationItem.name}`}
                  aria-current={isItemActive ? 'page' : undefined}
                >
                  <NavigationIcon className={`mr-3 h-5 w-5 shrink-0 ${isItemActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'}`} aria-hidden="true" />
                  {navigationItem.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:pl-80 flex flex-col w-screen" >
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8" role="banner">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-foreground lg:hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
            onClick={handleSidebarOpen}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center justify-center gap-x-2 lg:gap-x-4">
              <ThemeToggle />
              <div className="flex items-center gap-x-2 text-sm text-muted-foreground" role="status" aria-label="Budget alerts status">
                <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
                <span className="hidden sm:inline">Budget Alerts Active</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-background flex flex-col" role="main" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ExpenseManagementLayout;
