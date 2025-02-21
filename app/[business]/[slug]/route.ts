import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { business: string, slug: string } }
) {
  const { business, slug } = params;

  // Optionally, you can use the business parameter in your query if needed
  const { data: qrCode, error } = await supabase
    .from('qr_codes')
    .select('redirect_url')
    .eq('slug', slug)
    // Optionally add: .eq('business', business)
    .single();

  if (error || !qrCode) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Increment the visit counter
  await supabase.rpc('increment_visits', { slug_param: slug });

  // Redirect to the target URL
  return NextResponse.redirect(qrCode.redirect_url);
}
