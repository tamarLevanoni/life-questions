'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Pencil, Save, X } from 'lucide-react';

interface ProfileHeroCardProps {
  fullName: string;
  initials: string;
  email: string | undefined;
  avatarUrl: string | undefined;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileHeroCard({
  fullName,
  initials,
  email,
  avatarUrl,
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: ProfileHeroCardProps) {
  return (
    <GlassCard variant="light" className="relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-l from-brand-teal via-brand-blue to-brand-orange" />
      <div className="p-8 flex flex-col items-center gap-4 text-center">
        <Avatar className="w-24 h-24 ring-4 ring-white/40 shadow-lg">
          <AvatarImage src={avatarUrl ?? ''} alt={fullName} />
          <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-teal-400 to-blue-400 text-white">
            {initials.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-bold font-hebrew bg-linear-to-l from-brand-teal to-brand-blue bg-clip-text text-transparent">
            {fullName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-hebrew">{email}</p>
        </div>

        {!isEditing ? (
          <Button variant="outline" size="sm" className="gap-2 font-hebrew" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
            עריכת פרטים
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="gap-2 font-hebrew bg-linear-to-l from-brand-teal to-brand-blue text-white border-0 hover:opacity-90"
              onClick={onSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'שומר...' : 'שמירה'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 font-hebrew"
              onClick={onCancel}
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
              ביטול
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
