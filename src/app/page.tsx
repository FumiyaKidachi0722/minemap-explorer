import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-2xl font-bold">Minemap Explorer</h1>
      <p className="text-center">
        Next.js 15 と React 19 で構築された簡易マインクラフトビューアです。
      </p>
      <div className="flex gap-4">
        <Link href="/viewer-sample" className="text-blue-600 underline">
          サンプルビューア
        </Link>
        <Link href="/world" className="text-blue-600 underline">
          ワールドビューア
        </Link>
      </div>
    </main>
  );
}
