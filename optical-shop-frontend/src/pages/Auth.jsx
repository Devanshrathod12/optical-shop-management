import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../components/context/AuthContext';
import { signup, login } from '../components/services/authService';

// --- Animation Component (isi file ke andar) ---
const AnimatedBackground = () => {
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes animateShapes {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                    border-radius: 0;
                }
                100% {
                    transform: translateY(-1000px) rotate(720deg);
                    opacity: 0;
                    border-radius: 50%;
                }
            }
        `;
        document.head.appendChild(styleSheet);
        return () => { document.head.removeChild(styleSheet); };
    }, []);

    const shapes = Array.from({ length: 10 });
    const circleBaseStyle = {
        position: 'absolute', display: 'block', listStyle: 'none',
        width: '20px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.15)',
        animation: 'animateShapes 25s linear infinite', bottom: '-150px',
    };

    return (
        <div style={styles.area}>
            <ul style={styles.circles}>
                {shapes.map((_, i) => (
                    <li key={i} style={{
                        ...circleBaseStyle,
                        left: `${Math.random() * 90}%`,
                        width: `${Math.random() * 120 + 20}px`,
                        height: `${Math.random() * 120 + 20}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 18 + 12}s`,
                    }}></li>
                ))}
            </ul>
        </div>
    );
};


// --- Main Auth Component ---
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
            <AnimatedBackground />
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

const styles = {
    // Styles for Animation
    area: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    circles: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
    },
    // Styles for Main Component
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: "'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },
    authCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        width: '400px',
        textAlign: 'center',
        zIndex: 1,
    },
    title: {
        color: '#fff',
        fontSize: '2.5rem',
        marginBottom: '10px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
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
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    button: {
        padding: '15px',
        borderRadius: '10px',
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
        color: 'rgba(255, 255, 255, 0.85)',
    },
    toggleLink: {
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default Auth;