import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export interface User {
	id: string;
	name: string;
	email: string;
	isVerified: boolean;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isCheckingAuth: boolean;
	error: string | null;
	message: string | null;
	signup: (email: string, password: string, name: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	verifyEmail: (code: string) => Promise<any>;
	checkAuth: () => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	resetPassword: (token: string, password: string) => Promise<void>;
	resendVerificationCode: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:9000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const signup = async (email: string, password: string, name: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await axios.post(`${API_URL}/signup`, {
				email,
				password,
				name,
			});
			setUser(res.data.user);
			setIsAuthenticated(true);
		} catch (err: any) {
			setError(err.response?.data?.message || "Error signing up");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await axios.post(`${API_URL}/login`, {
				email,
				password,
			});
			setUser(res.data.user);
			setIsAuthenticated(true);
		} catch (err: any) {
			setError(err.response?.data?.message || "Error logging in");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await axios.post(`${API_URL}/logout`);
			setUser(null);
			setIsAuthenticated(false);
		} catch (err: any) {
			setError("Error logging out");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const verifyEmail = async (code: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await axios.post(`${API_URL}/verify-email`, { code });
			setUser(res.data.user);
			setIsAuthenticated(true);
			return res.data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Error verifying email");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	// const checkAuth = async () => {
	// 	setIsCheckingAuth(true);
	// 	setError(null);
	// 	try {
	// 		const res = await axios.get(`${API_URL}/check-auth`);
	// 		setUser(res.data.user);
	// 		setIsAuthenticated(true);
	// 	} catch {
	// 		setIsAuthenticated(false);
	// 	} finally {
	// 		setIsCheckingAuth(false);
	// 	}
	// };

	const checkAuth = useCallback(async () => {
		setIsCheckingAuth(true);
		try {
			const res = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
			setUser(res.data.user);
			setIsAuthenticated(true);
		} catch (err) {
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsCheckingAuth(false);
		}
	}, []);

	const forgotPassword = async (email: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await axios.post(`${API_URL}/forgot-password`, {
				email,
			});
			setMessage(res.data.message);
		} catch (err: any) {
			setError(err.response?.data?.message || "Error sending reset email");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const resetPassword = async (token: string, password: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			setMessage(res.data.message);
		} catch (err: any) {
			setError(err.response?.data?.message || "Error resetting password");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const resendVerificationCode = async (email: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await axios.post(`${API_URL}/resend-code`, { email });
			setMessage(res.data.message);
			return res.data;
		} catch (err: any) {
			setError(err.response?.data?.message || "Error resending verification code");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				isCheckingAuth,
				error,
				message,
				signup,
				login,
				logout,
				verifyEmail,
				checkAuth,
				forgotPassword,
				resetPassword,
				resendVerificationCode,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
