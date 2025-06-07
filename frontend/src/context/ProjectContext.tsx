import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Project {
  _id: string;
  name: string;
  gitRepoUrl: string;
  status: string;
  deploymentUrl?: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

interface Domain {
  _id: string;
  domainName: string;
  isCustom: boolean;
}

interface ProjectContextType {
  projects: Project[];
  fetchProjects: () => Promise<void>;
  createProject: (name: string, gitRepoUrl: string) => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectStatus: (id: string, status: string) => Promise<void>;
  getProjectDomain: (projectId: string) => Promise<Domain | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const BASE_URL = "http://localhost:9000/api";

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get( BASE_URL+"/projects");
      console.log("res" , res)      
      setProjects(res.data.projects || res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const createProject = async (name: string, gitRepoUrl: string) => {
    try {
      const res = await axios.post(BASE_URL+"/projects", { name, gitRepoUrl });
      await fetchProjects();
      return res.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const getProject = async (id: string): Promise<Project | null> => {
    try {
      const res = await axios.get(BASE_URL+`/projects/${id}`);
      return res.data.project || res.data;
    } catch (error) {
      console.error("Error getting project:", error);
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await axios.delete(BASE_URL+`/projects/${id}`);
      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const updateProjectStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${BASE_URL}/projects/${id}/status`, { status });
      await fetchProjects();
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  const getProjectDomain = async (projectId: string): Promise<Domain | null> => {
    try {
      const res = await axios.get(`${BASE_URL}/projects/${projectId}/domain`);
      return res.data.domain || res.data;
    } catch (error) {
      console.error("Error fetching domain:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        fetchProjects,
        createProject,
        getProject,
        deleteProject,
        updateProjectStatus,
        getProjectDomain,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
