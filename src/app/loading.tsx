import { HeighttLoader } from "@/components/ui/HeighttLoader";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center" aria-busy="true">
      <HeighttLoader label="Loading page" />
    </main>
  );
}
