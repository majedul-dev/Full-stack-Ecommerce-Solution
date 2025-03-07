import React from "react";
import {
  ChartBarIcon,
  DocumentTextIcon,
  HashtagIcon,
  PhotoIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

const SideNavigation = ({ activeSection, setActiveSection }) => {
  return (
    <div className="lg:col-span-1 space-y-2">
      {["basic", "inventory", "media", "variants", "seo"].map((section) => (
        <button
          key={section}
          onClick={() => setActiveSection(section)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
            activeSection === section
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {section === "basic" && (
            <DocumentTextIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />
          )}
          {section === "inventory" && (
            <HashtagIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />
          )}
          {section === "media" && (
            <PhotoIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />
          )}
          {section === "variants" && (
            <SquaresPlusIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />
          )}
          {section === "seo" && (
            <ChartBarIcon className="h-5 w-5 mr-2 inline dark:text-gray-400" />
          )}
          {section.charAt(0).toUpperCase() + section.slice(1).replace("-", " ")}
        </button>
      ))}
    </div>
  );
};

export default SideNavigation;
