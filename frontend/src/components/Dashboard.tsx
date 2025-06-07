import type React from "react";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import BuildLogsView from "./BuildLogsView";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
	const { user, logout } = useAuth();

	const [showNewProjectModal, setShowNewProjectModal] = useState(false);
	const [showBuildLogs, setShowBuildLogs] = useState(false);
	const [currentBuildProject, setCurrentBuildProject] = useState<number | null>(null);

	const handleNewProject = (projectData: { name: string; gitUrl: string; framework: string }) => {
		const projectId = onAddProject(projectData);
		setShowNewProjectModal(false);
		setCurrentBuildProject(projectId);
		setShowBuildLogs(true);
	};

	const handleBuildComplete = (projectId: number, success: boolean) => {
		if (success) {
			const projectName = projects.find((p) => p.id === projectId)?.name || "project";
			onUpdateProject(projectId, {
				status: "deployed",
				url: `https://${projectName}-demo.vercel.app`,
				lastDeployed: "Just now",
				domains: [`${projectName}-demo.vercel.app`],
			});
		} else {
			onUpdateProject(projectId, {
				status: "failed",
				lastDeployed: "Failed",
			});
		}
		setShowBuildLogs(false);
		setCurrentBuildProject(null);
	};

	if (showBuildLogs && currentBuildProject) {
		return (
			<BuildLogsView
				projectId={currentBuildProject}
				onComplete={handleBuildComplete}
				onBack={() => {
					setShowBuildLogs(false);
					setCurrentBuildProject(null);
				}}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-black">
			{/* Header */}
			<header className="border-b border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-4">
							<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
								<span className="text-black font-bold text-sm">VC</span>
							</div>
							<nav className="flex space-x-8">
								<a href="#" className="text-white font-medium">
									Overview
								</a>
								<a href="#" className="text-gray-400 hover:text-white">
									Projects
								</a>
								<a href="#" className="text-gray-400 hover:text-white">
									Integrations
								</a>
								<a href="#" className="text-gray-400 hover:text-white">
									Settings
								</a>
							</nav>
						</div>

						<div className="flex items-center space-x-4">
							<button className="text-gray-400 hover:text-white">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
								</svg>
							</button>

							<div className="flex items-center space-x-3">
								{/* <img src={"/placeholder.svg"} alt={user?.name} className="w-8 h-8 rounded-full" /> */}
								<span className="text-white text-sm">{user?.name}</span>
								<button onClick={logout} className="text-gray-400 hover:text-white text-sm">
									Sign out
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-white">Projects</h1>
						<p className="text-gray-400 mt-1">Manage and deploy your applications</p>
					</div>

					<button onClick={() => setShowNewProjectModal(true)} className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
						New Project
					</button>
				</div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} onClick={() => onProjectClick(project)} />
					))}
				</div>

				{projects.length === 0 && (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
						</div>
						<h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
						<p className="text-gray-400 mb-6">Get started by creating your first project</p>
						<button onClick={() => setShowNewProjectModal(true)} className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
							Create Project
						</button>
					</div>
				)}
			</main>

			{/* New Project Modal */}
			{showNewProjectModal && <NewProjectModal onClose={() => setShowNewProjectModal(false)} onSubmit={handleNewProject} />}
		</div>
	);
};

export default Dashboard;
