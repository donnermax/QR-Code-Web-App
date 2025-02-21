import { supabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { business: string; slug: string } }
): Promise<NextResponse> {
  const { business, slug } = context.params;

  // Optionally, filter by business as well:
  const { data: qrCode, error } = await supabase
    .from('qr_codes')
    .select('redirect_url')
    .eq('slug', slug)
    // .eq('business', business) // uncomment if needed
    .single();

  if (error || !qrCode) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Increment the visit counter
  await supabase.rpc('increment_visits', { slug_param: slug });

  // Redirect to the target URL
  try {
    // Construct URL based on the redirect_url and request.url base
    return NextResponse.redirect(new URL(qrCode.redirect_url, request.url));
  } catch (e) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
