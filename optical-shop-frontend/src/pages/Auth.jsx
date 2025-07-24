import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../components/context/AuthContext';
import { signup, login } from '../components/services/authService';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { loginAction } = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password || (!isLogin && !name)) {
            toast.error('All fields are required!');
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            let response;
            if (isLogin) {
                response = await login({ email, password });
                toast.success('Logged in successfully!');
            } else {
                response = await signup({ name, email, password });
                toast.success('Account created successfully!');
            }
            loginAction(response);
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.authCard}>
                <h2 style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                <p style={styles.subtitle}>{isLogin ? 'Login to continue' : 'Sign up to get started'}</p>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>
                <p style={styles.toggleText}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={() => setIsLogin(!isLogin)} style={styles.toggleLink}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

// --- STYLES --- (Professional UI ke liye)
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Segoe UI', sans-serif",
    },
    authCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        width: '400px',
        textAlign: 'center',
    },
    title: {
        color: '#fff',
        fontSize: '2.5rem',
        marginBottom: '10px',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '30px',
        fontSize: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    input: {
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
    },
    button: {
        padding: '15px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#fff',
        color: '#667eea',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    toggleText: {
        marginTop: '20px',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    toggleLink: {
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default Auth;