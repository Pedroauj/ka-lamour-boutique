export function WhatsAppFab({ productName }: { productName?: string }) {
  const msg = productName
    ? `Olá! Tenho interesse em: ${productName} (Ka Lamour Store). Pode me ajudar?`
    : "Olá! Vim pela Ka Lamour Store e gostaria de uma ajudinha. ✦";
  const href = `https://wa.me/5511900000000?text=${encodeURIComponent(msg)}`;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      aria-label="Atendimento WhatsApp"
      className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-terracota text-marfim shadow-lg flex items-center justify-center hover:bg-rosewood transition-colors"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.9 11.9 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.3zM12 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.9 9.9 0 012.1 12C2.1 6.6 6.6 2.1 12 2.1c2.7 0 5.1 1 7 2.9 1.9 1.9 2.9 4.4 2.9 7 0 5.4-4.5 9.8-9.9 9.8zm5.5-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4-.1-.6l-1-2.3c-.3-.6-.5-.5-.7-.6H7.5c-.2 0-.5 0-.8.3-.3.3-1.1 1.1-1.1 2.7s1.1 3.1 1.3 3.3c.2.2 2.3 3.6 5.6 5 3.3 1.3 3.3.9 3.9.9.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/>
      </svg>
    </a>
  );
}
