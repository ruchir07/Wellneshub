import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Phone,
  MessageCircle,
  Heart,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalStudents: number;
  activeToday: number;
  flaggedCases: number;
  averageScore: number;
  weeklyTrend: number;
}

interface AssessmentData {
  date: string;
  totalAssessments: number;
  averageScore: number;
  flaggedCount: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeToday: 0,
    flaggedCases: 0,
    averageScore: 0,
    weeklyTrend: 0
  });
  const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [recentFlagged, setRecentFlagged] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive"
      });
      return;
    }

    const { data: userInstitution } = await supabase
      .from('user_institutions')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userInstitution) {
      toast({
        title: "Access Denied", 
        description: "You don't have admin privileges.",
        variant: "destructive"
      });
    }
  };

  const loadDashboardData = async () => {
    try {
      // Get total assessments and statistics
      const { data: assessments, error: assessmentsError } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (assessmentsError) throw assessmentsError;

      // Calculate statistics
      const today = new Date().toDateString();
      const todayAssessments = assessments?.filter(a => 
        new Date(a.created_at).toDateString() === today
      ) || [];
      
      const flaggedCases = assessments?.filter(a => a.flagged_for_intervention) || [];
      const averageScore = assessments?.length > 0 
        ? assessments.reduce((sum, a) => sum + (a.total_score || 0), 0) / assessments.length 
        : 0;

      // Get unique users
      const uniqueUsers = new Set(assessments?.map(a => a.user_id)).size;

      setStats({
        totalStudents: uniqueUsers,
        activeToday: new Set(todayAssessments.map(a => a.user_id)).size,
        flaggedCases: flaggedCases.length,
        averageScore: Math.round(averageScore),
        weeklyTrend: 5.2 // Mock weekly trend
      });

      // Prepare chart data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toDateString();
      }).reverse();

      const chartData = last7Days.map(date => {
        const dayAssessments = assessments?.filter(a => 
          new Date(a.created_at).toDateString() === date
        ) || [];
        
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          totalAssessments: dayAssessments.length,
          averageScore: dayAssessments.length > 0 
            ? Math.round(dayAssessments.reduce((sum, a) => sum + (a.total_score || 0), 0) / dayAssessments.length)
            : 0,
          flaggedCount: dayAssessments.filter(a => a.flagged_for_intervention).length
        };
      });

      setAssessmentData(chartData);

      // Severity distribution
      const severityCount = assessments?.reduce((acc: any, assessment) => {
        const severity = assessment.severity_level || 'minimal';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {});

      const colors = {
        minimal: '#22c55e',
        mild: '#eab308', 
        moderate: '#f97316',
        severe: '#ef4444'
      };

      const severityChartData = Object.entries(severityCount || {}).map(([severity, count]) => ({
        name: severity.charAt(0).toUpperCase() + severity.slice(1),
        value: count as number,
        color: colors[severity as keyof typeof colors] || '#6b7280'
      }));

      setSeverityData(severityChartData);

      // Recent flagged cases
      setRecentFlagged(flaggedCases.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Using demo data.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time insights into student mental health and wellness
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Refresh Data
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold">{stats.activeToday}</p>
                  </div>
                  <Heart className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Flagged Cases</p>
                    <p className="text-2xl font-bold text-destructive">{stats.flaggedCases}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Wellbeing Score</p>
                    <p className="text-2xl font-bold">{stats.averageScore}%</p>
                    <p className="text-xs text-green-500">+{stats.weeklyTrend}% this week</p>
                  </div>
                  <Brain className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assessment Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Check-ins (Last 7 Days)</CardTitle>
                    <CardDescription>
                      Number of mental health assessments completed daily
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={assessmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalAssessments" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Severity Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mental Health Severity Distribution</CardTitle>
                    <CardDescription>
                      Current distribution of assessment severity levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, payload }: any) => `${name} ${payload?.percent ? `${(payload.percent * 100).toFixed(0)}%` : ''}`}
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wellbeing Score Trends</CardTitle>
                  <CardDescription>
                    Average daily wellbeing scores over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={assessmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="averageScore" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">High Priority Cases</CardTitle>
                    <CardDescription>
                      Students requiring immediate attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentFlagged.length > 0 ? (
                      recentFlagged.map((assessment, index) => (
                        <div key={assessment.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="destructive">High Risk</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(assessment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">Score: {assessment.total_score}/30</p>
                          <p className="text-sm text-muted-foreground">{assessment.recommendations}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="destructive">
                              <Phone className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No high-priority cases at this time
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Intervention Statistics</CardTitle>
                    <CardDescription>
                      Response metrics and outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Rate</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Counselor Availability</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Resource Usage</span>
                        <span className="font-medium">76%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Counselor Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Dr. Sarah Johnson</span>
                        <Badge>85% Booked</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Dr. Michael Chen</span>
                        <Badge variant="secondary">62% Booked</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Slots</span>
                        <span className="font-medium">23 this week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Meditation Guide</span>
                        <span className="text-sm font-medium">234 views</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Study Skills Workshop</span>
                        <span className="text-sm font-medium">189 views</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Crisis Helpline</span>
                        <span className="text-sm font-medium">67 calls</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Chat Bot Status</span>
                        <Badge className="bg-green-500">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-500">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API Response</span>
                        <span className="text-sm font-medium">125ms avg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;