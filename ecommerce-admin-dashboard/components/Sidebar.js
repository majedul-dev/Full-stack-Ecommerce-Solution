'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Package,
  Folder,
  ShoppingCart,
  Users,
  Library,
  BarChart,
  Settings,
  Plus,
  X,
  Menu
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: Folder },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Assets Library', href: '/library', icon: Library },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const secondaryNavigation = [
    { name: 'Create Product', href: '/products/new', icon: Plus },
    { name: 'Add Category', href: '/categories/new', icon: Plus },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-[calc(env(safe-area-inset-top,0px)+1rem)] right-[max(1rem,env(safe-area-inset-right))] z-50"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-background border-r fixed h-screen transition-transform duration-200 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-50`}
      >
        <ScrollArea className="h-full p-6">
          <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
          
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          <Separator className="my-6" />

          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase">
              Quick Actions
            </h3>
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors"
              >
                <item.icon className="h-4 w-4 mr-3 text-primary" />
                {item.name}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}