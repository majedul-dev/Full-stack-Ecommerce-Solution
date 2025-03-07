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
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from "next-auth/react";
import SignOutButton from './SignOutButton';
import Link from 'next/link';

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
      if (!e.target.closest('.notifications-menu')) {
        setNotificationsOpen(false);
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
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mobile-menu-toggle"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search orders, products, users..."
              className={`w-full pl-10 pr-4 py-2 ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              } border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            <MagnifyingGlassIcon
              className={`h-5 w-5 absolute left-3 top-3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDark ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          <div className="relative notifications-menu">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 font-medium border-b dark:border-gray-700">Notifications</div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="text-sm">{notification.text}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChatBubbleOvalLeftIcon className="h-6 w-6" />
          </button>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg">
              <UserCircleIcon className="h-8 w-8" />
              <span className="font-medium">{session?.user?.name}</span>
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } w-full px-4 py-2 text-left text-sm`}
                    >
                      View Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <SignOutButton className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""}`} />
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex flex-grow justify-center space-x-4">
          <button
            onClick={() => setNotificationsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <BellIcon className="h-6 w-6" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <UserCircleIcon className="h-8 w-8" />
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard/profile"
                    >
                      <span className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} w-full px-4 py-2 text-left text-sm`}>
                        View Profile
                      </span>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <SignOutButton className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""}`} />
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 z-50 mobile-menu ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              } rounded-lg focus:outline-none`}
            />
            <MagnifyingGlassIcon
              className={`h-5 w-5 absolute left-3 top-3 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDark ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
            <span>Toggle Theme</span>
          </button>

          <button
            onClick={() => {
              setChatOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChatBubbleOvalLeftIcon className="h-6 w-6" />
            <span>Support Chat</span>
          </button>
        </div>
      </div>

      {/* Mobile Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-0 right-0 left-0 md:right-4 md:left-auto md:bottom-20 w-full md:w-80 bg-white dark:bg-gray-800 border-t md:border dark:border-gray-700 rounded-t-lg md:rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Customer Support</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="h-60 overflow-y-auto p-4 space-y-2">
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
          <form onSubmit={handleSendMessage} className="p-2 border-t dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border dark:border-gray-600 px-2 py-1 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Notifications */}
      {notificationsOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-gray-800 z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Notifications</h3>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-2 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="text-sm">{notification.text}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;