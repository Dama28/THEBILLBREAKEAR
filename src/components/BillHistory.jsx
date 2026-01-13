import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BillHistory = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const { data, error } = await supabase
                    .from('bills')
                    .select('*')
                    .order('id', { ascending: false }); // Latest first

                if (error) throw error;
                setBills(data || []);
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-secondary)', padding: 16 }}>Loading history...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bills.map((bill, index) => (
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'var(--bg-color)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid transparent',
                    transition: 'border-color 0.2s'
                }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'rgba(47, 82, 51, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--primary-color)',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                        }}>
                            {bill.month.substring(0, 3)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{bill.month}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bill.date}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{bill.amount}</span>
                        <div style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            background: 'rgba(78, 141, 85, 0.15)',
                            color: 'var(--success-color)',
                            fontWeight: 600
                        }}>
                            {bill.status}
                        </div>
                        <button style={{ color: 'var(--text-secondary)', padding: 8 }}>
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BillHistory;
