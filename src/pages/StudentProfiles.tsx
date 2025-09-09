import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  MessageCircle,
  BarChart3,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  id: string;
  anonymousUsername: string;
  riskLevel: 'low' | 'moderate' | 'high';
  lastCheckIn: string;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
  totalAssessments: number;
  flagged: boolean;
}

const StudentProfiles = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentProfiles();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedRisk, students]);

  const loadStudentProfiles = async () => {
    try {
      // Get all profiles and their assessments
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

      const { data: assessments } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      // Create student profiles with anonymized data
      const studentProfiles: StudentProfile[] = (profiles || []).map(profile => {
        const userAssessments = assessments?.filter(a => a.user_id === profile.user_id) || [];
        const latestAssessment = userAssessments[0];
        
        // Calculate risk level based on recent assessments
        const recentScores = userAssessments.slice(0, 3).map(a => a.total_score || 0);
        const avgScore = recentScores.length > 0 
          ? recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
          : 0;
        
        let riskLevel: 'low' | 'moderate' | 'high' = 'low';
        if (avgScore >= 15) riskLevel = 'high';
        else if (avgScore >= 8) riskLevel = 'moderate';

        // Calculate trend (simplified)
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (userAssessments.length >= 2) {
          const recent = userAssessments[0]?.total_score || 0;
          const previous = userAssessments[1]?.total_score || 0;
          if (recent > previous + 2) trend = 'down'; // Higher score = worse wellbeing
          else if (recent < previous - 2) trend = 'up'; // Lower score = better wellbeing
        }

        return {
          id: profile.id,
          anonymousUsername: profile.anonymous_username || `Student${profile.id.slice(-4)}`,
          riskLevel,
          lastCheckIn: latestAssessment?.created_at || 'Never',
          averageScore: Math.round((30 - avgScore) / 30 * 100), // Invert for wellness score
          trend,
          totalAssessments: userAssessments.length,
          flagged: userAssessments.some(a => a.flagged_for_intervention)
        };
      });

      setStudents(studentProfiles);
      setLoading(false);
    } catch (error) {
      console.error('Error loading student profiles:', error);
      // Generate mock data for demonstration
      generateMockProfiles();
      setLoading(false);
    }
  };

  const generateMockProfiles = () => {
    const mockStudents: StudentProfile[] = Array.from({ length: 25 }, (_, i) => {
      const riskLevels: ('low' | 'moderate' | 'high')[] = ['low', 'low', 'low', 'moderate', 'moderate', 'high'];
      const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
      
      return {
        id: `mock-${i}`,
        anonymousUsername: `AnonymousStudent${String(i + 1).padStart(3, '0')}`,
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        lastCheckIn: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: Math.floor(Math.random() * 40) + 60,
        trend: trends[Math.floor(Math.random() * trends.length)],
        totalAssessments: Math.floor(Math.random() * 20) + 1,
        flagged: Math.random() < 0.1 // 10% flagged
      };
    });

    setStudents(mockStudents);
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.anonymousUsername.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRisk !== 'all') {
      filtered = filtered.filter(student => student.riskLevel === selectedRisk);
    }

    setFilteredStudents(filtered);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <BarChart3 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading student profiles...</p>
        </div>
      </div>
    );
  }

  const riskStats = {
    low: students.filter(s => s.riskLevel === 'low').length,
    moderate: students.filter(s => s.riskLevel === 'moderate').length,
    high: students.filter(s => s.riskLevel === 'high').length
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Profiles (Anonymous)</h1>
              <p className="text-muted-foreground">
                Privacy-protected overview of student mental health status
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                  </div>
                  <User className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                    <p className="text-2xl font-bold text-green-600">{riskStats.low}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Moderate Risk</p>
                    <p className="text-2xl font-bold text-yellow-600">{riskStats.moderate}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-red-600">{riskStats.high}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search anonymous username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRisk === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedRisk('all')}
              >
                All Risk Levels
              </Button>
              <Button
                variant={selectedRisk === 'high' ? 'default' : 'outline'}
                onClick={() => setSelectedRisk('high')}
              >
                High Risk
              </Button>
              <Button
                variant={selectedRisk === 'moderate' ? 'default' : 'outline'}
                onClick={() => setSelectedRisk('moderate')}
              >
                Moderate Risk
              </Button>
              <Button
                variant={selectedRisk === 'low' ? 'default' : 'outline'}
                onClick={() => setSelectedRisk('low')}
              >
                Low Risk
              </Button>
            </div>
          </div>

          {/* Student Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className={`${student.flagged ? 'border-destructive' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {student.anonymousUsername.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{student.anonymousUsername}</CardTitle>
                        <CardDescription>
                          {student.totalAssessments} check-ins completed
                        </CardDescription>
                      </div>
                    </div>
                    {student.flagged && (
                      <Badge variant="destructive" className="text-xs">
                        Flagged
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Level</span>
                    <Badge variant={getRiskColor(student.riskLevel) as any}>
                      {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wellness Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{student.averageScore}%</span>
                      {getTrendIcon(student.trend)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Check-in</span>
                    <span className="text-sm text-muted-foreground">
                      {student.lastCheckIn !== 'Never' 
                        ? new Date(student.lastCheckIn).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      View Trends
                    </Button>
                    {student.flagged && (
                      <Button size="sm" variant="destructive" className="flex-1">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Urgent
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or risk level filters.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Privacy Notice */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Privacy Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    All student identities are anonymized. Only authorized counselors and administrators can access detailed intervention information. This dashboard provides aggregated insights while maintaining complete student privacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfiles;