'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store/useChatStore';
import './ProfileDetails.css';

export const ProfileDetails: React.FC = () => {
    const router = useRouter();
    const { user, logout } = useChatStore();

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        department: 'Commercial Approvals',
        organization: 'WPP Enterprise RFP Unit',
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsSaved(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Update store or trigger backend save API here
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="profile-page-container">
            {/* Top Header */}
            <div className="profile-top-bar">
                <button className="back-btn" onClick={() => router.back()}>
                    ← Back to Workspace
                </button>
                <h1 className="page-title">User Profile</h1>
            </div>

            {/* Hero Card */}
            <div className="profile-card">
                <div className="profile-hero">
                    <div className="hero-avatar">{user.initials}</div>
                    <div className="hero-info">
                        <h2>{formData.name}</h2>
                        <p>{formData.email}</p>
                        <span className="role-badge">{formData.role}</span>
                    </div>
                </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSave} className="profile-card">
                <h3 className="section-heading">Personal Details</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role / Title</label>
                        <input
                            type="text"
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <input
                            type="text"
                            name="department"
                            className="form-control"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Organization</label>
                        <input
                            type="text"
                            name="organization"
                            className="form-control"
                            value={formData.organization}
                            readOnly
                        />
                    </div>
                </div>

                <div className="action-row">
                    <button type="submit" className="save-btn">
                        {isSaved ? '✓ Changes Saved' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Security & Approvals */}
            <div className="profile-card">
                <h3 className="section-heading">Governance & Security Clearances</h3>
                <div className="security-badge-group">
                    <span className="sec-tag">✓ Gate 3 Governance Approver</span>
                    <span className="sec-tag">✓ SHA-256 Grounding Verified</span>
                    <span className="sec-tag">✓ ISO 27001 Access Level 2</span>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="profile-card danger-zone">
                <h3>Session Management</h3>
                <p>Log out of your active session on this device.</p>
                <button className="logout-page-btn" onClick={logout}>
                    Log Out
                </button>
            </div>
        </div>
    );
};