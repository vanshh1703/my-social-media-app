"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

const BackgroundOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-purple-500/30 rounded-full blur-[100px]"
        />
        <motion.div
            animate={{
                scale: [1, 1.5, 1],
                x: [0, -50, 0],
                y: [0, 50, 0],
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
            }}
            className="absolute bottom-[-10%] right-[-10%] w-140 h-140 bg-indigo-500/30 rounded-full blur-[100px]"
        />
        <motion.div
            animate={{
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
                y: [0, -40, 0],
            }}
            transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
            }}
            className="absolute top-[20%] right-[20%] w-100 h-100 bg-pink-500/20 rounded-full blur-[80px]"
        />
    </div>
);

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await res.json();
            // Save JWT token
            localStorage.setItem('token', data.access_token);

            // Successfully logged in, go to home page
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            <BackgroundOrbs />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl w-full max-w-md p-8 sm:p-10 flex flex-col items-center border border-white/20 z-10"
            >
                <motion.div variants={itemVariants} className="w-full text-center mb-8">
                    <Typography variant="h4" component="h1" fontWeight="800" className="text-white tracking-tight mb-2">
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" className="text-gray-300 font-medium">
                        Please sign in to your account
                    </Typography>
                </motion.div>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-5"
                    noValidate
                    autoComplete="off"
                >
                    {error && (
                        <motion.div variants={itemVariants} className="w-full bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center">
                            <Typography variant="body2" className="text-red-400 font-medium">
                                {error}
                            </Typography>
                        </motion.div>
                    )}
                    <motion.div variants={itemVariants}>
                        <TextField
                            fullWidth
                            label="Username or Email"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            variant="outlined"
                            size="medium"
                            className="bg-white/5 rounded-xl"
                            sx={{
                                input: { color: 'white' },
                                label: { color: '#9ca3af' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '0.75rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(255,255,255,0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255,255,255,0.4)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#818cf8',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#818cf8',
                                }
                            }}
                            required
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            variant="outlined"
                            size="medium"
                            className="bg-white/5 rounded-xl"
                            sx={{
                                input: { color: 'white' },
                                label: { color: '#9ca3af' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '0.75rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(255,255,255,0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255,255,255,0.4)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#818cf8',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#818cf8',
                                }
                            }}
                            required
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex justify-end w-full -mt-1 mb-2">
                        <Link href="#" underline="hover" className="text-sm text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
                            Forgot password?
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full">
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)" } : {}}
                            whileTap={!isLoading ? { scale: 0.98, boxShadow: "0 5px 15px -5px rgba(99, 102, 241, 0.4)" } : {}}
                            className={`w-full bg-linear-to-r from-indigo-500 to-purple-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-400 hover:to-purple-500 cursor-pointer'} text-white font-bold py-3.5 rounded-xl shadow-[0_8px_16px_-6px_rgba(99,102,241,0.4)] transition-colors duration-300 text-lg`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                    </motion.div>
                </Box>

                <motion.div variants={itemVariants} className="mt-8 text-center space-x-2">
                    <Typography variant="body2" component="span" className="text-gray-400 font-medium">
                        Don't have an account?
                    </Typography>
                    <Link href="/Register" underline="hover" className="text-sm text-indigo-300 hover:text-indigo-200 font-bold transition-colors">
                        Sign up
                    </Link>
                </motion.div>
            </motion.div>

        </div>

    );
}