'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ title: 'Error', description: 'Authentication not initialized.', variant: 'destructive' });
      return;
    }
    if (!email) {
      toast({ title: 'Missing email', description: 'Please enter your email address.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Configure continue URL to send user back to login page after reset
      const actionCodeSettings = {
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/login`,
      } as any;

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast({ title: 'Email sent', description: 'A password reset link has been sent to your email.' });
      // Redirect to login page after short delay
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast({ title: 'Reset failed', description: err.message || 'Could not send reset email.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Reset your password</CardTitle>
              <CardDescription>
                Enter the email associated with your account and we'll send a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Sending...' : 'Send reset email'}
                  </Button>
                </div>
              </form>
              <p className="text-sm text-muted-foreground mt-4">
                Remembered your password?{' '}
                <Link href="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
