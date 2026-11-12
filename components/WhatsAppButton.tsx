'use client';
export default function WhatsAppButton({ number }: { number: string }) {
  if (!number) return null;
  return (
    <a href={`https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour, je souhaite des informations sur vos articles.')}`}
      target="_blank" rel="noreferrer" aria-label="Contact WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-105">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.2.1.3 0 .5-.3.6-.7.9-.5 1.2.7 1.2 1.6 2 2.8 2.6.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1.1.1.7-.2 1.2z"/></svg>
    </a>
  );
}
