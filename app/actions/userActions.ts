'use server';

import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getUserStatus() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('User not authenticated.');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('users')
    .select('paypal_merchant_id')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user status:', error);
    throw new Error('Could not fetch user status.');
  }

  return {
    paypalConnected: !!data.paypal_merchant_id,
  };
}