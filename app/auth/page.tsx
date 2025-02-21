"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Handle authentication for login or signup.
  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true);
    let response: any = null;

    if (type === 'signup') {
      response = await supabase.auth
        .signUp({ email, password })
        .catch((err) => {
          toast({
            title: 'Error',
            description: 'Sorry, there has been an issue creating your account.',
            variant: 'destructive',
          });
          return null;
        });
    } else {
      response = await supabase.auth
        .signInWithPassword({ email, password })
        .catch((err) => {
          toast({
            title: 'Error',
            description: 'Sorry, please check your credentials and try again.',
            variant: 'destructive',
          });
          return null;
        });
    }

    if (!response) {
      setLoading(false);
      return;
    }

    if (response.error) {
      toast({
        title: 'Error',
        description:
          type === 'login'
            ? 'Sorry, please check your credentials and try again.'
            : 'Sorry, there has been an issue creating your account.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: type === 'signup' ? 'Account created!' : 'Welcome back!',
      description:
        type === 'signup'
          ? 'Please check your email to verify your account.'
          : 'Successfully logged in.',
    });

    if (type === 'login') {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  // Handle password reset request.
  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: 'Info',
        description: 'Please enter your email address first.',
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast({
        title: 'Error',
        description: 'There was an issue sending the reset email. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => handleAuth('login')}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
              {/* Reset Password Link */}
              <div className="text-sm text-center mt-2">
                <button
                  className="underline hover:text-primary"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => handleAuth('signup')}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
