"use client";

import { useState } from "react";
import { FileUp, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
  "image/bmp"
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => 
        ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number]) && 
        file.size <= MAX_FILE_SIZE,
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF and image files (PNG, JPG, JPEG, TIFF, BMP) under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload file');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      // Navigate to chat page with the document ID
      router.push(`/chat?docId=${encodeURIComponent(data.file_id)}&file=${encodeURIComponent(files[0].name)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center items-center bg-white"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none bg-white h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-black">Drag and drop files here</div>
            <div className="text-sm text-gray-600">
              {"(PDFs and images only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit bg-white text-black shadow-lg">
        <CardHeader className="text-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="h-6 w-6 text-[#0066FF]" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#0052CC] bg-clip-text text-transparent">
                Document Chat
              </h1>
            </div>
            <CardDescription className="text-base text-black">
              Upload a PDF or an image file and ask me anything about it.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/100`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {files.length > 0 ? (
                  <span className="font-medium text-black">
                    {files[0].name}
                  </span>
                ) : (
                  <span>Drop your document here or click to browse.</span>
                )}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full !bg-[#0066FF] hover:!bg-[#0052CC] text-white"
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                "Start Chatting"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
