import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Building2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const TransparencyDashboard: React.FC = () => {
  const { reports, theme } = useApp();

  const isDark = theme !== 'light';

  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const axisStroke = isDark ? '#64748b' : '#94a3b8';

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '12px',
    fontSize: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
  };

  const total = reports.length;
  const underReview = reports.filter((r) => r.status === 'under_review' || r.status === 'submitted').length;
  const verified = reports.filter((r) => r.status === 'verified' || r.status === 'forwarded_to_authority').length;
  const actionTaken = reports.filter((r) => r.status === 'action_taken').length;
  const resolved = reports.filter((r) => r.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category counts data for BarChart
  const categoryCounts: { [key: string]: number } = {};
  reports.forEach((r) => {
    const cat = r.category.replace(/_/g, ' ');
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const barData = Object.keys(categoryCounts).map((cat) => ({
    name: cat.length > 14 ? cat.slice(0, 13) + '...' : cat,
    fullName: cat,
    count: categoryCounts[cat]
  }));

  // Status breakdown data for Doughnut/PieChart with semantic colors
  const pieData = [
    {
      name: 'Resolved',
      value: resolved || 1,
      color: '#10b981' // Emerald
    },
    {
      name: 'Action Taken',
      value: actionTaken || 1,
      color: '#06b6d4' // Cyan
    },
    {
      name: 'Verified / Forwarded',
      value: verified || 1,
      color: '#6366f1' // Indigo
    },
    {
      name: 'Under Review',
      value: underReview || 1,
      color: '#f59e0b' // Amber
    }
  ];

  // Monthly trend data
  const trendData = [
    { month: 'Oct 25', submitted: 18, resolved: 12 },
    { month: 'Nov 25', submitted: 26, resolved: 19 },
    { month: 'Dec 25', submitted: 34, resolved: 28 },
    { month: 'Jan 26', submitted: 42, resolved: 35 },
    { month: 'Feb 26', submitted: 55, resolved: 46 },
    { month: 'Mar 26', submitted: total, resolved: resolved + actionTaken }
  ];

  // District breakdown table
  const districtCounts: { [key: string]: { total: number; resolved: number } } = {};
  reports.forEach((r) => {
    const dist = r.location.district;
    if (!districtCounts[dist]) {
      districtCounts[dist] = { total: 0, resolved: 0 };
    }
    districtCounts[dist].total += 1;
    if (r.status === 'resolved' || r.status === 'action_taken') {
      districtCounts[dist].resolved += 1;
    }
  });

  return (
    <div className="space-y-6 sm:space-y-8" id="transparency-analytics-dashboard">
      {/* Header */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              <span>National Civic Transparency & Resolution Dashboard</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time audit metrics tracking citizen grievances, verification rate, municipal responsiveness, and state department accountability nationwide.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Audited Fiscal Period: 2026</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Logged */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Total Reports</span>
            <FileCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Across 64 Bangladesh districts</div>
        </div>

        {/* In Processing */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center justify-between">
            <span>In Processing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{underReview + verified}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Triage & verification queue</div>
        </div>

        {/* Action Taken */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="text-xs font-medium text-teal-600 dark:text-teal-400 flex items-center justify-between">
            <span>Official Action</span>
            <Building2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{actionTaken}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Official dispatch on record</div>
        </div>

        {/* Resolved */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolved}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{resolutionRate}% resolution success rate</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Reports by Category Bar Chart */}
        <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div>
            <h3 className="text-sm font-bold">Grievance Distribution by Category</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Total volume of reported citizen concerns across public sectors</p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke={axisStroke}
                  fontSize={10}
                  tickLine={false}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke={axisStroke} fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="count"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Doughnut Chart */}
        <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold">Resolution & Triage Status Breakdown</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time status of all active civic filings</p>
          </div>

          <div className="h-56 sm:h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Intake & Resolution Velocity Line Chart */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Monthly Citizen Intake vs Official Resolution Velocity</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              6-month trend tracking citizen intake against verified municipal resolution
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-amber-500" />
              <span className="text-slate-600 dark:text-slate-300">Submitted</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Resolved</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="month" stroke={axisStroke} fontSize={11} tickLine={false} />
              <YAxis stroke={axisStroke} fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="submitted"
                name="Grievances Filed"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f59e0b' }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Cases Resolved"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Accountability Table (Mobile optimized with overflow-x-auto) */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div>
          <h3 className="text-sm font-bold">District-by-District Transparency & Audit Ledger</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Official breakdown of logged complaints and proven municipal response rate across Bangladesh districts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Total Reports</th>
                <th className="py-2.5 px-3">Actioned / Resolved</th>
                <th className="py-2.5 px-3">Resolution %</th>
                <th className="py-2.5 px-3 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {Object.keys(districtCounts).map((dist) => {
                const item = districtCounts[dist];
                const pct = Math.round((item.resolved / item.total) * 100);
                return (
                  <tr key={dist} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{dist}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{item.total}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{item.resolved}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                        Audited
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
