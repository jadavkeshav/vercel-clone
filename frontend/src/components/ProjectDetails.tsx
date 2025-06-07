import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useProject } from "../context/ProjectContext";

interface Project {
	_id: string;
	id: number;
	name: string;
	slug?: string;
	gitRepoUrl?: string;
	domain?: {
		subdomain: string;
	};
}

const ProjectDetails: React.FC = () => {
	const { id } = useParams();
	const { getProject, deleteProject } = useProject();

	const [project, setProject] = useState<Project | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	useEffect(() => {
		const fetchProject = async () => {
			if (id) {
				const fetched = await getProject(id);
				console.log("Project : ", fetched);
				setProject(fetched);
			}
		};
		fetchProject();
	}, [id]);

	const onBack = () => {
		window.history.back();
	};

	const handleDeleteConfirm = async () => {
		setIsDeleting(true);
		try {
			await deleteProject(project?._id);
			console.log(`Confirmed deletion of project: ${project?.name}`);
			toast.success("Project deleted successfully");
			setShowConfirm(false);
			onBack();
		} catch (error) {
			toast.error("Failed to delete project");
			setIsDeleting(false);
		}
	};

	const deploymentUrl = project?.domain?.subdomain
		? `http://${project.domain.subdomain}.localhost:8000`
		: "";

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
				<div className="flex items-center">
					<button
						onClick={onBack}
						className="mr-4 p-2 rounded-md hover:bg-gray-800 transition-colors flex items-center"
					>
						<span className="text-lg">←</span>
						<span className="ml-2 text-sm">Back</span>
					</button>
					<div>
						<h1 className="text-3xl font-bold">{project?.name}</h1>
						<p className="text-gray-400 text-sm">
							{project?.slug || project?.name?.toLowerCase().replace(/\s+/g, "-")}
						</p>
					</div>
				</div>

				{deploymentUrl && (
					<div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
						<div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
							<h3 className="text-lg font-medium">Preview Deployment</h3>
							<a
								href={deploymentUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-blue-400 hover:underline"
							>
								Open in new tab ↗
							</a>
						</div>
						<div className="h-80">
							<iframe
								src={deploymentUrl}
								title="Live Project Preview"
								className="w-full h-full"
								frameBorder="0"
							></iframe>
						</div>
					</div>
				)}

				<div className="bg-gray-900 border border-gray-800 rounded-lg">
					<div className="p-6 border-b border-gray-800">
						<h2 className="text-xl font-semibold">Project Details</h2>
						<p className="text-gray-400 text-sm mt-1">Information about your project</p>
					</div>

					<div className="p-6 space-y-6">
						{project?.gitRepoUrl && (
							<div>
								<p className="text-sm text-gray-400 mb-2">Git Repository</p>
								<a
									href={project.gitRepoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-400 hover:underline break-all"
								>
									{project.gitRepoUrl}
								</a>
							</div>
						)}

						{deploymentUrl && (
							<div>
								<p className="text-sm text-gray-400 mb-2">Deployment URL</p>
								<a
									href={deploymentUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-400 hover:underline break-all"
								>
									{deploymentUrl}
								</a>
							</div>
						)}
					</div>

					<div className="flex justify-end border-t border-gray-800 p-6">
						<button
							onClick={() => setShowConfirm(true)}
							disabled={isDeleting}
							className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
						>
							<span className="mr-2">🗑️</span>
							{isDeleting ? "Deleting..." : "Delete Project"}
						</button>
					</div>
				</div>
			</div>

			{showConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
						<h2 className="text-xl font-semibold text-white mb-4">Are you sure?</h2>
						<p className="text-gray-400 text-sm mb-6">
							This action will permanently delete the project <strong>{project?.name}</strong>.
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => setShowConfirm(false)}
								className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={isDeleting}
								className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
							>
								{isDeleting ? "Deleting..." : "Yes, Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProjectDetails;
