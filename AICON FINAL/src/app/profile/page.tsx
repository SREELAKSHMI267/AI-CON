
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/layout/header";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }


  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header/>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
               <Avatar className="mx-auto h-24 w-24 mb-4">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
                <AvatarFallback>
                  {getInitials(user?.displayName, user?.email)}
                </AvatarFallback>
              </Avatar>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                <p>{user?.displayName || 'Not set'}</p>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
               <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-xs">{user?.uid}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
