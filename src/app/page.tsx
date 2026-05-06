import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-4xl font-bold">Co Ganh - Trang Chu (Trong)</h1>
      <p className="text-lg">Trang chu Landing Page - Giao dien cho thiet ke</p>
      <Link href="/game" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">Vao Ban Co</Link>
    </main>
  );
}
