-- Fix security issues by setting proper search_path for functions
CREATE OR REPLACE FUNCTION public.generate_anonymous_username()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  adjectives TEXT[] := ARRAY['Happy', 'Calm', 'Bright', 'Gentle', 'Wise', 'Kind', 'Bold', 'Swift', 'Clear', 'Pure'];
  nouns TEXT[] := ARRAY['Student', 'Scholar', 'Learner', 'Thinker', 'Reader', 'Writer', 'Explorer', 'Creator', 'Helper', 'Friend'];
  username TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    username := adjectives[1 + floor(random() * array_length(adjectives, 1))] || 
                nouns[1 + floor(random() * array_length(nouns, 1))] || 
                floor(random() * 1000)::TEXT;
    
    -- Check if username already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE anonymous_username = username) THEN
      RETURN username;
    END IF;
    
    counter := counter + 1;
    IF counter > 100 THEN
      -- Fallback to UUID if we can't generate unique username
      RETURN 'User' || substring(gen_random_uuid()::TEXT from 1 for 8);
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, anonymous_username)
  VALUES (NEW.id, public.generate_anonymous_username());
  RETURN NEW;
END;
$$;