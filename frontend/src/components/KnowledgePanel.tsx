import { useEffect, useState } from "react";
import { MadhuAIClient } from "../client/MadhuAIClient";
import { Trash2 } from "lucide-react";

export default function KnowledgePanel() {
  const client = new MadhuAIClient({
    apiUrl: "import.meta.env.VITE_API_URL",
  });

  const [files, setFiles] = useState<any[]>([]);

  async function load() {
    setFiles(await client.knowledge());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 border-t border-zinc-800">

      <h3 className="font-bold mb-4">
        📚 Knowledge
      </h3>

      {files.map((file) => (
        <div
          key={file.name}
          className="flex justify-between mb-2"
        >
          <span className="truncate">
            📄 {file.name}
          </span>

          <Trash2
            size={18}
            className="cursor-pointer text-red-500"
            onClick={async () => {
              await client.deleteKnowledge(file.name);
              load();
            }}
          />
        </div>
      ))}

    </div>
  );
}