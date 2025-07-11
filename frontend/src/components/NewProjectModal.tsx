import type React from "react";

import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface NewProjectModalProps {
	onClose: () => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose }) => {
	const [formData, setFormData] = useState({
		gitUrl: "",
		name: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const { createProject } = useProject();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		let projectName = formData.name;
		if (!projectName && formData.gitUrl) {
			const urlParts = formData.gitUrl.split("/");
			projectName = urlParts[urlParts.length - 1].replace(".git", "");
		}

		try {
			const res: any = await createProject(projectName, formData.gitUrl);
			toast.success("Project created successfully");
			setIsLoading(false);
			onClose();
			navigate(`/logs/${res?.project?.slug}`);
		} catch (error) {
			console.error("Error creating project:", error);
			toast.error("Error creating project");
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold text-white">Import Git Repository</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-white">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="gitUrl" className="block text-sm font-medium text-gray-300 mb-2">
							Git Repository URL
						</label>
						<input id="gitUrl" name="gitUrl" type="url" required value={formData.gitUrl} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://github.com/username/repository" />
					</div>

					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
							Project Name (optional)
						</label>
						<input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="my-awesome-project" />
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
							Cancel
						</button>
						<button type="submit" disabled={isLoading || !formData.gitUrl} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Importing...</span>
								</>
							) : (
								<span>Deploy</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewProjectModal;
