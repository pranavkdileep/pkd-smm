import { Button } from "@astryxdesign/core/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-semibold tracking-tight">Hello World</h1>
      <Button label="Hello Astryx" variant="primary" />
    </div>
  );
}
