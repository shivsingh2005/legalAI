import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

export const ArgumentBuilder: React.FC = () => {
  const t = useTranslations();
  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">{t.argumentBuilder.title}</h1>
      <div className="bg-[rgb(var(--card))] p-8 rounded-lg shadow-md text-center border border-[rgb(var(--border))]">
        <h3 className="text-xl font-semibold text-[rgb(var(--card-foreground))]">{t.argumentBuilder.comingSoon}</h3>
        <p className="text-[rgb(var(--muted-foreground))] mt-2">{t.argumentBuilder.description}</p>
      </div>
    </div>
  );
};