import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { login, UserCredentials } from '../services/auth';
import { useAuth } from '../context/AuthContext';
interface LoginFormProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}
const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onSwitchToSignup
}) => {
  const {
    setAuth
  } = useAuth();
  const [formData, setFormData] = useState<UserCredentials>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData);
      setAuth(response);
      toast.success('Login successful!');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Login</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input type="email" id="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input type="password" id="password" value={formData.password} onChange={e => setFormData({
            ...formData,
            password: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="flex flex-col space-y-4">
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button type="button" onClick={onSwitchToSignup} className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>;
};
export default LoginForm;
