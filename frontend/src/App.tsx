import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import EmailVerificationPage from "./components/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { ProjectProvider } from "./context/ProjectContext";
import BuildLogsView from "./components/BuildLogsView";
import ProjectDetails from "./components/ProjectDetails";

interface Props {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const { isAuthenticated, user } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!user?.isVerified) {
		return <Navigate to="/verify-email" replace />;
	}

	return children;
};

const RedirectAuthenticatedUser: React.FC<Props> = ({ children }) => {
	const { isAuthenticated, user } = useAuth();

	if (isAuthenticated && !user?.isVerified) {
		// Logged in but not verified
		return <Navigate to="/verify-email" replace />;
	}

	console.log(user, isAuthenticated);

	if (isAuthenticated && user?.isVerified) {
		return <Navigate to="/" replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuth();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <div>Loading</div>;

	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<ProjectProvider>
								<Dashboard />
							</ProjectProvider>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/logs/:slug"
					element={
						<ProtectedRoute>
							<ProjectProvider>
								<BuildLogsView />
							</ProjectProvider>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/project/:id"
					element={
						<ProtectedRoute>
							<ProjectProvider>
								<ProjectDetails />
							</ProjectProvider>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<RedirectAuthenticatedUser>
							<RegisterPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/login"
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="/verify-email" element={<EmailVerificationPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster position="top-center" reverseOrder={false} />
		</>
	);
}

export default App;
