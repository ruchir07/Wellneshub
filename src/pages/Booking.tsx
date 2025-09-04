import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, Star, Shield, CheckCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const counselors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Stress Management',
    experience: '8 years',
    rating: 4.9,
    avatar: 'SJ',
    bio: 'Specialized in helping students manage academic stress and anxiety with evidence-based techniques.',
    availability: 'Available today'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Depression & Mood Disorders',
    experience: '12 years',
    rating: 4.8,
    avatar: 'MC',
    bio: 'Expert in cognitive behavioral therapy and helping students navigate depression and mood challenges.',
    availability: 'Available tomorrow'
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    specialization: 'Relationship & Social Issues',
    experience: '6 years',
    rating: 4.9,
    avatar: 'PS',
    bio: 'Focuses on interpersonal relationships, social anxiety, and building healthy communication skills.',
    availability: 'Available this week'
  }
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const Booking = () => {
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !sessionType) {
      toast({
        title: "Please fill all required fields",
        description: "Select counselor, date, time, and session type to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsBooked(true);
    toast({
      title: "Appointment Booked Successfully!",
      description: "You'll receive a confirmation email shortly.",
    });
  };

  const selectedCounselorData = counselors.find(c => c.id === selectedCounselor);

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center space-y-6">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
              <CardDescription className="text-lg">
                Your session has been scheduled successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-wellness p-6 rounded-lg text-left">
                <h3 className="font-semibold text-wellness-foreground mb-4">Session Details</h3>
                <div className="space-y-2 text-sm text-wellness-foreground">
                  <p><strong>Counselor:</strong> {selectedCounselorData?.name}</p>
                  <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Type:</strong> {sessionType}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>📧 Confirmation email sent</p>
                <p>📅 Calendar invite included</p>
                <p>🔒 Session link will be shared 15 minutes before</p>
              </div>
              <Button variant="hero" className="w-full">
                View My Appointments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Book Your Counseling Session
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with a professional counselor in a safe, confidential environment.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Counselor Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Choose Your Counselor
                  </CardTitle>
                  <CardDescription>
                    Select a counselor based on their specialization and availability.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {counselors.map((counselor) => (
                    <Card 
                      key={counselor.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCounselor === counselor.id 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedCounselor(counselor.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {counselor.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                                <p className="text-sm text-primary font-medium">{counselor.specialization}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{counselor.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{counselor.bio}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{counselor.experience} experience</Badge>
                              <Badge variant="outline" className="text-secondary">{counselor.availability}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {selectedCounselor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      Select Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Choose Date</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border border-border"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Available Time Slots</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "hero" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className="justify-center"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="session-type" className="text-sm font-medium">
                      Session Type *
                    </Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call (45 min)</SelectItem>
                        <SelectItem value="audio">Audio Call (45 min)</SelectItem>
                        <SelectItem value="chat">Text Chat (30 min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reason" className="text-sm font-medium">
                      Reason for Session (Optional)
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Brief description of what you'd like to discuss..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {selectedCounselor && selectedDate && selectedTime && (
                    <div className="bg-wellness p-4 rounded-lg space-y-2">
                      <h4 className="font-semibold text-wellness-foreground">Booking Summary</h4>
                      <div className="text-sm text-wellness-foreground space-y-1">
                        <p><strong>Counselor:</strong> {selectedCounselorData?.name}</p>
                        <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {selectedTime}</p>
                        {sessionType && <p><strong>Type:</strong> {sessionType}</p>}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleBooking} 
                    variant="hero" 
                    className="w-full"
                    disabled={!selectedCounselor || !selectedDate || !selectedTime || !sessionType}
                  >
                    Book Session
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>All sessions are completely confidential</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;