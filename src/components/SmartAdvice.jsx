import React, { useState, useEffect } from 'react';
import { getEnergyAdvice } from '../lib/gemini';
import { useAuth } from '../auth/AuthProvider';
import { Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SmartAdvice = () => {
    const { isPremium, upgradeToPremium, user } = useAuth();
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAdvice() {
            // 1. Fetch user appliances
            const { data: appliances } = await supabase
                .from('appliances')
                .select('*')
                .eq('user_id', user?.id);

            if (!appliances || appliances.length === 0) {
                setAdvice(null);
                setLoading(false);
                return;
            }

            // 2. Get AI Advice (Mock bill for now)
            const aiData = await getEnergyAdvice(appliances, 124.50);
            setAdvice(aiData);
            setLoading(false);
        }
        fetchAdvice();
    }, [user]);

    if (loading) return <div className="glass-panel" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading AI Insights...</div>;

    if (!advice) return (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Sparkles size={32} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
            <h3>No appliances found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Add appliances to unlock AI insights!</p>
        </div>
    );

    return (
        <div className="glass-panel" style={{ padding: '24px', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ padding: '8px', background: 'var(--accent-color)', borderRadius: '8px', color: 'white' }}>
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Bill Breaker AI</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Personalized savings</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {/* Free Insight */}
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Top Consumer</p>
                    <p style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{advice.highest_consumer}</p>
                </div>

                {/* Premium Insight (Blurred if free) */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        filter: isPremium ? 'none' : 'blur(4px)',
                        opacity: isPremium ? 1 : 0.6,
                        pointerEvents: isPremium ? 'auto' : 'none'
                    }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Recommended Action</p>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>{advice.action_item}</p>

                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Best Usage Hours</p>
                            <p style={{ fontWeight: 600, color: 'var(--success-color)' }}>{advice.best_hours}</p>
                        </div>
                    </div>

                    {/* Premium Overlay */}
                    {!isPremium && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        }}>
                            <Lock size={24} style={{ color: 'var(--primary-color)', marginBottom: '8px' }} />
                            <button onClick={upgradeToPremium} style={{
                                padding: '8px 16px',
                                background: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 4px 12px rgba(47, 82, 51, 0.2)'
                            }}>
                                Unlock Premium <ArrowUpRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartAdvice;
