"use client";

import { useState, useEffect, useRef } from "react";
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
    Paperclip,
    Search
} from "lucide-react";
import { uploadDocument, getDocuments, deleteDocument, getDocument } from "@/lib/document-actions";
import { askQuestion, getChatHistory } from "@/lib/chat-actions";
import ReactMarkdown from "react-markdown";

export function DocumentQA() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [chats, setChats] = useState<any[]>([]);
    const [question, setQuestion] = useState("");
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (selectedDocId) {
            fetchDocumentDetails(selectedDocId);
            fetchChatHistory(selectedDocId);
        } else {
            setSelectedDoc(null);
            setChats([]);
        }
    }, [selectedDocId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    const fetchDocuments = async () => {
        setLoadingDocs(true);
        try {
            const res = await getDocuments();
            if (res.success) setDocuments(res.documents!);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDocs(false);
        }
    };

    const fetchDocumentDetails = async (id: string) => {
        try {
            const res = await getDocument(id);
            if (res.success) setSelectedDoc(res.document);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchChatHistory = async (id: string) => {
        setLoadingChat(true);
        try {
            const res = await getChatHistory(id);
            if (res.success) setChats(res.chats!);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingChat(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;


        setUploading(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);

        try {

            const startTime = Date.now();
            const res = await uploadDocument(formData);
            const duration = Date.now() - startTime;


            if (res.success) {

                await fetchDocuments();
                if (res.documentId) {
                    setSelectedDocId(res.documentId);
                }
            } else {
                console.error(">>> [CLIENT] Upload returned failure:", res.error);
                setError(res.error || "Upload failed");
            }
        } catch (err: any) {
            console.error(">>> [CLIENT] CRITICAL FETCH ERROR:", err);
            setError(err.message || "Upload failed");
        } finally {

            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const res = await deleteDocument(id);
            if (res.success) {
                setDocuments(documents.filter(d => d.id !== id));
                if (selectedDocId === id) setSelectedDocId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || !selectedDocId || sending) return;

        const currentQuestion = question;
        setQuestion("");
        setSending(true);

        // Optimistic UI update
        const userMsg = { id: Date.now().toString(), text: currentQuestion, role: "user" };
        setChats(prev => [...prev, userMsg]);

        try {
            const res = await askQuestion(selectedDocId, currentQuestion);
            if (res.success) {
                // Update the temporary user message with its real ID from the DB
                // and append the assistant's message.
                setChats(prev => [
                    ...prev.filter(m => m.id !== userMsg.id),
                    res.userMessage!,
                    res.assistantMessage!
                ]);
            } else {
                setError(res.error || "Failed to get answer");
                setChats(prev => prev.filter(m => m.id !== userMsg.id)); // Rollback
            }
        } catch (err: any) {
            console.error(">>> [CLIENT] Ask Question Error:", err);
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
        <div className="flex h-[calc(100vh-180px)] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {/* Sidebar - Document List */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950/50 backdrop-blur-xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Documents
                        </h2>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            title="Upload Document"
                        >
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.txt"
                        />
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {loadingDocs ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 px-4">
                            <File className="w-10 h-10 mx-auto mb-4 opacity-10" />
                            <p className="text-sm font-medium">No documents found.</p>
                        </div>
                    ) : (
                        filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => setSelectedDocId(doc.id)}
                                className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${selectedDocId === doc.id
                                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 shadow-sm"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent"
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-2.5 rounded-xl ${selectedDocId === doc.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors"}`}>
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className={`text-sm font-bold truncate ${selectedDocId === doc.id ? "text-indigo-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                            {doc.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteDoc(doc.id, e)}
                                    className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                {selectedDocId ? (
                    <>
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-all">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white leading-none">
                                        {selectedDoc?.name || "Loading..."}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                            AI Agent Ready
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedDocId(null)}
                                    className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                            {loadingChat ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                    <span className="text-sm font-bold uppercase tracking-[0.2em]">Loading Chat...</span>
                                </div>
                            ) : chats.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 animate-bounce">
                                        <MessageSquare className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Start a conversation</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        Ask anything about this document. Our AI will analyze the content and provide accurate answers.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {chats.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className={`flex gap-4 ${chat.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                        >
                                            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${chat.role === "user"
                                                ? "bg-slate-800 text-white"
                                                : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                                                }`}>
                                                {chat.role === "user" ? "U" : <Sparkles className="w-5 h-5" />}
                                            </div>
                                            <div className={`flex flex-col max-w-[80%] ${chat.role === "user" ? "items-end" : "items-start"}`}>
                                                <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${chat.role === "user"
                                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                                                    }`}>
                                                    {chat.role === "assistant" ? (
                                                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                                                            <ReactMarkdown>{chat.text}</ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        chat.text
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-2 px-2">
                                                    {chat.role === "user" ? "You" : "AI Assistant"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {sending && (
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Box */}
                        <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
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
                                    placeholder="Ask a question about this document..."
                                    disabled={sending}
                                    className="w-full pl-6 pr-32 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white shadow-inner"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!question.trim() || sending}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        <span>Send</span>
                                    </button>
                                </div>
                            </form>
                            <p className="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                AI can make mistakes. Always verify important information.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-[2.5rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-2xl shadow-indigo-500/10">
                            <FileText className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Document Intelligence</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                            Upload your PDF or text documents to start an interactive conversation.
                            Our AI extracts insights, summarizes content, and answers complex questions instantly.
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:scale-95"
                        >
                            <Upload className="w-6 h-6" />
                            Upload your first document
                        </button>
                    </div>
                )}
            </div>

            {/* Sparkles Decoration */}
            <div className="fixed top-0 right-0 p-8 pointer-events-none opacity-20">
                <Sparkles className="w-32 h-32 text-indigo-500 animate-pulse" />
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
}

const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
)
