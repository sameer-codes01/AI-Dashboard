
import { getWorkspaces, createWorkspace } from "@/actions/workspace-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Folder } from "lucide-react";

export default async function WorkspacesPage() {
    const workspaces = await getWorkspaces();

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    My Workspaces
                </h1>

                {/* Simple Form for creating workspace */}
                <form action={createWorkspace} className="flex gap-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="New Workspace Name"
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Create
                    </button>
                </form>
            </div>

            {workspaces.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <Folder size={64} className="mx-auto text-gray-700 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-400">No workspaces yet</h2>
                    <p className="text-gray-500 mt-2">Create one to start uploading documents.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces.map((workspace) => (
                        <Link
                            key={workspace.id}
                            href={`/dashboard/workspaces/${workspace.id}`}
                            className="group block p-6 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-purple-500/50 rounded-xl transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                                        {workspace.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {new Date(workspace.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Folder className="text-gray-600 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
                                <span>{workspace._count.documents} documents</span>
                                <span className="group-hover:translate-x-1 transition-transform">View &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
