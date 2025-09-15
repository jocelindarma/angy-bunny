import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple Xendit QRIS webhook handler for dev/testing
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log the webhook payload for debugging
  console.log('Xendit QRIS Webhook received:', req.body);

  // Extract external_id (reference_id) and status from webhook
  const { external_id, status } = req.body;
  if (!external_id) {
    return res.status(400).json({ error: 'Missing external_id in webhook' });
  }

  // Only mark as paid if status is PAID (or COMPLETED)
  if (status === 'PAID' || status === 'COMPLETED') {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('reference_id', external_id);
    if (error) {
      console.error('Failed to update order status:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ updated: true });
  }

  // Optionally handle other statuses (e.g., EXPIRED, FAILED)
  return res.status(200).json({ received: true });
}
