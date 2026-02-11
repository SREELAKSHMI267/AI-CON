
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth-form';
import Logo from '@/components/logo';
import { useUser } from '@/firebase';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <Logo className="justify-center mb-4" iconSize={24} textSize="text-2xl" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
