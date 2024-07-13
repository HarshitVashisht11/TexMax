"use client";
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  const handleCreateEditor = () => {
    const editorId = uuidv4();
    router.push(`/editor/${editorId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <section className="w-full max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-9xl md:text-[200px] font-bold text-teal-400">
          TeX MaX
        </h1>
        <p className="mt-6 text-lg md:text-xl">
          The free LaTeX editor that lets you start working without sign-up. Just click "Get Started" and dive into your work seamlessly.
        </p>
        <button
          onClick={handleCreateEditor}
          className="mt-8 px-8 py-4 rounded-full bg-teal-400 text-black font-semibold text-2xl flex items-center justify-center space-x-2"
        >
          <span>Get Started</span>
          <ArrowRight />
        </button>
      </section>
      <section className="w-full max-w-7xl mx-auto px-4 py-20 text-center shadow-md rounded-lg mt-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Why Choose TeX MaX?
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-700 rounded-lg">
            <h3 className="text-xl md:text-2xl font-semibold text-teal-400">Instant Access</h3>
            <p className="mt-4 text-gray-300">
              Start editing your LaTeX documents instantly without the need for sign-up or sign-in.
            </p>
          </div>
          <div className="p-6 border border-gray-700 rounded-lg">
            <h3 className="text-xl md:text-2xl font-semibold text-teal-400">User-Friendly Interface</h3>
            <p className="mt-4 text-gray-300">
              Enjoy a clean, intuitive interface that makes LaTeX editing simple and efficient.
            </p>
          </div>
          <div className="p-6 border border-gray-700 rounded-lg">
            <h3 className="text-xl md:text-2xl font-semibold text-teal-400">Free of Charge</h3>
            <p className="mt-4 text-gray-300">
              Use all the features of TeX MaX without any cost. No hidden fees, no premium plans.
            </p>
          </div>
        </div>
      </section>
      <footer className="w-full py-4 text-center text-gray-600 text-sm">
        © 2024 TeX MaX. All rights reserved.
      </footer>
    </main>
  );
}
