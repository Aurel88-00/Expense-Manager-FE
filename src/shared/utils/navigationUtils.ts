import type { NavigationItem } from '../lib/types';
import { Home, Users, Receipt } from 'lucide-react';


export const getNavigationItems = (): readonly NavigationItem[] => [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
];


export const isNavigationItemActive = (navigationPath: string, currentPathname: string): boolean => {
  if (navigationPath === '/') {
    return currentPathname === '/';
  }
  return currentPathname.startsWith(navigationPath);
};
