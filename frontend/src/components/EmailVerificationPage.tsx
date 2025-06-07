import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verifyEmail, user, resendVerificationCode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => navigate("/"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [success, navigate]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      setActiveIndex(index + 1);
    }

    if (newCode.every((digit) => digit !== "")) {
      handleVerification(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      setActiveIndex(5);
      handleVerification(pasted);
    }
  };

  const handleVerification = async (enteredCode: string) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await verifyEmail(enteredCode);
      if (result.success) {
        setSuccess(true);
        navigate("/");
        toast.success(result.message);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.message || "Error verifying email");
      toast.error(err?.response?.data?.message || "Error verifying email");
      setCode(["", "", "", "", "", ""]);
      setActiveIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationCode(user.email);
      toast.success("Verification code resent successfully");
      setError("");
      setResendCooldown(30); 
    } catch (err) {
      setError("Failed to resend verification code.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-2xl">VC</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Verify Your Email</h2>
          <p className="mt-2 text-gray-400">
            We've sent a 6-digit code to{" "}
            <span className="text-white font-medium">{user?.email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-md text-center">
            ✅ Email verified successfully!
          </div>
        )}

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={digit}
              autoFocus={activeIndex === i}
              inputMode="numeric"
              onChange={(e) => handleInputChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isLoading || success}
              className={`w-12 h-12 text-center text-xl font-bold bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : success
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-700 focus:ring-blue-500"
              } ${isLoading || success ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          ))}
        </div>

        <div className="text-center text-sm text-gray-400 mt-2">
          {timeLeft > 0 ? (
            <p>
              Code expires in{" "}
              <span className="text-white font-medium">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="text-red-400">Code has expired</p>
          )}
        </div>

        <button
          onClick={() => handleVerification(code.join(""))}
          disabled={code.some((c) => !c) || isLoading || success}
          className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Verifying..." : success ? "Verified" : "Verify Email"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          Didn’t receive the code?
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0}
            className="text-blue-400 ml-1 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
