import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <QrCode className="h-24 w-24" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Dynamic QR Code Generator
          </h1>
          <p className="max-w-[600px] text-muted-foreground">
            Create dynamic QR codes that you can update anytime. Perfect for menus, business cards,
            and marketing materials that need to stay current.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth?tab=login">Login</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="rounded-full bg-primary/10 p-4">
              <QrCode className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Dynamic Updates</h2>
            <p className="text-center text-muted-foreground">
              Change your QR code destination anytime without reprinting
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="rounded-full bg-primary/10 p-4">
              <QrCode className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Track Scans</h2>
            <p className="text-center text-muted-foreground">
              Monitor how many times your QR codes are scanned
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="rounded-full bg-primary/10 p-4">
              <QrCode className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold">Easy Management</h2>
            <p className="text-center text-muted-foreground">
              Manage all your QR codes from a single dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}