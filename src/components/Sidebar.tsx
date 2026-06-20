'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Zap, ShoppingCart, Key, Trophy, Bot } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Studio', href: '/studio', icon: Zap },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  { name: 'Vault', href: '/vault', icon: Key },
  { name: 'Arena', href: '/arena', icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-obsidian border-r border-neon-purple/20 flex flex-col pt-8 pb-4 relative z-50">
      <div className="px-6 mb-12 flex items-center gap-3">
        <Bot className="w-8 h-8 text-neon-lime drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]" />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-lime to-neon-purple drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)] tracking-wider">
          AUTOBOTS
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={twMerge(
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group',
                    isActive
                      ? 'bg-obsidian-light text-neon-lime shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                      : 'text-foreground/70 hover:text-foreground hover:bg-obsidian-light/50'
                  )
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl border border-neon-lime/30 bg-neon-lime/5"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={clsx('w-5 h-5 z-10 transition-colors', isActive ? 'text-neon-lime' : 'text-foreground/50 group-hover:text-neon-purple')} />
                <span className="font-medium z-10">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 rounded-xl border border-neon-lime/20 bg-neon-lime/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-lime/0 via-neon-lime/10 to-neon-lime/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <p className="text-xs text-foreground/70 uppercase tracking-widest mb-1">0G Network</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            <span className="text-sm font-medium text-neon-lime">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
