'use client';

import ViewerCanvas from '@/presentation/components/ViewerCanvas';

export default function ViewerSamplePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Viewer Sample</h1>
      <ViewerCanvas />
    </div>
  );
}
