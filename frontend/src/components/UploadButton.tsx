import { Paperclip } from "lucide-react";

interface Props {
  onUpload(file: File): void;
}

export default function UploadButton({ onUpload }: Props) {
  return (
    <>
      <input
        id="pdf-upload"
        hidden
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onUpload(file);
          }
        }}
      />

      <label
        htmlFor="pdf-upload"
        className="
          cursor-pointer
          rounded-xl
          bg-zinc-800
          p-3
          hover:bg-zinc-700
        "
      >
        <Paperclip size={20} />
      </label>
    </>
  );
}
