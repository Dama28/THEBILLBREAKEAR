import { LayoutDashboard, Zap, FileText, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import '../index.css';
import EnergyOverview from '../components/EnergyOverview';
import DashboardCard from '../components/DashboardCard';
import UsageChart from '../components/UsageChart';
import BillHistory from '../components/BillHistory';
import { useAuth } from '../auth/AuthProvider';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        background: 'var(--card-bg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-color)',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{
            background: 'var(--primary-color)',
            color: 'white',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Zap size={24} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>Bill Breaker</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Zap size={20} />} label="Usage Analysis" active={activeTab === 'usage'} onClick={() => setActiveTab('usage')} />
          <NavItem icon={<FileText size={20} />} label="Bills & History" active={activeTab === 'bills'} onClick={() => setActiveTab('bills')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Welcome, {user?.email?.split('@')[0]}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Here's your energy summary for this month.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="glass-panel" style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--primary-color)'
            }}>
              Download Report
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid animate-fade-in">

          {/* Top Row: Overview Stats */}
          <div className="col-span-12" style={{ height: '160px' }}>
            <EnergyOverview />
          </div>

          {/* Middle Row: Chart & History */}
          <div className="col-span-8" style={{ height: '400px' }}>
            <DashboardCard title="Weekly Consumption" action={
              <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            }>
              <UsageChart />
            </DashboardCard>
          </div>

          <div className="col-span-4" style={{ height: '400px' }}>
            <DashboardCard title="Recent Bills">
              <BillHistory />
            </DashboardCard>
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
      background: active ? 'rgba(47, 82, 51, 0.08)' : 'transparent',
      width: '100%',
      textAlign: 'left',
      fontSize: '0.95rem',
      fontWeight: active ? 500 : 400
    }}>
      {icon}
      {label}
    </button>
  );
}

export default Dashboard;
