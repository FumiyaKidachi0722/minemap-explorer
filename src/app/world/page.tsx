'use client';
import WorldViewerCanvas from '@/presentation/components/WorldViewerCanvas';

export default function WorldPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">World Viewer</h1>
      <WorldViewerCanvas />
    </div>
  );
}
