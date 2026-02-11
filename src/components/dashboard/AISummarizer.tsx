"use client";

import { useState } from "react";
import { Youtube, Loader2, Download, Copy, Edit2, Check, FileText, FileCode, PlayCircle, Save, Library, Sparkles, Trash2, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { extractTranscript, generateStudyNotes, saveNote, getSavedNotes, deleteNote } from "@/lib/ai-actions";
import { useEffect } from "react";

const MODES = [
    { id: "Quick Summary", label: "Quick Summary", description: "Get a high-level overview fast." },
    { id: "Exam-Focused Notes", label: "Exam-Focused", description: "Prioritize facts, dates, and key details." },
    { id: "Beginner Friendly", label: "Beginner Friendly", description: "Simple language and basic explanations." },
    { id: "Technical / Deep Dive", label: "Technical / Deep Dive", description: "Detailed notes on complex concepts." },
];

export function AISummarizer() {
    const [activeTab, setActiveTab] = useState<"generator" | "library">("generator");
    // Generator State
    const [inputType, setInputType] = useState<"youtube" | "manual">("youtube");
    const [url, setUrl] = useState("");
    const [manualText, setManualText] = useState("");
    const [mode, setMode] = useState(MODES[0].id);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    // Library State
    const [savedNotes, setSavedNotes] = useState<any[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);

    useEffect(() => {
        if (activeTab === "library") {
            fetchLibrary();
        }
    }, [activeTab]);

    const fetchLibrary = async () => {
        setLoadingLibrary(true);
        try {
            const res = await getSavedNotes();
            if (res.success) setSavedNotes(res.notes!);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            const res = await deleteNote(id);
            if (res.success) {
                setSavedNotes(savedNotes.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleGenerate = async () => {
        if (inputType === "youtube" && !url) return;
        if (inputType === "manual" && !manualText) return;

        setLoading(true);
        setContent("");

        try {
            let processedTranscript = "";

            if (inputType === "youtube") {
                setStatus("Extracting transcript...");
                const transcriptRes = await extractTranscript(url);
                if (!transcriptRes.success) {
                    throw new Error(transcriptRes.error);
                }
                processedTranscript = transcriptRes.transcript!;
            } else {
                processedTranscript = manualText;
            }

            setStatus("Generating study notes with AI...");
            const notesRes = await generateStudyNotes(processedTranscript, mode);
            if (!notesRes.success) {
                throw new Error(notesRes.error);
            }

            setContent(notesRes.content!);
            setStatus("");
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = (format: 'md' | 'txt') => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `study-notes.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus("");
        try {
            // Extract a title from the content (usually the first line or TITLE: ...)
            const titleMatch = content.match(/TITLE:\s*(.*)/i) || content.match(/^# (.*)/);
            const title = titleMatch ? titleMatch[1] : "Untitled Study Note";

            const res = await saveNote(title, content, url, mode);
            if (!res.success) throw new Error(res.error);

            setSaveStatus("Saved successfully!");
            setTimeout(() => setSaveStatus(""), 3000);
        } catch (error: any) {
            setSaveStatus(`Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("generator")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "generator" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                    <PlayCircle className="w-4 h-4" />
                    Generator
                </button>
                <button
                    onClick={() => setActiveTab("library")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "library" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                    <Library className="w-4 h-4" />
                    My Library
                </button>
            </div>

            {activeTab === "generator" ? (
                <>
                    {/* Input Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Input Source</label>
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setInputType("youtube")}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${inputType === "youtube" ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                                    >
                                        YouTube URL
                                    </button>
                                    <button
                                        onClick={() => setInputType("manual")}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${inputType === "manual" ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                                    >
                                        Manual Text
                                    </button>
                                </div>

                                {inputType === "youtube" ? (
                                    <div className="relative">
                                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <textarea
                                        value={manualText}
                                        onChange={(e) => setManualText(e.target.value)}
                                        placeholder="Paste video transcript or any study material here..."
                                        className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white resize-none"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Selection Mode</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {MODES.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMode(m.id)}
                                            className={`p-4 rounded-xl border text-left transition-all ${mode === m.id
                                                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 ring-1 ring-indigo-600"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                                                }`}
                                        >
                                            <div className={`font-bold text-sm ${mode === m.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"}`}>{m.label}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">{m.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || (inputType === "youtube" && !url) || (inputType === "manual" && !manualText)}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{status || "Processing..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="w-5 h-5" />
                                        <span>Generate Study Notes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    {content && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-900 dark:text-white font-bold text-sm">Study Content</span>
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">{mode}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`p-2 rounded-lg transition-all ${isEditing ? "bg-indigo-600 text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                                        title="Toggle Edit Mode"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg transition-all"
                                        title="Copy to Clipboard"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                    <button
                                        onClick={() => handleDownload('md')}
                                        className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-all flex items-center gap-1.5 px-3"
                                    >
                                        <FileCode className="w-4 h-4" />
                                        <span className="text-xs font-bold">MD</span>
                                    </button>
                                    <button
                                        onClick={() => handleDownload('txt')}
                                        className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-all flex items-center gap-1.5 px-3"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span className="text-xs font-bold">TXT</span>
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 px-3"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs font-bold">PDF</span>
                                    </button>
                                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className={`p-2 rounded-lg transition-all flex items-center gap-1.5 px-3 ${saveStatus === "Saved successfully!" ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        <span className="text-xs font-bold">
                                            {saveStatus === "Saved successfully!" ? "Saved" : "Save to account"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                                {isEditing ? (
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full min-h-[500px] p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-sm leading-relaxed text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="markdown-container">
                                        <ReactMarkdown
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-slate-800" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-4 flex items-center gap-2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3" {...props} />,
                                                p: ({ node, ...props }) => <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 font-medium" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="space-y-2 mb-6 list-disc pl-5 text-slate-600 dark:text-slate-300" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-slate-600 dark:text-slate-300 font-medium" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                                                blockquote: ({ node, ...props }) => (
                                                    <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-r-xl my-6 text-slate-700 dark:text-slate-300 italic font-medium" {...props} />
                                                ),
                                            }}
                                        >
                                            {content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                    }

                    {
                        status && !loading && status.startsWith("Error") && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium">
                                {status}
                            </div>
                        )
                    }
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {loadingLibrary ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p className="font-bold">Loading your library...</p>
                        </div>
                    ) : savedNotes.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                            <Library className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-bold">No saved notes yet.</p>
                            <button
                                onClick={() => setActiveTab("generator")}
                                className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                                Generate your first summary →
                            </button>
                        </div>
                    ) : (
                        savedNotes.map((note) => (
                            <div key={note.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider">{note.mode}</span>
                                        <button
                                            onClick={() => handleDelete(note.id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{note.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 font-medium leading-relaxed">
                                        {note.content.substring(0, 150)}...
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(note.createdAt).toLocaleDateString()}</span>
                                    <button
                                        onClick={() => {
                                            setContent(note.content);
                                            setUrl(note.videoUrl);
                                            setMode(note.mode);
                                            setActiveTab("generator");
                                        }}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        View Details
                                        <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div >
    );
}
