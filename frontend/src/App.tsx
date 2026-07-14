import Chat from "./components/Chat";
import Header from "./components/Header";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col">
      <Header />

      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </div>
  );
}