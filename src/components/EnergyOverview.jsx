import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EnergyOverview = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data, error } = await supabase
                    .from('energy_stats')
                    .select('*')
                    .order('id');

                if (error) throw error;
                setStats(data || []);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div style={{ color: 'var(--text-secondary)', padding: '20px' }}>Loading stats...</div>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', height: '100%' }}>
            {stats.map((stat, index) => (
                <StatBox
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    trend={stat.trend}
                    trendUp={stat.trend_up}
                    subtext={stat.subtext}
                    icon={
                        stat.icon_type === 'zap' ? <Zap size={20} /> :
                            stat.icon_type === 'trending_up' ? <TrendingUp size={20} /> :
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                    }
                />
            ))}
        </div>
    );
};

const StatBox = ({ label, value, trend, trendUp, icon, subtext }) => (
    <div style={{
        background: 'var(--bg-color)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
            <div style={{
                color: 'var(--primary-color)',
                opacity: 0.8
            }}>
                {icon}
            </div>
        </div>

        <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '0.85rem' }}>
                {trend && (
                    <span style={{
                        color: trendUp ? 'var(--warning-color)' : 'var(--success-color)',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontWeight: 600
                    }}>
                        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend}
                    </span>
                )}
                <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    {subtext || 'vs last month'}
                </span>
            </div>
        </div>
    </div>
);

export default EnergyOverview;
