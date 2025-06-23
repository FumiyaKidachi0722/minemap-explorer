'use client';

import ViewerCanvas from '@/presentation/components/ViewerCanvas';

export default function ViewerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Viewer</h1>
      <ViewerCanvas />
    </div>
  );
}
