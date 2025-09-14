import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full py-8 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-50 border-b border-rose-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Image
          src="/assets/angy-bunny.png"
          alt="Angy Bunny"
          width={120}
          height={120}
          className="mx-auto w-32 h-32 object-contain mb-2"
        />
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-rose-700 drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
          Angy Bunny
        </h1>
        <p className="mt-2 text-rose-500">sweetest treats baked with love</p>
      </div>
    </header>
  );
}
