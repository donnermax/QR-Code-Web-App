"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Plus, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeData {
  id: string;
  title: string;
  slug: string;
  redirect_url: string;
  visits: number;
}

function QRCodeCanvas({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: 200,
            margin: 2,
          });
        } catch (err) {
          console.error('Error generating QR code:', err);
        }
      }
    };
    generateQR();
  }, [value]);

  return <canvas ref={canvasRef} />;
}

export default function Dashboard() {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [title, setTitle] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    checkUser();
    fetchQRCodes();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth');
    } else {
      setUserId(session.user.id);
    }
  };

  const fetchQRCodes = async () => {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch QR codes',
        variant: 'destructive',
      });
    } else {
      setQrCodes(data || []);
    }
    setLoading(false);
  };

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const createQRCode = async () => {
    if (!title || !redirectUrl) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (!userId) {
      toast({
        title: 'Error',
        description: 'Please log in again',
        variant: 'destructive',
      });
      return;
    }

    const slug = generateSlug();
    const { error } = await supabase.from('qr_codes').insert({
      title,
      redirect_url: redirectUrl,
      slug,
      user_id: userId
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create QR code',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'QR code created successfully',
      });
      setTitle('');
      setRedirectUrl('');
      fetchQRCodes();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dynamic QR Codes</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New QR Code</h2>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Redirect URL"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
            />
            <Button onClick={createQRCode}>
              <Plus className="mr-2 h-4 w-4" /> Create QR Code
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{qr.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(qr.redirect_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="aspect-square bg-white p-4 rounded-lg flex items-center justify-center">
                  <QRCodeCanvas value={`${baseUrl}/r/${qr.slug}`} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Visits: {qr.visits}
                </div>
                <div className="text-sm text-muted-foreground break-all">
                  Redirect: {qr.redirect_url}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}