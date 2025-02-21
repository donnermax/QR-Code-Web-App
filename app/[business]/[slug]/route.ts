import { supabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';
import type { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
  business: string;
  slug: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Params }
): Promise<NextResponse> {
  const { business, slug } = context.params;

  const { data: qrCode, error } = await supabase
    .from('qr_codes')
    .select('redirect_url')
    .eq('slug', slug)
    // .eq('business', business) // Uncomment if needed
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
