'use client';
import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  UserCircleIcon,
  BellIcon,
  ChatBubbleOvalLeftIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const { data: session, status } = useSession();

  const notifications = [
    { id: 1, text: 'New order received', time: '2 min ago' },
    { id: 2, text: 'Payment received', time: '15 min ago' },
    { id: 3, text: 'New customer registration', time: '1 hr ago' },
  ];

  const handleLogout = async () => {
    try {
      // 1. Call external API logout
      const apiResponse = await fetch(`https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/userLogout`, {
        method: 'POST'
      });
      const res = await apiResponse.json();

      if (!res.success) {
        throw new Error('logout failed');
      }

      // 2. Clear NextAuth session
      await signOut({
        redirect: true,
        callbackUrl: "/login"
      });

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sent: true }]);
      setNewMessage('');
    }
  };

  return (
    <header className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
      shadow-sm border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 md:px-6 py-4`}>
      <div className="flex items-center justify-between h-12">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 mobile-menu-toggle"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </Button>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <MagnifyingGlassIcon
              className={`h-5 w-5 absolute left-3 top-3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <Input
              type="text"
              placeholder="Search orders, products, users..."
              className={`w-full pl-10 ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDark ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </Button>

          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-700">
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                  <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="px-4 py-2 font-medium border-b dark:border-gray-700">Notifications</div>
              <ScrollArea className="h-60">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="text-sm">{notification.text}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</div>
                  </div>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChatOpen(!chatOpen)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChatBubbleOvalLeftIcon className="h-6 w-6" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700 gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback>
                    <UserCircleIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{session?.user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex flex-grow justify-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(true)}
            className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <BellIcon className="h-6 w-6" />
            {notifications.length > 0 && (
              <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center">
                {notifications.length}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback>
                    <UserCircleIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <SheetTitle>Menu</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </Button>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon
                className={`h-5 w-5 absolute left-3 top-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <Input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              />
            </div>
          </SheetHeader>

          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleTheme}
            >
              {isDark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
              <span>Toggle Theme</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setChatOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              <span>Support Chat</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Chat Window */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side={{ default: 'bottom', md: 'right' }} className="rounded-t-lg md:rounded-lg">
          <SheetHeader className="mb-4">
            <SheetTitle>Customer Support</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-60 mb-4">
            <div className="space-y-2 pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    message.sent ? 'bg-blue-100 dark:bg-blue-900 ml-auto' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  {message.text}
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.value)}
              placeholder="Type a message..."
            />
            <Button type="submit">Send</Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Mobile Notifications */}
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent side="bottom" className="rounded-t-lg">
          <SheetHeader className="mb-4">
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[70vh]">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className="p-4 mb-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="text-sm">{notification.text}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</div>
              </Card>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
