import StarsBackground from "./components/StarsBackground";

export default function App() {
  return (
    <div className="relative z-0 min-h-screen bg-black text-white">
      <StarsBackground />
      <main className="relative z-1 flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Hello Stars ✨</h1>
      </main>
    </div>
  );
}
