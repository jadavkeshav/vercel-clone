import { useState, useEffect } from "react"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import Dashboard from "./components/Dashboard"
import ProjectDetails from "./components/ProjectDetails"

export interface User {
  email: string
  name: string
  avatar: string
}

export interface Project {
  id: number
  name: string
  status: "deployed" | "building" | "failed"
  url: string | null
  lastDeployed: string
  gitUrl: string
  framework: string
  description?: string
  buildLogs?: string[]
  environmentVars?: { [key: string]: string }
  domains?: string[]
}

type PageType = "login" | "register" | "dashboard" | "project-details"

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("login")
  const [user, setUser] = useState<User | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "my-portfolio",
      status: "deployed",
      url: "https://my-portfolio-demo.vercel.app",
      lastDeployed: "2 hours ago",
      gitUrl: "https://github.com/user/my-portfolio",
      framework: "nextjs",
      description: "Personal portfolio website built with Next.js",
      environmentVars: { NODE_ENV: "production", API_URL: "https://api.example.com" },
      domains: ["my-portfolio-demo.vercel.app", "portfolio.example.com"],
    },
    {
      id: 2,
      name: "ecommerce-app",
      status: "building",
      url: null,
      lastDeployed: "Building...",
      gitUrl: "https://github.com/user/ecommerce-app",
      framework: "react",
      description: "E-commerce application with React and Node.js",
      buildLogs: [
        "🔄 Cloning repository...",
        "✅ Repository cloned successfully",
        "📦 Installing dependencies...",
        "⬇️  npm install",
        "📦 Installing react@18.2.0",
      ],
      environmentVars: { STRIPE_KEY: "pk_test_...", DATABASE_URL: "postgresql://..." },
    },
    {
      id: 3,
      name: "blog-site",
      status: "deployed",
      url: "https://blog-site-demo.vercel.app",
      lastDeployed: "1 day ago",
      gitUrl: "https://github.com/user/blog-site",
      framework: "nuxt",
      description: "Blog website built with Nuxt.js and Contentful CMS",
      environmentVars: { CONTENTFUL_SPACE_ID: "abc123", CONTENTFUL_ACCESS_TOKEN: "def456" },
      domains: ["blog-site-demo.vercel.app"],
    },
  ])

  useEffect(() => {
    const savedUser = localStorage.getItem("vercel-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentPage("dashboard")
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("vercel-user", JSON.stringify(userData))
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("vercel-user")
    setCurrentPage("login")
    setSelectedProject(null)
  }

  const handleRegister = (userData: User) => {
    setUser(userData)
    localStorage.setItem("vercel-user", JSON.stringify(userData))
    setCurrentPage("dashboard")
  }

  const addProject = (projectData: { name: string; gitUrl: string; framework: string }): number => {
    const newProject: Project = {
      id: Date.now(),
      name: projectData.name,
      status: "building",
      url: null,
      lastDeployed: "Building...",
      gitUrl: projectData.gitUrl,
      framework: projectData.framework,
      description: `${projectData.framework} application`,
      buildLogs: [],
      environmentVars: {},
      domains: [],
    }
    setProjects((prev) => [newProject, ...prev])
    return newProject.id
  }

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updates } : project)))
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null)
      setCurrentPage("dashboard")
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setCurrentPage("project-details")
  }

  const handleBackToDashboard = () => {
    setSelectedProject(null)
    setCurrentPage("dashboard")
  }

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage("register")} />
  }

  if (currentPage === "register") {
    return <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage("login")} />
  }

  if (currentPage === "project-details" && selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={handleBackToDashboard}
        onUpdate={updateProject}
        onDelete={deleteProject}
        user={user!}
      />
    )
  }

  return (
    <Dashboard
      user={user!}
      projects={projects}
      onLogout={handleLogout}
      onAddProject={addProject}
      onUpdateProject={updateProject}
      onProjectClick={handleProjectClick}
    />
  )
}

export default App
