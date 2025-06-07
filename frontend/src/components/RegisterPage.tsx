import type React from "react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, error, isLoading } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			await signup(formData.email, formData.password, formData.name);
			toast.success("Account created successfully");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Error creating account");
		}
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
					<h2 className="text-3xl font-bold text-white">Create your account</h2>
					<p className="mt-2 text-gray-400">Join thousands of developers</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
								Full name
							</label>
							<input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your full name" />
						</div>

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
							<input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Create a password" />
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
								Confirm password
							</label>
							<input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Confirm your password" />
						</div>
					</div>

					<button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
						{isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Create account"}
					</button>

					<div className="text-center">
						<button type="button" onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300 text-sm">
							Already have an account? Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
