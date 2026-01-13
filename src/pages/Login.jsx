import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    throw new Error("Please check your email to confirm your account first.");
                }
                throw error;
            }
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                }
            });
            if (error) throw error;
            setMessage("Success! Please check your email inbox to verify your account.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-color)',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(47, 82, 51, 0.1) 0%, transparent 50%)'
        }}>
            <div className="glass-panel" style={{
                padding: '40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '12px',
                    borderRadius: '16px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    marginBottom: '24px'
                }}>
                    <Zap size={32} />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>The Bill Breaker</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Monitor & Reduce your electricity costs</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            fontSize: '1rem'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            fontSize: '1rem'
                        }}
                    />

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(217, 83, 79, 0.1)',
                            color: 'var(--danger-color)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'left'
                        }}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(78, 141, 85, 0.1)',
                            color: 'var(--success-color)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'left'
                        }}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        padding: '14px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        marginTop: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? 'Processing...' : 'Sign In'}
                    </button>

                    <button onClick={handleSignUp} type="button" disabled={loading} style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        Create an account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
