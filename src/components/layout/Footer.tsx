import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
