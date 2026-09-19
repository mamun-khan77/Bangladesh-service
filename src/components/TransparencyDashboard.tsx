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
  Building2
} from 'lucide-react';

export const TransparencyDashboard: React.FC = () => {
  const { reports, theme } = useApp();

  const isDark = theme !== 'light';
  const isLight = !isDark;

  const gridStroke = isDark ? 'rgba(240, 237, 228, 0.12)' : 'rgba(0, 71, 65, 0.12)';
  const axisStroke = isDark ? 'rgba(240, 237, 228, 0.6)' : 'rgba(0, 71, 65, 0.6)';

  const tooltipStyle = {
    backgroundColor: isDark ? '#003a35' : '#FAF8F5',
    borderColor: isDark ? 'rgba(240, 237, 228, 0.3)' : 'rgba(0, 71, 65, 0.3)',
    color: isDark ? '#F0EDE4' : '#004741',
    borderRadius: '10px',
    fontSize: '12px',
    boxShadow: '0 8px 20px rgba(0, 35, 32, 0.25)'
  };

  const total = reports.length;
  const underReview = reports.filter((r) => r.status === 'under_review' || r.status === 'submitted').length;
  const verified = reports.filter((r) => r.status === 'verified' || r.status === 'forwarded_to_authority').length;
  const actionTaken = reports.filter((r) => r.status === 'action_taken').length;
  const resolved = reports.filter((r) => r.status === 'resolved').length;

  // Category counts data for BarChart
  const categoryCounts: { [key: string]: number } = {};
  reports.forEach((r) => {
    const cat = r.category.replace(/_/g, ' ');
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const barData = Object.keys(categoryCounts).map((cat) => ({
    name: cat.length > 12 ? cat.slice(0, 11) + '...' : cat,
    fullName: cat,
    count: categoryCounts[cat]
  }));

  // Status breakdown data for Doughnut/PieChart in strictly 2 colors with shading
  const pieData = [
    {
      name: 'Resolved',
      value: resolved || 1,
      color: isDark ? '#F0EDE4' : '#004741'
    },
    {
      name: 'Action Taken',
      value: actionTaken || 1,
      color: isDark ? 'rgba(240, 237, 228, 0.75)' : 'rgba(0, 71, 65, 0.75)'
    },
    {
      name: 'Verified / Dispatched',
      value: verified || 1,
      color: isDark ? 'rgba(240, 237, 228, 0.5)' : 'rgba(0, 71, 65, 0.5)'
    },
    {
      name: 'Under Review',
      value: underReview || 1,
      color: isDark ? 'rgba(240, 237, 228, 0.25)' : 'rgba(0, 71, 65, 0.25)'
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
    <div className="space-y-8" id="transparency-analytics-dashboard">
      {/* Header */}
      <div
        className={`border rounded-2xl p-6 shadow-xl space-y-2 ${
          isLight
            ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
            : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" />
              <span>National Civic Transparency & Resolution Dashboard</span>
            </h2>
            <p className="text-xs mt-1 max-w-2xl leading-relaxed opacity-80">
              Real-time audit metrics tracking citizen grievances, verification rate, municipal responsiveness, and state department accountability nationwide.
            </p>
          </div>

          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${
              isLight
                ? 'bg-white border-[#004741]/20 text-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/20 text-[#F0EDE4]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isLight ? 'bg-[#004741]' : 'bg-[#F0EDE4]'
              }`}
            />
            <span>Audited Period: 2026 Fiscal Year</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`border rounded-2xl p-5 space-y-1 shadow-sm ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/15 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div className="text-xs font-semibold opacity-80 flex items-center justify-between">
            <span>Total Logged Reports</span>
            <FileCheck className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-3xl font-black">{total}</div>
          <div className="text-[11px] opacity-70">Across 64 Bangladesh districts</div>
        </div>

        <div
          className={`border rounded-2xl p-5 space-y-1 shadow-sm ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/15 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div className="text-xs font-semibold opacity-80 flex items-center justify-between">
            <span>In Official Processing</span>
            <Clock className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-3xl font-black">{underReview + verified}</div>
          <div className="text-[11px] opacity-70">Active review / Field verification</div>
        </div>

        <div
          className={`border rounded-2xl p-5 space-y-1 shadow-sm ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/15 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div className="text-xs font-semibold opacity-80 flex items-center justify-between">
            <span>Action Taken / Responded</span>
            <Building2 className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-3xl font-black">{actionTaken}</div>
          <div className="text-[11px] opacity-70">Official dispatch reference posted</div>
        </div>

        <div
          className={`border rounded-2xl p-5 space-y-1 shadow-sm ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/15 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div className="text-xs font-semibold opacity-80 flex items-center justify-between">
            <span>Resolved Grievances</span>
            <CheckCircle2 className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-3xl font-black">{resolved}</div>
          <div className="text-[11px] opacity-70">Average resolution: ~4.2 business days</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports by Category Bar Chart */}
        <div
          className={`lg:col-span-7 border rounded-2xl p-5 space-y-4 shadow-xl ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">Grievance Distribution by Category</h3>
              <p className="text-[11px] opacity-75">Total volume of reported citizen concerns</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
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
                  fill={isDark ? '#F0EDE4' : '#004741'}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div
          className={`lg:col-span-5 border rounded-2xl p-5 space-y-4 shadow-xl ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div>
            <h3 className="text-sm font-bold">Workflow Status Breakdown</h3>
            <p className="text-[11px] opacity-75">Resolution lifecycle proportion</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    color: isDark ? '#F0EDE4' : '#004741'
                  }}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div
        className={`border rounded-2xl p-5 space-y-4 shadow-xl ${
          isLight
            ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
            : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Monthly Citizen Reporting & Resolution Trajectory</span>
            </h3>
            <p className="text-[11px] opacity-75">Comparing incoming submissions vs verified resolutions</p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="month" stroke={axisStroke} fontSize={11} tickLine={false} />
              <YAxis stroke={axisStroke} fontSize={11} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                  color: isDark ? '#F0EDE4' : '#004741'
                }}
              />
              <Line
                type="monotone"
                dataKey="submitted"
                name="Submissions"
                stroke={isDark ? 'rgba(240, 237, 228, 0.45)' : 'rgba(0, 71, 65, 0.45)'}
                strokeWidth={2.5}
                dot={{ fill: isDark ? 'rgba(240, 237, 228, 0.6)' : 'rgba(0, 71, 65, 0.6)' }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Resolved / Addressed"
                stroke={isDark ? '#F0EDE4' : '#004741'}
                strokeWidth={2.5}
                dot={{ fill: isDark ? '#F0EDE4' : '#004741' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Breakdown Table */}
      <div
        className={`border rounded-2xl p-5 space-y-4 shadow-xl ${
          isLight
            ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
            : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
        }`}
      >
        <h3 className="text-sm font-bold">District-Level Responsiveness Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b text-[11px] uppercase tracking-wider ${
                isLight
                  ? 'border-[#004741]/15 bg-white/60 opacity-80'
                  : 'border-[#F0EDE4]/15 bg-[#003833]/60 opacity-80'
              }`}
            >
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Total Reports</th>
                <th className="py-3 px-4">Action Taken / Resolved</th>
                <th className="py-3 px-4">Resolution Rate</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-[#004741]/10' : 'divide-[#F0EDE4]/10'}`}>
              {Object.keys(districtCounts).map((dist) => {
                const data = districtCounts[dist];
                const rate = Math.round((data.resolved / data.total) * 100) || 0;
                return (
                  <tr
                    key={dist}
                    className={`transition-colors ${
                      isLight ? 'hover:bg-white/70' : 'hover:bg-[#003833]/70'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">{dist}</td>
                    <td className="py-3 px-4 font-mono opacity-80">{data.total}</td>
                    <td className="py-3 px-4 font-mono font-bold">{data.resolved}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-24 h-2 rounded-full overflow-hidden ${
                            isLight ? 'bg-[#004741]/15' : 'bg-[#F0EDE4]/15'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full ${
                              isLight ? 'bg-[#004741]' : 'bg-[#F0EDE4]'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="font-mono opacity-90">{rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isLight
                            ? 'bg-white border-[#004741]/20 text-[#004741]'
                            : 'bg-[#003833] border-[#F0EDE4]/20 text-[#F0EDE4]'
                        }`}
                      >
                        Synchronized
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
