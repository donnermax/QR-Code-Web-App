import { supabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string> }
): Promise<NextResponse> {
  const { business, slug } = context.params;

  const { data: qrCode, error } = await supabase
    .from('qr_codes')
    .select('redirect_url')
    .eq('slug', slug)
    // .eq('business', business) // Uncomment if you want to filter by business too
    .single();

  if (error || !qrCode) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Increment the visit counter
  await supabase.rpc('increment_visits', { slug_param: slug });

  try {
    return NextResponse.redirect(new URL(qrCode.redirect_url, request.url));
  } catch (e) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
