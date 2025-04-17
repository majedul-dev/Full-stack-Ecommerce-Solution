'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search,
  User,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
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
      const apiResponse = await fetch(`https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/userLogout`, {
        method: 'POST'
      });
      const res = await apiResponse.json();

      if (!res.success) {
        throw new Error('logout failed');
      }

      await signOut({
        redirect: true,
        callbackUrl: "/login"
      });

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    <header className="bg-background border-b sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search orders, products, users..."
              className="w-full pl-9"
            />
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute top-0 right-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {notifications.length}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 font-medium border-b">Notifications</div>
              <ScrollArea className="h-60">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-accent transition-colors"
                  >
                    <div className="text-sm">{notification.text}</div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </div>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChatOpen(!chatOpen)}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{session?.user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(true)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <Badge className="absolute top-0 right-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {notifications.length}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
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
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="w-full pl-9"
              />
            </div>

            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={toggleTheme}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span>Toggle Theme</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setChatOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Support Chat</span>
              </Button>
            </div>
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
                    message.sent ? 'bg-primary/10 ml-auto' : 'bg-muted'
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
              onChange={(e) => setNewMessage(e.target.value)}
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
                className="p-4 mb-2 hover:bg-muted transition-colors"
              >
                <div className="text-sm">{notification.text}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </Card>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;