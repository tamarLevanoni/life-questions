'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, User, Building2, Phone, Briefcase, Bell } from 'lucide-react';
import { OCCUPATION_LABELS } from '@/lib/constants/categories';
import { AppHeader } from '@/components/layout/app-header';
import { useUserStore } from '@/lib/stores/user-store';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = useUserStore((s) => s.user);

  if (status === 'loading' || (status === 'authenticated' && !user)) {
    return (
      <>
        <AppHeader />
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/');
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'משתמש';

  return (
    <>
    <AppHeader />
    <div className="container mx-auto px-6 py-20 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={session?.user?.image || ''} alt={fullName} />
              <AvatarFallback className="text-3xl">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl">{fullName}</CardTitle>
          <CardDescription>{user?.email || 'No email'}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">שם</p>
                <p className="font-medium">{fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">אימייל</p>
                <p className="font-medium">{user?.email || 'Not provided'}</p>
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">טלפון</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {user?.institutionName && (
              <div className="flex items-center gap-4">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">מוסד</p>
                  <p className="font-medium">{user.institutionName}</p>
                </div>
              </div>
            )}

            {user?.occupations && user.occupations.length > 0 && (
              <div className="flex items-start gap-4">
                <Briefcase className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">עיסוקים</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.occupations.map((occ) => (
                      <span
                        key={occ}
                        className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-sm font-hebrew"
                      >
                        {OCCUPATION_LABELS[occ] ?? occ}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {user?.marketingConsent !== undefined && (
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">עדכונים ושיווק</p>
                  <p className="font-medium">{user.marketingConsent ? 'מסכים לקבל עדכונים' : 'לא מסכים לקבל עדכונים'}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Signed in with Google OAuth.
            </p>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
