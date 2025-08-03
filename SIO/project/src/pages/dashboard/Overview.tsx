import React, { useState, useEffect } from 'react';
import {
  Cpu, Database, MemoryStick, Users, BarChart3, PieChart as PieChartIcon, Loader, FileText, AlertCircle, Activity, Timer, Server,
  TrendingUp, Shield, Zap, Eye, Clock, Target, ArrowUpRight, RefreshCw
} from 'lucide-react';
import {
  BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart as RLineChart, Line, PieChart as RPieChart, Pie, Cell, Legend, AreaChart, Area,
  ComposedChart, CartesianGrid
} from 'recharts';
import SystemAlerts from '../../components/SystemAlerts';
import DashboardStats from '../../components/DashboardStats';

// --- Interfaces ---

interface AuditData {
  _id: string;
  OS_USERNAME: string;
  DBUSERNAME: string;
  ACTION_NAME: string;
  OBJECT_NAME: string;
  EVENT_TIMESTAMP: string;
  [key: string]: any;
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  color?: string;
  loading?: boolean;
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: number;
  color?: string;
  loading?: boolean;
}

// --- Composants ---

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, change, color = "blue", loading = false }) => (
  <div className={`bg-gradient-to-br from-${color}-900 to-${color}-800 border border-${color}-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-400/20 flex items-center justify-center`}>
        {icon}
      </div>
      {loading && <RefreshCw className="h-5 w-5 text-white animate-spin" />}
    </div>
    <div className="space-y-2">
      <h3 className="text-white/80 text-sm font-medium">{title}</h3>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">{loading ? '...' : value}</span>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <ArrowUpRight className={`h-4 w-4 ${change < 0 ? 'rotate-90' : ''}`} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Card: React.FC<CardProps> = ({ icon, title, children, color = "from-gray-900 to-gray-800 border-gray-700", loading = false }) => (
  <div className={`rounded-2xl shadow-xl border p-6 bg-gradient-to-br ${color} text-white flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-white/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-xl tracking-wide drop-shadow">{title}</span>
      </div>
      {loading && <RefreshCw className="h-5 w-5 text-white animate-spin" />}
    </div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-4 border border-blue-200">
        <div className="font-bold mb-2">{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex justify-between">
            <span>{entry.name || entry.dataKey}</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <ul className="flex flex-wrap gap-4 mt-2">
    {payload?.map((entry: any, idx: number) => (
      <li key={idx} className="flex items-center gap-2">
        <span style={{
          display: 'inline-block',
          width: 16,
          height: 16,
          background: entry.color,
          borderRadius: 4,
        }} />
        <span className="text-gray-100">{entry.value}</span>
      </li>
    ))}
  </ul>
);

const Overview: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Couleurs pour les graphiques
  const COLORS = [
    "#38bdf8", "#818cf8", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#34d399", "#facc15", "#f472b6"
  ];

  // Récupération des données d'audit
  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/audit/raw');
        const data = await response.json();
        if (data.status === 'success') {
          setAuditData(data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données d\'audit:', error);
      } finally {
        setLoading(false);
        setLastRefresh(new Date());
      }
    };

    fetchAuditData();
    const interval = setInterval(fetchAuditData, 30000); // Rafraîchissement toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Calcul des métriques d'audit
  const auditMetrics = {
    totalActions: auditData.length,
    uniqueUsers: new Set(auditData.map(item => item.OS_USERNAME)).size,
    uniqueObjects: new Set(auditData.map(item => item.OBJECT_NAME)).size,
    selectActions: auditData.filter(item => item.ACTION_NAME === 'SELECT').length,
    insertActions: auditData.filter(item => item.ACTION_NAME === 'INSERT').length,
    updateActions: auditData.filter(item => item.ACTION_NAME === 'UPDATE').length,
    deleteActions: auditData.filter(item => item.ACTION_NAME === 'DELETE').length,
  };

  // Données pour les graphiques d'audit
  const auditChartData = [
    { name: 'SELECT', value: auditMetrics.selectActions, color: '#38bdf8' },
    { name: 'INSERT', value: auditMetrics.insertActions, color: '#34d399' },
    { name: 'UPDATE', value: auditMetrics.updateActions, color: '#fbbf24' },
    { name: 'DELETE', value: auditMetrics.deleteActions, color: '#f87171' },
  ];

  const userActivityData = auditData.reduce((acc: any[], item) => {
    const existing = acc.find(user => user.name === item.OS_USERNAME);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: item.OS_USERNAME, value: 1 });
    }
    return acc;
  }, []).slice(0, 10); // Top 10 utilisateurs

  const objectActivityData = auditData.reduce((acc: any[], item) => {
    const existing = acc.find(obj => obj.name === item.OBJECT_NAME);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: item.OBJECT_NAME, value: 1 });
    }
    return acc;
  }, []).slice(0, 10); // Top 10 objets

  // Données AWR (simulées basées sur le rapport fourni)
  const awrData = {
    systemInfo: {
      hostname: 'smart2d.smart2dservices.com',
      platform: 'Linux x86 64-bit',
      cpus: 4,
      cores: 4,
      sockets: 1,
      memory_gb: 5.5,
      instance: 'smart2dTest',
      startup_time: '16-Jul-25 07:38',
      db_name: 'SMART2DT',
      release: '19.0.0.0.0'
    },
    oracleConn: {
      db_type: 'oracle',
      host: '192.168.132.146',
      port: '1555',
      service_name: 'SMART2DTESTPDB',
      username: 'test',
      password: 'test',
    },
    performanceMetrics: {
      dbTime: 1.11,
      elapsedTime: 239.65,
      cpuUsage: 85.6,
      bufferHitRatio: 99.77,
      libraryHitRatio: 97.88,
      softParseRatio: 97.07,
      logicalReadsPerSec: 127.5,
      physicalReadsPerSec: 0.3,
      physicalWritesPerSec: 0.7,
      executionsPerSec: 17.6,
      parsesPerSec: 5.2,
      hardParsesPerSec: 0.2
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 pb-8">
      {/* Header avec bouton de rafraîchissement */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-900 via-blue-950 to-gray-900 px-12 py-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BarChart3 className="h-14 w-14 text-blue-400 animate-pulse" />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-2xl">
                Dashboard Oracle SMART2D
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Dernière mise à jour: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Rafraîchir
          </button>
        </div>
      </header>

      <div className="w-full max-w-none px-8 md:px-12 py-12 space-y-12">
        {/* Statistiques en temps réel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-400" />
            Statistiques en Temps Réel
          </h2>
          <DashboardStats 
            auditData={auditData}
            performanceMetrics={awrData.performanceMetrics}
          />
        </div>

        {/* Alertes système */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            Alertes Système
          </h2>
          <SystemAlerts 
            auditData={auditData}
            performanceMetrics={awrData.performanceMetrics}
          />
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard 
            icon={<Database className="text-blue-400" />}
            title="Actions Totales"
            value={auditMetrics.totalActions}
            color="blue"
            loading={loading}
          />
          <MetricCard 
            icon={<Users className="text-green-400" />}
            title="Utilisateurs Uniques"
            value={auditMetrics.uniqueUsers}
            color="green"
            loading={loading}
          />
          <MetricCard 
            icon={<FileText className="text-purple-400" />}
            title="Objets Accédés"
            value={auditMetrics.uniqueObjects}
            color="purple"
            loading={loading}
          />
          <MetricCard 
            icon={<Activity className="text-orange-400" />}
            title="Temps DB (sec)"
            value={awrData.performanceMetrics.dbTime}
            color="orange"
          />
        </div>

        {/* Graphiques d'audit */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <Card icon={<PieChartIcon className="text-blue-400" />} title="Répartition des Actions" color="from-blue-900 to-blue-800 border-blue-700" loading={loading}>
            <ResponsiveContainer width="100%" height={240}>
              <RPieChart>
                <Pie
                  data={auditChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {auditChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </RPieChart>
            </ResponsiveContainer>
          </Card>

          <Card icon={<Users className="text-green-400" />} title="Top Utilisateurs" color="from-green-900 to-green-800 border-green-700" loading={loading}>
            <ResponsiveContainer width="100%" height={240}>
              <RBarChart data={userActivityData} barSize={30}>
                <XAxis dataKey="name" stroke="#34d399" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#34d399" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#34d399" radius={[8,8,0,0]} />
              </RBarChart>
            </ResponsiveContainer>
          </Card>

          <Card icon={<FileText className="text-purple-400" />} title="Top Objets" color="from-purple-900 to-purple-800 border-purple-700" loading={loading}>
            <ResponsiveContainer width="100%" height={240}>
              <RBarChart data={objectActivityData} barSize={30}>
                <XAxis dataKey="name" stroke="#a78bfa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a78bfa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#a78bfa" radius={[8,8,0,0]} />
              </RBarChart>
            </ResponsiveContainer>
          </Card>

          <Card icon={<Activity className="text-orange-400" />} title="Performance Oracle" color="from-orange-900 to-orange-800 border-orange-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-orange-200">Buffer Hit %</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.bufferHitRatio}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-200">Library Hit %</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.libraryHitRatio}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-200">Soft Parse %</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.softParseRatio}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-200">CPU Usage %</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.cpuUsage}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Métriques système et I/O */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <Card icon={<Server className="text-cyan-400" />} title="I/O Performance" color="from-cyan-900 to-cyan-800 border-cyan-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-cyan-200">Logical Reads/s</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.logicalReadsPerSec}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200">Physical Reads/s</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.physicalReadsPerSec}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200">Physical Writes/s</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.physicalWritesPerSec}</span>
              </div>
            </div>
          </Card>

          <Card icon={<Cpu className="text-red-400" />} title="SQL Activity" color="from-red-900 to-red-800 border-red-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-red-200">Executes/s</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.executionsPerSec}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-200">Parses/s</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.parsesPerSec}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-200">Hard Parses/s</span>
                <span className="text-white font-bold">{awrData.performanceMetrics.hardParsesPerSec}</span>
              </div>
            </div>
          </Card>

          <Card icon={<MemoryStick className="text-pink-400" />} title="Mémoire Oracle" color="from-pink-900 to-pink-800 border-pink-700">
            <ResponsiveContainer width="100%" height={200}>
              <RPieChart>
                <Pie
                  data={[
                    { name: 'SGA (MB)', value: 1700 },
                    { name: 'PGA (MB)', value: 556 },
                    { name: 'Host Usage %', value: 40.29 }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RPieChart>
            </ResponsiveContainer>
          </Card>

          <Card icon={<Timer className="text-yellow-400" />} title="DB Time vs Elapsed" color="from-yellow-900 to-yellow-800 border-yellow-700">
            <ResponsiveContainer width="100%" height={200}>
              <RBarChart data={[
                { name: 'Elapsed', value: awrData.performanceMetrics.elapsedTime },
                { name: 'DB Time', value: awrData.performanceMetrics.dbTime }
              ]} barSize={40}>
                <XAxis dataKey="name" stroke="#fbbf24" fontSize={14} tickLine={false} axisLine={false} />
                <YAxis stroke="#fbbf24" fontSize={14} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#fbbf24" radius={[8,8,0,0]} />
              </RBarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Informations système */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card icon={<Database className="text-blue-400" />} title="Connexion Oracle" color="from-blue-900 to-blue-800 border-blue-700">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Host:</span>
                <span className="text-white">{awrData.oracleConn.host}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Port:</span>
                <span className="text-white">{awrData.oracleConn.port}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Service:</span>
                <span className="text-white">{awrData.oracleConn.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Utilisateur:</span>
                <span className="text-white">{awrData.oracleConn.username}</span>
              </div>
            </div>
          </Card>

          <Card icon={<Server className="text-green-400" />} title="Environnement Système" color="from-green-900 to-green-800 border-green-700">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-200">Instance:</span>
                <span className="text-white">{awrData.systemInfo.instance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">DB Name:</span>
                <span className="text-white">{awrData.systemInfo.db_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Version:</span>
                <span className="text-white">{awrData.systemInfo.release}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">OS:</span>
                <span className="text-white">{awrData.systemInfo.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">CPUs:</span>
                <span className="text-white">{awrData.systemInfo.cpus} ({awrData.systemInfo.cores} cœurs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Mémoire:</span>
                <span className="text-white">{awrData.systemInfo.memory_gb} Go</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;