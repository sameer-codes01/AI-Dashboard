
import { getWorkspace } from "@/actions/workspace-actions";
import { getDocuments } from "@/actions/document-actions";
import { getWorkspaceChatHistory } from "@/actions/chat-actions";
import WorkspaceView from "@/components/workspace-view";
import { notFound } from "next/navigation";

interface WorkspacePageProps {
    params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
    const { id } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        notFound();
    }

    // Fetch initial data in parallel
    const [documents, chatHistoryRes] = await Promise.all([
        getDocuments(id),
        getWorkspaceChatHistory(id),
    ]);

    const chats = chatHistoryRes.success ? chatHistoryRes.chats : [];

    return (
        <div className="flex flex-col h-full p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                    {workspace.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Multi-document AI Integration
                </p>
            </div>

            <WorkspaceView
                workspaceId={id}
                initialDocuments={documents}
                initialChats={chats!}
            />
        </div>
    );
}
