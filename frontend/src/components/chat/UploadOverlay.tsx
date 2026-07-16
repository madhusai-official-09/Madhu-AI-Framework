import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";

export default function UploadOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-indigo-400/60 bg-background/80 backdrop-blur-sm"
      data-testid="upload-overlay"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <UploadCloud className="size-6 text-indigo-400" />
        <div className="text-sm font-medium">Drop to upload</div>
        <div className="text-[11px] text-muted-foreground">
          PDF · TXT · MD · DOCX · Images
        </div>
      </div>
    </motion.div>
  );
}
