import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for insert
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference_id, user_id, cart, delivery, subtotal, delivery_fee, order_total } = req.body;
  if (!reference_id || !cart || !delivery || !subtotal || !order_total) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        reference_id,
        user_id: user_id || null,
        cart,
        delivery,
        subtotal,
        delivery_fee,
        order_total,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ order: data });
}
