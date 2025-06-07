import React, { useEffect, useState } from "react";
import { useProject } from "../context/ProjectContext";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { fetchProjects, projects, createProject } = useProject();

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
        setIsError(false);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="lg:text-4xl sm:text-2xl font-bold truncate">Projects</h1>
            <p className="text-gray-400 text-xs lg:text-xl">Manage your deployments</p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-white sm:text-2xl transition-colors px-4 py-2 rounded-md text-black whitespace-nowrap"
          >
            New Project
          </button>
        </div>

        {isLoading && <p>Loading projects...</p>}
        {isError && <p className="text-red-500">Failed to load projects</p>}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              url = {`http://${project.domain.subdomain}.localhost:8000`}
              onClick={() => {
                navigate(`/project/${project._id}`);
              }}
            />
          ))}
        </div>
      </main>

      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
