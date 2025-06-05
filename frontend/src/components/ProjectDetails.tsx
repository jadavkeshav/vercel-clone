import type React from "react";

import { useState } from "react";
import type { Project, User } from "../App";

interface ProjectDetailsProps {
	project: Project;
	onBack: () => void;
	onUpdate: (id: number, updates: Partial<Project>) => void;
	onDelete: (id: number) => void;
	user: User;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onBack, onUpdate, onDelete, user }) => {
	const [activeTab, setActiveTab] = useState<"overview" | "settings" | "deployments">("overview");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [newDomain, setNewDomain] = useState("");
	const [newEnvVar, setNewEnvVar] = useState({ key: "", value: "" });

	const handleAddDomain = () => {
		if (newDomain.trim()) {
			const updatedDomains = [...(project.domains || []), newDomain.trim()];
			onUpdate(project.id, { domains: updatedDomains });
			setNewDomain("");
		}
	};

	const handleRemoveDomain = (domain: string) => {
		const updatedDomains = (project.domains || []).filter((d) => d !== domain);
		onUpdate(project.id, { domains: updatedDomains });
	};

	const handleAddEnvVar = () => {
		if (newEnvVar.key.trim() && newEnvVar.value.trim()) {
			const updatedEnvVars = {
				...(project.environmentVars || {}),
				[newEnvVar.key.trim()]: newEnvVar.value.trim(),
			};
			onUpdate(project.id, { environmentVars: updatedEnvVars });
			setNewEnvVar({ key: "", value: "" });
		}
	};

	const handleRemoveEnvVar = (key: string) => {
		const updatedEnvVars = { ...(project.environmentVars || {}) };
		delete updatedEnvVars[key];
		onUpdate(project.id, { environmentVars: updatedEnvVars });
	};

	const handleDeleteProject = () => {
		onDelete(project.id);
		setShowDeleteModal(false);
	};

	const getStatusColor = (status: Project["status"]) => {
		switch (status) {
			case "deployed":
				return "text-green-400 bg-green-900/20";
			case "building":
				return "text-yellow-400 bg-yellow-900/20";
			case "failed":
				return "text-red-400 bg-red-900/20";
			default:
				return "text-gray-400 bg-gray-900/20";
		}
	};

	return (
		<div className="min-h-screen bg-black">
			{/* Header */}
			<header className="border-b border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-4">
							<button onClick={onBack} className="text-gray-400 hover:text-white flex items-center space-x-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
								<span>Back</span>
							</button>

							<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
								<span className="text-black font-bold text-sm">VC</span>
							</div>

							<div>
								<h1 className="text-white font-medium text-lg">{project.name}</h1>
								<p className="text-gray-400 text-sm">{project.gitUrl}</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>{project.status}</span>
							<img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
						</div>
					</div>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className="border-b border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<nav className="flex space-x-8">
						{["overview", "settings", "deployments"].map((tab) => (
							<button key={tab} onClick={() => setActiveTab(tab as any)} className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-white"}`}>
								{tab}
							</button>
						))}
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{activeTab === "overview" && (
					<div className="space-y-8">
						{/* Project Preview */}
						{project.url && project.status === "deployed" && (
							<div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
								<div className="px-6 py-4 border-b border-gray-800">
									<h2 className="text-white font-medium">Live Preview</h2>
									<p className="text-gray-400 text-sm">Preview of your deployed application</p>
								</div>
								<div className="p-6">
									<div className="bg-white rounded-lg overflow-hidden" style={{ height: "400px" }}>
										<iframe src={project.url} className="w-full h-full border-0" title={`Preview of ${project.name}`} sandbox="allow-scripts allow-same-origin" />
									</div>
									<div className="mt-4 flex items-center justify-between">
										<a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
											<span>Open in new tab</span>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</a>
										<span className="text-gray-400 text-sm">Last deployed: {project.lastDeployed}</span>
									</div>
								</div>
							</div>
						)}

						{/* Project Info */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
								<h3 className="text-white font-medium mb-4">Project Information</h3>
								<div className="space-y-3">
									<div>
										<span className="text-gray-400 text-sm">Framework:</span>
										<p className="text-white capitalize">{project.framework}</p>
									</div>
									<div>
										<span className="text-gray-400 text-sm">Repository:</span>
										<p className="text-white break-all">{project.gitUrl}</p>
									</div>
									<div>
										<span className="text-gray-400 text-sm">Description:</span>
										<p className="text-white">{project.description || "No description provided"}</p>
									</div>
									<div>
										<span className="text-gray-400 text-sm">Status:</span>
										<p className={`capitalize ${getStatusColor(project.status).split(" ")[0]}`}>{project.status}</p>
									</div>
								</div>
							</div>

							<div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
								<h3 className="text-white font-medium mb-4">Domains</h3>
								<div className="space-y-2">
									{project.domains && project.domains.length > 0 ? (
										project.domains.map((domain) => (
											<div key={domain} className="flex items-center justify-between bg-gray-800 rounded p-2">
												<span className="text-white text-sm">{domain}</span>
												<button onClick={() => handleRemoveDomain(domain)} className="text-red-400 hover:text-red-300">
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										))
									) : (
										<p className="text-gray-400 text-sm">No custom domains configured</p>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "settings" && (
					<div className="space-y-8">
						{/* Environment Variables */}
						<div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
							<h3 className="text-white font-medium mb-4">Environment Variables</h3>
							<div className="space-y-4">
								{project.environmentVars && Object.keys(project.environmentVars).length > 0 ? (
									Object.entries(project.environmentVars).map(([key, value]) => (
										<div key={key} className="flex items-center justify-between bg-gray-800 rounded p-3">
											<div className="flex-1">
												<span className="text-white font-medium">{key}</span>
												<p className="text-gray-400 text-sm">{"*".repeat(value.length)}</p>
											</div>
											<button onClick={() => handleRemoveEnvVar(key)} className="text-red-400 hover:text-red-300 ml-4">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									))
								) : (
									<p className="text-gray-400">No environment variables configured</p>
								)}

								<div className="flex space-x-2">
									<input type="text" placeholder="Variable name" value={newEnvVar.key} onChange={(e) => setNewEnvVar({ ...newEnvVar, key: e.target.value })} className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
									<input type="text" placeholder="Value" value={newEnvVar.value} onChange={(e) => setNewEnvVar({ ...newEnvVar, value: e.target.value })} className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
									<button onClick={handleAddEnvVar} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
										Add
									</button>
								</div>
							</div>
						</div>

						{/* Custom Domains */}
						<div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
							<h3 className="text-white font-medium mb-4">Custom Domains</h3>
							<div className="space-y-4">
								{project.domains && project.domains.length > 0 ? (
									project.domains.map((domain) => (
										<div key={domain} className="flex items-center justify-between bg-gray-800 rounded p-3">
											<span className="text-white">{domain}</span>
											<button onClick={() => handleRemoveDomain(domain)} className="text-red-400 hover:text-red-300">
												Remove
											</button>
										</div>
									))
								) : (
									<p className="text-gray-400">No custom domains configured</p>
								)}

								<div className="flex space-x-2">
									<input type="text" placeholder="example.com" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
									<button onClick={handleAddDomain} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
										Add Domain
									</button>
								</div>
							</div>
						</div>

						{/* Danger Zone */}
						<div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
							<h3 className="text-red-400 font-medium mb-4">Danger Zone</h3>
							<div className="flex items-center justify-between">
								<div>
									<h4 className="text-white font-medium">Delete Project</h4>
									<p className="text-gray-400 text-sm">Once you delete a project, there is no going back. Please be certain.</p>
								</div>
								<button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
									Delete Project
								</button>
							</div>
						</div>
					</div>
				)}

				{activeTab === "deployments" && (
					<div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
						<h3 className="text-white font-medium mb-4">Deployment History</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between bg-gray-800 rounded p-4">
								<div className="flex items-center space-x-3">
									<div className="w-3 h-3 bg-green-400 rounded-full"></div>
									<div>
										<p className="text-white font-medium">Production Deployment</p>
										<p className="text-gray-400 text-sm">{project.lastDeployed}</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									{project.url && (
										<a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
											Visit
										</a>
									)}
									<button className="text-gray-400 hover:text-white text-sm">View Logs</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
						<h3 className="text-white font-medium text-lg mb-4">Delete Project</h3>
						<p className="text-gray-400 mb-6">
							Are you sure you want to delete <strong className="text-white">{project.name}</strong>? This action cannot be undone.
						</p>
						<div className="flex justify-end space-x-3">
							<button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">
								Cancel
							</button>
							<button onClick={handleDeleteProject} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
								Delete Project
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProjectDetails;
