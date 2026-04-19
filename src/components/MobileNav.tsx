import React from 'react';

const MobileNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        <a href="#hero" className="text-sm font-medium text-[#1a2e1a] hover:text-[#e66000] transition-colors">
          Home
        </a>
        <a href="#about" className="text-sm font-medium text-[#1a2e1a] hover:text-[#e66000] transition-colors">
          About
        </a>
        <a href="#projects" className="text-sm font-medium text-[#1a2e1a] hover:text-[#e66000] transition-colors">
          Projects
        </a>
        <a href="#contact" className="text-sm font-medium text-[#1a2e1a] hover:text-[#e66000] transition-colors">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default MobileNav;