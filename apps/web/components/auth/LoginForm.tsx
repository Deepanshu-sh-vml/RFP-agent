'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSSOLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        // Simulate SSO login and redirect to workspace
        setTimeout(() => {
            setLoading(false);
            router.push('/');
        }, 800);
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                {/* Brand Logo & Header */}
                <div className="brand-header">
                    <div className="brand-logo">WB</div>
                    <h1>Sign in to WinBid AI</h1>
                    <p>Internal Work-Winning Assistant</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSSOLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Company Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="user@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="sso-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In with SSO'}
                    </button>
                </form>

                {/* Footer */}
                <div className="signup-footer">
                    Don't have an account?
                    <Link href="/signup" className="signup-link">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};