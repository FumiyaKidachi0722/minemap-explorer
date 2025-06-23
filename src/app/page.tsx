import Link from 'next/link';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/presentation/components/ui/card';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-10 p-8 bg-gradient-to-b from-muted to-background">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Minemap Explorer</h1>
        <p className="text-lg text-muted-foreground">
          Next.js 15 と React 19 で構築された簡易マインクラフトビューアです。
        </p>
      </div>
      <div className="grid w-full max-w-xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>サンプルビューア</CardTitle>
            <CardDescription>WASD で歩き回れるデモ</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/viewer-sample" className="w-full">
              <Button className="w-full">開く</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ワールドビューア</CardTitle>
            <CardDescription>BlueMap サンプルデータ</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/world" className="w-full">
              <Button className="w-full">開く</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
