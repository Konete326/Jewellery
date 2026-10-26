import React from 'react';
import { Users, Shield, Key } from 'lucide-react';
import { GoogleIcon } from '@/components/google-icon';

export function UsersMetrics({ users = [] }) {
  const total = users.length;
  const googleCount = users.filter((u) => u.authProvider === 'google').length;
  const localCount = users.filter((u) => u.authProvider === 'local').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const cards = [
    {
      label: 'Total Registered',
      value: total,
      sub: 'All registered clientele',
      icon: Users,
      color: 'text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
    },
    {
      label: 'Google Sign-In',
      value: googleCount,
      sub: `${total > 0 ? Math.round((googleCount / total) * 100) : 0}% of all users`,
      customIcon: <GoogleIcon className="size-5 shrink-0" />,
      color: 'text-blue-600 bg-blue-500/10 border-blue-500/20'
    },
    {
      label: 'Email & Password',
      value: localCount,
      sub: `${total > 0 ? Math.round((localCount / total) * 100) : 0}% traditional accounts`,
      icon: Key,
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Atelier Admins',
      value: adminCount,
      sub: 'Elevated management rights',
      icon: Shield,
      color: 'text-purple-600 bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
              <div
                className={`size-8 rounded-lg border flex items-center justify-center ${c.color}`}
              >
                {c.customIcon ? c.customIcon : <IconComponent className="size-4" />}
              </div>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold tracking-tight text-foreground">
                {c.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
