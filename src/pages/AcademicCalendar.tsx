import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, AlertTriangle, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  event_type: z.enum(["assignment", "exam", "project", "presentation"]),
  due_date: z.date(),
  priority: z.enum(["low", "medium", "high"]),
});

const stressFormSchema = z.object({
  stress_level: z.number().min(1).max(5),
  confidence_level: z.number().min(1).max(5),
  additional_concerns: z.string().optional(),
});

interface AcademicEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  due_date: string;
  priority: string;
  completed: boolean;
}

interface StressAssessment {
  id: string;
  academic_event_id: string;
  stress_level: number;
  confidence_level: number;
  additional_concerns?: string;
}

export default function AcademicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showStressDialog, setShowStressDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const eventForm = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      event_type: "assignment",
      due_date: new Date(),
      priority: "medium",
    },
  });

  const stressForm = useForm<z.infer<typeof stressFormSchema>>({
    resolver: zodResolver(stressFormSchema),
    defaultValues: {
      stress_level: 3,
      confidence_level: 3,
      additional_concerns: "",
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("academic_events")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events. Please make sure you're logged in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitEvent = async (values: z.infer<typeof eventFormSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add events.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("academic_events").insert({
        title: values.title,
        description: values.description,
        event_type: values.event_type,
        due_date: values.due_date.toISOString(),
        priority: values.priority,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Event added",
        description: "Your academic event has been successfully added.",
      });

      eventForm.reset();
      setShowEventDialog(false);
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitStress = async (values: z.infer<typeof stressFormSchema>) => {
    if (!selectedEvent) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit stress assessment.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("stress_assessments").insert({
        stress_level: values.stress_level,
        confidence_level: values.confidence_level,
        additional_concerns: values.additional_concerns,
        academic_event_id: selectedEvent.id,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Assessment submitted",
        description: "Your stress assessment has been recorded. Here are some tips to help you manage:",
      });

      // Show stress management tips based on the assessment
      showStressTips(values.stress_level, values.confidence_level);

      stressForm.reset();
      setShowStressDialog(false);
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showStressTips = (stressLevel: number, confidenceLevel: number) => {
    let tips = [];
    
    if (stressLevel >= 4) {
      tips.push("Take deep breaths and try progressive muscle relaxation");
      tips.push("Break your task into smaller, manageable chunks");
      tips.push("Consider talking to a counselor or trusted friend");
    }
    
    if (confidenceLevel <= 2) {
      tips.push("Review your study materials and create a study plan");
      tips.push("Seek help from teachers, tutors, or study groups");
      tips.push("Practice with sample questions or similar exercises");
    }

    if (tips.length > 0) {
      setTimeout(() => {
        toast({
          title: "Stress Management Tips",
          description: tips.join(" • "),
        });
      }, 2000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "exam": return "📝";
      case "assignment": return "📋";
      case "project": return "🚀";
      case "presentation": return "🗣️";
      default: return "📅";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto p-6">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <CalendarDays className="h-10 w-10 text-primary" />
              Academic Calendar
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your deadlines and manage stress with personalized insights
            </p>
          </div>

          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Academic Event</DialogTitle>
                <DialogDescription>
                  Add a deadline or important academic event to your calendar.
                </DialogDescription>
              </DialogHeader>
              <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Math Final Exam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional details..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="event_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="assignment">Assignment</SelectItem>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="presentation">Presentation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={eventForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={eventForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowEventDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Event</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view events</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>
                  Your academic deadlines and important dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No events scheduled yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your first academic event to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{getEventTypeIcon(event.event_type)}</span>
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.due_date), "MMM dd, yyyy 'at' HH:mm")}
                            </p>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(event.priority)}>
                            {event.priority}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowStressDialog(true);
                            }}
                          >
                            Assess Stress
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stress Assessment Dialog */}
        <Dialog open={showStressDialog} onOpenChange={setShowStressDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Stress Assessment</DialogTitle>
              <DialogDescription>
                Help us understand how you're feeling about "{selectedEvent?.title}" so we can provide personalized support.
              </DialogDescription>
            </DialogHeader>
            <Form {...stressForm}>
              <form onSubmit={stressForm.handleSubmit(onSubmitStress)} className="space-y-6">
                <FormField
                  control={stressForm.control}
                  name="stress_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How stressed do you feel about this event? (1-5)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Not stressed</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${
                                  field.value >= level
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground"
                                }`}
                                onClick={() => field.onChange(level)}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                          <span className="text-sm">Very stressed</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={stressForm.control}
                  name="confidence_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How confident do you feel about completing this successfully? (1-5)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Not confident</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${
                                  field.value >= level
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground"
                                }`}
                                onClick={() => field.onChange(level)}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                          <span className="text-sm">Very confident</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={stressForm.control}
                  name="additional_concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any additional concerns or thoughts? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., I'm worried about the time management, need help with specific topics..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowStressDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Assessment</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}