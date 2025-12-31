import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Gift, DollarSign, Target, Zap } from 'lucide-react';

const spinData = [
  { date: 'Dec 24', spins: 120, conversions: 45 },
  { date: 'Dec 25', spins: 180, conversions: 68 },
  { date: 'Dec 26', spins: 150, conversions: 52 },
  { date: 'Dec 27', spins: 210, conversions: 89 },
  { date: 'Dec 28', spins: 190, conversions: 71 },
  { date: 'Dec 29', spins: 230, conversions: 95 },
  { date: 'Dec 30', spins: 280, conversions: 112 },
];

const prizeDistribution = [
  { name: '10% OFF', value: 320, color: '#FF6B6B' },
  { name: '15% OFF', value: 240, color: '#4ECDC4' },
  { name: '20% OFF', value: 180, color: '#FFD93D' },
  { name: 'Free Shipping', value: 210, color: '#95E1D3' },
  { name: '$5 OFF', value: 150, color: '#AA96DA' },
  { name: 'Try Again', value: 280, color: '#FCBAD3' },
];

const conversionData = [
  { campaign: 'Summer Sale', rate: 42 },
  { campaign: 'Black Friday', rate: 58 },
  { campaign: 'New Year', rate: 35 },
  { campaign: 'Spring Special', rate: 48 },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">Track performance and insights for your campaigns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Spins</CardTitle>
            <Zap className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5,642</div>
            <p className="text-xs text-white/80 mt-1">
              <span className="text-green-200">↑ 12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Discount Codes Redeemed</CardTitle>
            <Gift className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,847</div>
            <p className="text-xs text-white/80 mt-1">
              <span className="text-green-200">↑ 8.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">50.4%</div>
            <p className="text-xs text-white/80 mt-1">
              <span className="text-green-200">↑ 4.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$18,423</div>
            <p className="text-xs text-white/80 mt-1">
              <span className="text-green-200">↑ 15.7%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Spins & Conversions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Spins & Conversions</CardTitle>
            <CardDescription>Daily performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spinData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="spins" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prize Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Prize Distribution</CardTitle>
            <CardDescription>Breakdown of prizes won by users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prizeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prizeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate by Campaign */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Conversion Rate by Campaign</CardTitle>
            <CardDescription>Percentage of spins that led to purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="campaign" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar 
                  dataKey="rate" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-purple-600">Black Friday Sale</p>
              <p className="text-sm text-gray-600">58% conversion rate</p>
              <p className="text-sm text-gray-600">1,847 total spins</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Popular Prize</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">10% OFF</p>
              <p className="text-sm text-gray-600">320 times won</p>
              <p className="text-sm text-gray-600">23% of all prizes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avg. Time to Spin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-teal-600">2.4 seconds</p>
              <p className="text-sm text-gray-600">From page load</p>
              <p className="text-sm text-gray-600">High engagement!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
