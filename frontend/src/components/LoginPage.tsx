import type React from "react";

import { useState } from "react";
import type { User } from "../App";

interface LoginPageProps {
	onLogin: (userData: User) => void;
	onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			onLogin({
				email: formData.email,
				name: formData.email.split("@")[0],
				avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
			});
			setIsLoading(false);
		}, 1000);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="min-h-screen bg-black flex items-center justify-center px-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="flex justify-center mb-6">
						<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
							<span className="text-black font-bold text-xl">VC</span>
						</div>
					</div>
					<h2 className="text-3xl font-bold text-white">Welcome back</h2>
					<p className="mt-2 text-gray-400">Sign in to your account</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
								Email address
							</label>
							<input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your email" />
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
								Password
							</label>
							<input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your password" />
						</div>
					</div>

					<button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
						{isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Sign in"}
					</button>

					<div className="text-center">
						<button type="button" onClick={onSwitchToRegister} className="text-blue-400 hover:text-blue-300 text-sm">
							Don't have an account? Sign up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
