import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { Plus, Trash2, ArrowRight, Zap } from 'lucide-react';

const ApplianceInput = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appliances, setAppliances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', wattage: '', hours: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAppliances();
    }, [user]);

    const fetchAppliances = async () => {
        try {
            const { data, error } = await supabase
                .from('appliances')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAppliances(data);
        } catch (error) {
            console.error('Error fetching appliances:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateDailyCost = (wattage, hours) => {
        // Assuming average cost of $0.15 per kWh
        const kwh = (wattage * hours) / 1000;
        return (kwh * 0.15).toFixed(2);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.wattage || !formData.hours) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from('appliances').insert([
                {
                    user_id: user.id,
                    name: formData.name,
                    wattage: parseFloat(formData.wattage),
                    hours_per_day: parseFloat(formData.hours)
                }
            ]);

            if (error) throw error;
            setFormData({ name: '', wattage: '', hours: '' });
            fetchAppliances();
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('appliances').delete().eq('id', id);
            if (error) throw error;
            setAppliances(appliances.filter(app => app.id !== id));
        } catch (error) {
            console.error('Error deleting appliance:', error.message);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '8px' }}>Add Your Appliances</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Tell us about your devices to get accurate AI insights.</p>
            </header>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '32px' }}>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Appliance Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Fridge"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Wattage (W)</label>
                        <input
                            type="number"
                            placeholder="e.g. 150"
                            value={formData.wattage}
                            onChange={(e) => setFormData({ ...formData, wattage: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>Hours/Day</label>
                        <input
                            type="number"
                            placeholder="e.g. 24"
                            value={formData.hours}
                            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <button type="submit" disabled={submitting} style={{
                        padding: '12px 16px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '12px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Plus size={24} />
                    </button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', flex: 1 }}>
                {appliances.map(app => (
                    <div key={app.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', position: 'relative' }}>
                        <button onClick={() => handleDelete(app.id)} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>
                            <Trash2 size={16} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary-color)' }}>
                            <Zap size={20} />
                            <h3 style={{ fontWeight: 600 }}>{app.name}</h3>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Usage:</span>
                            <span style={{ fontWeight: 600 }}>{app.hours_per_day} hrs/day</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Est. Cost:</span>
                            <span style={{ fontWeight: 600 }}>${calculateDailyCost(app.wattage, app.hours_per_day)}/day</span>
                        </div>
                    </div>
                ))}
                {appliances.length === 0 && !loading && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        No appliances added yet. Add one above!
                    </div>
                )}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'right' }}>
                <button onClick={() => navigate('/dashboard')} style={{
                    padding: '16px 32px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    Continue to Dashboard <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default ApplianceInput;
