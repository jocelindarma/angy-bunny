import type { NextApiRequest, NextApiResponse } from 'next';

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, reference_id } = req.body;
  if (!amount || !reference_id) {
    return res.status(400).json({ error: 'Missing amount or reference_id' });
  }

  try {
    const external_id = String(reference_id);
    const callback_url = process.env.XENDIT_QRIS_CALLBACK_URL || 'https://angy-bunny.vercel.app/api/xendit-callback';
    const payload = {
      type: 'DYNAMIC',
      amount: Math.round(Number(amount)),
      reference_id: String(reference_id),
      external_id,
      callback_url,
      currency: 'IDR',
    };
    console.log('Sending to Xendit:', payload);
    const response = await fetch('https://api.xendit.co/qr_codes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64'),
      },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }
    // Log Xendit response for debugging
    console.log('Xendit response:', data);
    if (!response.ok) {
      return res.status(500).json({ error: data.message || data.error || data.raw || 'Failed to create QRIS', details: data });
    }
    return res.status(200).json({ qr_string: data.qr_string, qr_url: data.qr_url, id: data.id });
  } catch (err) {
    console.error('Internal error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
