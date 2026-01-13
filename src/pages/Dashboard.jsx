import { LayoutDashboard, Zap, FileText, Settings, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import EnergyOverview from '../components/EnergyOverview';
import DashboardCard from '../components/DashboardCard';
import UsageChart from '../components/UsageChart';
import BillHistory from '../components/BillHistory';
import SmartAdvice from '../components/SmartAdvice';
import { useAuth } from '../auth/AuthProvider';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'usage':
        return (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '20px' }}>Usage Analysis</h2>
            <div style={{ height: '500px' }}>
              <DashboardCard title="Detailed Consumption">
                <UsageChart />
              </DashboardCard>
            </div>
          </div>
        );
      case 'bills':
        return (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '20px' }}>Billing History</h2>
            <DashboardCard title="All Transactions">
              <BillHistory />
            </DashboardCard>
          </div>
        );
      case 'settings':
        return (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '20px' }}>Settings</h2>
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Settings size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
              <h3>Premium Settings</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Manage your Bill Breaker subscription here.</p>
              <button onClick={() => alert("Premium functionality is a demo feature!")} style={{
                padding: '12px 24px',
                background: 'var(--primary-color)',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 500
              }}>
                Manage Subscription
              </button>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="dashboard-grid animate-fade-in">
            {/* Top Row: Overview Stats */}
            <div className="col-span-8" style={{ height: '160px' }}>
              <EnergyOverview />
            </div>

            {/* AI Advice Card */}
            <div className="col-span-4" style={{ height: '160px' }}>
              <SmartAdvice />
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
        );
    }
  };

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

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />

          <button onClick={() => navigate('/appliances')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            width: '100%',
            textAlign: 'left',
            fontSize: '0.95rem',
            background: 'transparent',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <PlusCircle size={20} />
            My Appliances
          </button>

          <div style={{ flex: 1 }} />
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

        {renderContent()}
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
