
"use client";

import { useState, useTransition } from "react";
import { uploadDocument } from "@/actions/document-actions"; // Need to export this from src/actions/document-actions.ts
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentUploader({ workspaceId }: { workspaceId: string }) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const router = useRouter();

    async function handleUpload(formData: FormData) {
        if (!formData.get("file")) return;

        startTransition(async () => {
            try {
                await uploadDocument(workspaceId, formData);
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3000);
                // router.refresh(); // Action might handle revalidation already
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        });
    }

    return (
        <div className="border border-dashed border-gray-700 rounded-xl p-6 bg-gray-900/30 text-center">
            <form action={handleUpload} className="flex flex-col items-center gap-4">
                <label htmlFor="file-upload" className="cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-900/30 transition-colors">
                        {isPending ? <Loader2 className="animate-spin text-purple-400" /> : <Upload className="text-gray-400 group-hover:text-purple-400" />}
                    </div>
                    <span className="text-gray-400 group-hover:text-white text-sm font-medium">Click to upload document</span>
                    <input id="file-upload" name="file" type="file" accept=".pdf,.txt,.md" className="hidden" onChange={(e) => e.target.form?.requestSubmit()} />
                </label>
                {status === "success" && <div className="text-green-400 text-sm flex items-center gap-1"><CheckCircle size={14} /> Uploaded!</div>}
                {status === "error" && <div className="text-red-400 text-sm">Upload failed</div>}
            </form>
        </div>
    );
}
