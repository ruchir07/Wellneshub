-- Create enhanced check-in assessments table
CREATE TABLE public.mental_health_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'daily_checkin', -- daily_checkin, phq9, gad7
  responses JSONB NOT NULL DEFAULT '{}', -- Store all question responses
  total_score INTEGER,
  severity_level TEXT, -- minimal, mild, moderate, moderately_severe, severe
  recommendations TEXT,
  flagged_for_intervention BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create institutions table for customization
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE, -- email domain for automatic institution detection
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  contact_email TEXT,
  helpline_number TEXT,
  emergency_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create counselors table for offline support mapping
CREATE TABLE public.counselors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID REFERENCES public.institutions(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialization TEXT[],
  availability_schedule JSONB, -- Store weekly schedule
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support resources table
CREATE TABLE public.support_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID REFERENCES public.institutions(id),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- article, video, tool, contact
  url TEXT,
  category TEXT[], -- stress, anxiety, depression, academic, social
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user institution mapping
CREATE TABLE public.user_institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  institution_id UUID REFERENCES public.institutions(id),
  role TEXT DEFAULT 'student', -- student, admin, counselor
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.mental_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_institutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mental_health_assessments
CREATE POLICY "Users can create their own assessments" 
ON public.mental_health_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" 
ON public.mental_health_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all assessments" 
ON public.mental_health_assessments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_institutions 
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- RLS Policies for institutions
CREATE POLICY "Everyone can view active institutions" 
ON public.institutions 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage institutions" 
ON public.institutions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_institutions 
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- RLS Policies for counselors
CREATE POLICY "Everyone can view active counselors" 
ON public.counselors 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage counselors" 
ON public.counselors 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_institutions 
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- RLS Policies for support_resources
CREATE POLICY "Everyone can view active resources" 
ON public.support_resources 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage resources" 
ON public.support_resources 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_institutions 
    WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- RLS Policies for user_institutions
CREATE POLICY "Users can view their own institution mapping" 
ON public.user_institutions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own institution mapping" 
ON public.user_institutions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user institutions" 
ON public.user_institutions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_institutions ui 
    WHERE ui.user_id = auth.uid() AND ui.role = 'admin' AND ui.is_active = true
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_mental_health_assessments_updated_at
BEFORE UPDATE ON public.mental_health_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at
BEFORE UPDATE ON public.institutions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_counselors_updated_at
BEFORE UPDATE ON public.counselors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_resources_updated_at
BEFORE UPDATE ON public.support_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample institution data
INSERT INTO public.institutions (name, domain, helpline_number, emergency_number, contact_email) VALUES
('Demo University', 'demo.edu', '1-800-HELP-123', '911', 'counseling@demo.edu'),
('Tech Institute', 'tech.edu', '1-800-TECH-456', '911', 'support@tech.edu');

-- Insert sample counselors
INSERT INTO public.counselors (institution_id, name, email, phone, specialization, bio) VALUES
((SELECT id FROM public.institutions WHERE domain = 'demo.edu'), 'Dr. Sarah Johnson', 'sarah.johnson@demo.edu', '555-0101', ARRAY['anxiety', 'depression', 'academic_stress'], 'Licensed clinical psychologist specializing in student mental health.'),
((SELECT id FROM public.institutions WHERE domain = 'demo.edu'), 'Dr. Michael Chen', 'michael.chen@demo.edu', '555-0102', ARRAY['stress_management', 'mindfulness', 'peer_relationships'], 'Counselor with expertise in mindfulness-based interventions.');

-- Insert sample support resources
INSERT INTO public.support_resources (institution_id, title, description, resource_type, category, url) VALUES
((SELECT id FROM public.institutions WHERE domain = 'demo.edu'), 'Crisis Helpline', '24/7 crisis support hotline', 'contact', ARRAY['crisis', 'emergency'], 'tel:1-800-HELP-123'),
((SELECT id FROM public.institutions WHERE domain = 'demo.edu'), 'Study Skills Workshop', 'Learn effective study techniques and time management', 'tool', ARRAY['academic', 'stress'], '/resources/study-skills'),
((SELECT id FROM public.institutions WHERE domain = 'demo.edu'), 'Mindfulness Meditation Guide', 'Guided meditation sessions for stress relief', 'tool', ARRAY['stress', 'anxiety'], '/resources/meditation');