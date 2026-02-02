import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, signInWithGoogle } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display min-h-screen flex flex-col transition-colors duration-200">
            <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                {/* Decorative Background Elements (Subtle) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
                    <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-primary/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Main Card Container */}
                <div className="w-full max-w-5xl bg-surface-light dark:bg-surface-dark shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-border-color dark:border-surface-dark/50">
                    {/* Left Side: Image/Branding */}
                    <div className="hidden md:flex md:w-1/2 relative bg-gray-100 dark:bg-gray-900">
                        <div className="absolute inset-0 z-0">
                            <div
                                className="w-full h-full bg-center bg-cover"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIRkROdbK2d7nR040SrFSVTur5kTIOcLaPJ3zGPsVDlN_xk4OhQqER8PjNB27AkqlMyinMRFQCbnmVksp3TddeqF-BtgSU1NsjTZ5VgYHo9MzbtbIpwyntYmNXBpn3feQCsvtgFKgtDVSVnN3R_1o9mX4t5joG5Wcd-XQNNwoeYnhjCCTCwzjwvVqH_yRjupaMFFGh6C6M49PdThojG7zTuIx_6UQuSfZKdUoUOoGOwUUNiVDVzqlUZOj1uHVjtOH-ChdSSCu62Kk')" }}
                            >
                            </div>
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        </div>
                        <div className="relative z-10 flex flex-col justify-end p-8 w-full text-white">
                            <div className="mb-4">
                                <span className="material-symbols-outlined text-6xl text-primary mb-4">bakery_dining</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Quality Ingredients, <br />Seamless Service.</h2>
                            <p className="text-white/80 font-normal text-sm max-w-sm">
                                Manage your inventory, sales, and customer relationships efficiently with the new Baker's Choice POS system.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
                        {/* Logo Header for Mobile (or Desktop) */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">point_of_sale</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white">Baker's Choice POS</h1>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Welcome back</h2>
                            <p className="text-text-muted text-sm">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-muted text-[20px]">person</span>
                                    </div>
                                    <input
                                        className="block w-full rounded-lg border-border-color dark:border-surface-dark bg-white dark:bg-black/20 text-text-main dark:text-white placeholder:text-text-muted/60 focus:border-primary focus:ring-primary pl-10 py-3 sm:text-sm"
                                        id="email"
                                        placeholder="user@store.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-text-muted text-[20px]">lock</span>
                                    </div>
                                    <input
                                        className="block w-full rounded-lg border-border-color dark:border-surface-dark bg-white dark:bg-black/20 text-text-main dark:text-white placeholder:text-text-muted/60 focus:border-primary focus:ring-primary pl-10 py-3 sm:text-sm"
                                        id="password"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer group"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-text-muted group-hover:text-text-main dark:group-hover:text-white text-[20px]">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password & Remember Me */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        className="h-4 w-4 rounded border-border-color text-primary focus:ring-primary bg-gray-100 dark:bg-black/20 dark:border-surface-dark"
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                    />
                                    <label className="ml-2 block text-sm text-text-muted" htmlFor="remember-me">Remember me</label>
                                </div>
                                <div className="text-sm">
                                    <a className="font-medium text-primary hover:text-green-600 transition-colors" href="#">Forgot password?</a>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-background-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in to Dashboard'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-color dark:border-surface-dark"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-surface-light dark:bg-surface-dark px-2 text-text-muted">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign-In Button */}
                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-color dark:border-surface-dark rounded-lg shadow-sm text-sm font-medium text-text-main dark:text-white bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>

                        {/* Footer / Register Link */}
                        <div className="mt-8 pt-6 border-t border-border-color dark:border-surface-dark text-center">
                            <p className="text-sm text-text-muted">
                                Don't have an account?
                                <Link to="/register" className="font-bold text-text-main dark:text-white hover:text-primary dark:hover:text-primary transition-colors ml-1">Register now</Link>
                            </p>
                            <p className="text-[10px] text-text-muted/60 mt-4">
                                v2.4.0 • Baker's Choice Systems Inc.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
