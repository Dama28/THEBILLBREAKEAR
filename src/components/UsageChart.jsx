import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const UsageChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('daily_usage')
                    .select('*')
                    .order('id');

                if (error) throw error;
                setData(data || []);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;

    const max = data.length > 0 ? Math.max(...data.map(d => d.value)) : 100;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '100%',
            paddingTop: '32px',
            gap: '16px'
        }}>
            {data.map((item, index) => (
                <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%'
                }}>
                    {/* Bar Container */}
                    <div style={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {/* Bar Background (optional for track) */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            top: 0,
                            background: 'rgba(0,0,0,0.03)',
                            borderRadius: 'var(--radius-sm)',
                        }} />

                        {/* The Bar */}
                        <div style={{
                            width: '100%',
                            height: `${(item.value / max) * 100}%`,
                            background: index === 3 ? 'var(--primary-color)' : 'var(--primary-light)', // Highlight peak logic can be smarter later
                            opacity: index === 3 ? 1 : 0.7,
                            borderRadius: 'var(--radius-sm)',
                            transition: 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                        </div>
                    </div>

                    {/* Label */}
                    <span style={{
                        marginTop: '12px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500
                    }}>{item.day}</span>
                </div>
            ))}
        </div>
    );
};

export default UsageChart;
