
"use client";

import { useState, useRef, useEffect } from "react";
import {
    FileText,
    Upload,
    Trash2,
    Send,
    Loader2,
    MessageSquare,
    File,
    X,
    Plus,
    Search,
    Sparkles,
    Paperclip
} from "lucide-react";
import { uploadDocument, getDocuments, deleteDocument } from "@/actions/document-actions";
import { chatWithWorkspace, getWorkspaceChatHistory } from "@/actions/chat-actions";
import ReactMarkdown from "react-markdown";
import { Document } from "@prisma/client";

interface WorkspaceViewProps {
    workspaceId: string;
    initialDocuments: Document[];
    initialChats: any[];
}

export default function WorkspaceView({ workspaceId, initialDocuments, initialChats }: WorkspaceViewProps) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [chats, setChats] = useState<any[]>(initialChats);
    const [question, setQuestion] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);
    const [uploading, setUploading] = useState(false); // Managed by this component or sub-component
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // For manual refresh of docs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, sending]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);

        try {
            await uploadDocument(workspaceId, formData);
            // Refresh docs list
            const docs = await getDocuments(workspaceId);
            setDocuments(docs);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this document?")) return;
        try {
            await deleteDocument(id);
            setDocuments(docs => docs.filter(d => d.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || sending) return;

        const currentQuestion = question;
        setQuestion("");
        setSending(true);

        // Optimistic UI
        const userMsg = { id: Date.now().toString(), text: currentQuestion, role: "user" };
        setChats(prev => [...prev, userMsg]);

        try {
            const res = await chatWithWorkspace(workspaceId, currentQuestion);
            if (res.success) {
                setChats(prev => [
                    ...prev.filter(m => m.id !== userMsg.id),
                    res.userMessage!,
                    res.assistantMessage!
                ]);
            } else {
                setError(res.error || "Failed to get answer");
                setChats(prev => prev.filter(m => m.id !== userMsg.id));
            }
        } catch (err: any) {
            console.error("Chat error:", err);
            setError(err.message || "Failed to get answer");
            setChats(prev => prev.filter(m => m.id !== userMsg.id));
        } finally {
            setSending(false);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-140px)] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950/50 backdrop-blur-xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Sources
                        </h2>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.txt,.md"
                        />
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {filteredDocs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            No documents found.
                        </div>
                    ) : (
                        filteredDocs.map((doc) => (
                            <div key={doc.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{doc.name}</p>
                                        <p className="text-[10px] text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={(e) => handleDeleteDoc(doc.id, e)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                    {chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Workspace Chat</h3>
                            <p className="text-slate-500 text-sm">Upload documents and ask questions. The AI will search across all files to find the answer.</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <div key={chat.id} className={`flex gap-4 ${chat.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${chat.role === "user" ? "bg-slate-800 text-white" : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                                    }`}>
                                    {chat.role === "user" ? "U" : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className={`flex flex-col max-w-[80%] ${chat.role === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${chat.role === "user"
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                                        }`}>
                                        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                            {chat.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {sending && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white animate-pulse">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
                        </div>
                    )}
                    <form onSubmit={handleAskQuestion} className="relative">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask across all documents..."
                            disabled={sending}
                            className="w-full pl-6 pr-32 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={!question.trim() || sending}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send
                        </button>
                    </form>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
            `}</style>
        </div>
    );
}
