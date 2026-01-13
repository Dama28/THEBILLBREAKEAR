import React from 'react';

const DashboardCard = ({ title, children, className = '', action }) => {
    return (
        <div className={`dashboard-card ${className}`} style={{
            background: 'var(--card-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600 }}>{title}</h3>
                {action && <div>{action}</div>}
            </div>
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
};

export default DashboardCard;
