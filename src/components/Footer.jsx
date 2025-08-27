import React, { useState } from 'react';
import { Facebook, Twitter, Youtube, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-800 text-white pb-4 pt-4 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-3">
          
          {/* Company Info */}
          <div className="text-center space-y-2">
           
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>Denver, CO</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>720-735-7533</span>
              </div>
            </div>
            
          </div>

         {/* Social Media */}
          <div className="flex justify-center space-x-4 p-4">
            <Facebook size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Instagram size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Twitter size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Linkedin size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Youtube size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>

         

       
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Farouk et cie Section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-light tracking-wider uppercase">
              Farouk et cie
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>601 South Broadway, Suite G</p>
              <p>Denver, CO 80209</p>
              <p>720-735-7533</p>
            </div>
          </div>

          {/* Offices Section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-light tracking-wider uppercase">
              Offices
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span>Denver (HQ)</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span>Miami</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span>Montecito</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span>Barcelona</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-300">Press Inquiries</p>
            </div>
          </div>

          {/* Customer Care Section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-light tracking-wider uppercase">
              Customer Care
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="hover:text-white cursor-pointer transition-colors">Contact Us</p>
              <p className="hover:text-white cursor-pointer transition-colors">My Account</p>
              <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
              <p className="hover:text-white cursor-pointer transition-colors">Return Policy</p>
              <p className="hover:text-white cursor-pointer transition-colors">Terms</p>
            </div>
          </div>

          {/* Our Brands Section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-light tracking-wider uppercase">
              Our Brands
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="hover:text-white cursor-pointer transition-colors">MB Interior Design</p>
              <p className="hover:text-white cursor-pointer transition-colors">MB Home Collection</p>
            </div>
          </div>

          {/* Stay Connected Section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-light tracking-wider uppercase">
              Stay Connected
            </h3>
            
            {/* Email Signup */}
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button
                onClick={handleSubmit}
                className="w-full py-2 bg-transparent border border-gray-600 text-white text-sm hover:bg-gray-700 transition-colors uppercase tracking-wide"
              >
                Submit
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3 pt-2">
              <Facebook size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Mail size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-xs text-gray-500 text-center">
© 2025 Farouk et Cie - Carreleur Professionnel. Tous droits réservés.

          </div>
        </div>
      </div>
    </footer>
  );
}