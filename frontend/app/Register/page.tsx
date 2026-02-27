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
            staggerChildren: 0.08,
            delayChildren: 0.1
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

// Shared custom styling for Material UI TextFields
const textFieldSx = {
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
};

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        age: ''
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));

            // Cleanup previous URL to prevent memory leaks
            return () => URL.revokeObjectURL(previewUrl || "");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const payload = new FormData();
            payload.append('username', formData.username);
            payload.append('email', formData.email);
            payload.append('password', formData.password);
            if (formData.age) payload.append('age', formData.age);
            if (profilePicture) payload.append('profile_picture', profilePicture);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: 'POST',
                body: payload,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            // Successfully registered, go to login
            router.push('/Login');
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
                className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl w-full max-w-lg p-8 sm:p-10 flex flex-col items-center border border-white/20 z-10"
            >
                <motion.div variants={itemVariants} className="w-full text-center mb-8">
                    <Typography variant="h4" component="h1" fontWeight="800" className="text-white tracking-tight mb-2">
                        Create Account
                    </Typography>
                    <Typography variant="body1" className="text-gray-300 font-medium">
                        Join us by filling out the form below
                    </Typography>
                </motion.div>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
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
                    {/* Photo Upload Placeholder */}
                    <motion.div variants={itemVariants} className="w-full flex justify-center mb-2">
                        <label className="cursor-pointer">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-300/50 bg-white/5 flex flex-col items-center justify-center overflow-hidden hover:bg-white/10 hover:border-indigo-400 transition-colors"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 text-indigo-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-[10px] text-indigo-200 font-medium">Add Photo</span>
                                    </>
                                )}
                            </motion.div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            variant="outlined"
                            size="medium"
                            className="bg-white/5 rounded-xl"
                            sx={textFieldSx}
                            required
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            variant="outlined"
                            size="medium"
                            className="bg-white/5 rounded-xl"
                            sx={textFieldSx}
                            required
                        />
                    </motion.div>

                    <div className="flex gap-4">
                        <motion.div variants={itemVariants} className="flex-1">
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
                                sx={textFieldSx}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-1/3">
                            <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                type="number"
                                variant="outlined"
                                size="medium"
                                className="bg-white/5 rounded-xl"
                                sx={textFieldSx}
                                inputProps={{ min: 1 }}
                            />
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="w-full mt-4">
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)" } : {}}
                            whileTap={!isLoading ? { scale: 0.98, boxShadow: "0 5px 15px -5px rgba(99, 102, 241, 0.4)" } : {}}
                            className={`w-full bg-linear-to-r from-indigo-500 to-purple-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-400 hover:to-purple-500 cursor-pointer'} text-white font-bold py-3.5 rounded-xl shadow-[0_8px_16px_-6px_rgba(99,102,241,0.4)] transition-colors duration-300 text-lg`}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                    </motion.div>
                </Box>

                <motion.div variants={itemVariants} className="mt-8 text-center space-x-2">
                    <Typography variant="body2" component="span" className="text-gray-400 font-medium">
                        Already have an account?
                    </Typography>
                    <Link href="/Login" underline="hover" className="text-sm text-indigo-300 hover:text-indigo-200 font-bold transition-colors">
                        Sign in
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}