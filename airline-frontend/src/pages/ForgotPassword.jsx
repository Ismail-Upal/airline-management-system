import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../api';
import { Copy, Check } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await forgotPassword({ email });
      setSuccess(true);
      // If reset_link is in response, display it
      if (data.reset_link) {
        setResetLink(data.reset_link);
      }
      // Auto-navigate after 5 seconds only if no link shown
      if (!data.reset_link) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Reset Link Ready</h2>
          
          {resetLink ? (
            <>
              <p className="text-gray-600 text-center mb-6">Here's your password reset link:</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="text-xs text-gray-500 mb-2">Reset Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resetLink}
                    readOnly
                    className="flex-1 bg-white border border-blue-300 rounded px-2 py-2 text-xs font-mono overflow-auto"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <Link
                to={resetLink}
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-bold transition mb-4"
              >
                Open Reset Link
              </Link>
              <p className="text-gray-600 text-center text-sm">Or check your email for the reset link.</p>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-center">Check your email for the password reset link.</p>
              <p className="text-gray-500 text-center text-sm mt-4">Redirecting to login in 3 seconds...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Forgot Password</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition">
            Send Reset Link
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password? <Link to="/#/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
