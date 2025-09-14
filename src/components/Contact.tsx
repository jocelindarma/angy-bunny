"use client";

import { Envelope, BrandInstagram, Telephone } from "@mynaui/icons-react";

export default function Contact() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-rose-700">
        Contact Us
      </h2>
      <div className="flex justify-center gap-6 text-rose-600">
        <a href="mailto:jocelindarma13@gmail.com" aria-label="Email">
          <Envelope className="w-6 h-6 hover:text-rose-800 transition-colors" />
        </a>
        <a
          href="https://instagram.com/jocelindarma"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <BrandInstagram className="w-6 h-6 hover:text-rose-800 transition-colors" />
        </a>
        <a
          href="https://wa.me/628111002087"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <Telephone className="w-6 h-6 hover:text-rose-800 transition-colors" />
        </a>
      </div>
    </div>
  );
}
