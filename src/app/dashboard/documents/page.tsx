import { DocumentQA } from "@/components/dashboard/DocumentQA";

export const metadata = {
    title: "Document Intelligence | SaaS Core",
    description: "Upload and chat with your documents using AI.",
};

export default function DocumentsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                    Document <span className="text-indigo-600">Intelligence</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Upload PDFs or text files to extract insights and ask complex questions.
                </p>
            </div>

            <DocumentQA />
        </div>
    );
}
