import React, { useState } from 'react';
import { Eye, EyeOff, Smartphone, Lock } from 'lucide-react';

// interface LoginProps {
//   onLogin: (mobile: string, password: string) => boolean;
// }
import { useAuth } from "../hooks/useAuth";


export const Login: React.FC = () => {
   const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   if (!mobile || !password) {
  //     setError('Please fill in all fields');
  //     setLoading(false);
  //     return;
  //   }

  //   if (mobile.length < 8) {
  //     setError('Please enter a valid mobile number');
  //     setLoading(false);
  //     return;
  //   }

  //   const success = onLogin(mobile, password);
  //   if (!success) {
  //     setError('Invalid mobile number or password');
  //   }
  //   setLoading(false);
  // };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!mobile || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (mobile.length < 8) {
      setError("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    const success = await login(mobile, password); // ✅ use login from AuthProvider
    if (!success) {
      setError("Invalid mobile number or password");
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      
        {/* 🔹 Watermark */}
      {/* <div className="fixed inset-0 flex items-center justify-start pointer-events-none z-0 pl-10">
        <img
          src="/Logo-Final-BeatsMed-Dubai.webp"
          alt="Watermark"
          className="w-[600px] opacity-20"
        />
      </div> */}

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">BM</span>
          </div> */}

          <div className="w-100 h-40 mx-auto">
            <img
              src="/Logo-Final-BeatsMed-Dubai.webp"
              alt="Beats Medicals Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Beats Medicals</h1>
          <p className="text-gray-600">ERP System Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 9))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter mobile number"
                maxLength={9}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo Credentials:</strong><br />
            Mobile: 565225438<br />
            Password: beats@123
          </p>
        </div>
      </div>
    </div>
  );
};