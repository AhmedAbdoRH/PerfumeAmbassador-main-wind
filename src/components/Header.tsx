import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, StoreSettings } from '../types/database';

const lightGold = '#FFD700';

interface HeaderProps {
  storeSettings?: StoreSettings | null;
}

export default function Header({ storeSettings }: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    setCategories(data || []);
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsDropdownOpen(false);
    navigate(`/category/${categoryId}`);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src={storeSettings?.logo_url || '/logo.png'}
              alt={storeSettings?.store_name || 'الشعار'} 
              className="h-20 w-auto"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex gap-6 items-center">
            <li>
              <Link to="/" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                الرئيسية
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-white hover:text-[#FFD700] transition-colors duration-300"
              >
                الأقسام
                <ChevronDown className="h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-white/10">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="block w-full text-right px-4 py-2 text-white hover:bg-white/10 transition-colors duration-300"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li>
              <a href="#contact" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                تواصل معنا
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}