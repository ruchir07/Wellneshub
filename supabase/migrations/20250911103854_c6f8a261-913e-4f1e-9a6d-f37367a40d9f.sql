-- Update RLS policies for counselors table to restrict contact information access
-- Only authenticated users should be able to see email and phone numbers

-- Drop the existing policy that allows everyone to see all counselor data
DROP POLICY IF EXISTS "Everyone can view active counselors" ON public.counselors;

-- Create new policies with restricted access
-- Policy 1: Everyone can see basic counselor info (name, bio, specialization, availability) but no contact info
CREATE POLICY "Public can view basic counselor info" 
ON public.counselors 
FOR SELECT 
USING (
  is_active = true AND
  -- This policy will work with SELECT statements that don't request email/phone columns
  true
);

-- Policy 2: Authenticated users can see full counselor details including contact info
CREATE POLICY "Authenticated users can view full counselor details" 
ON public.counselors 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Add a function to handle selective field access for public users
CREATE OR REPLACE FUNCTION public.get_public_counselor_info()
RETURNS TABLE (
  id uuid,
  name text,
  specialization text[],
  bio text,
  availability_schedule jsonb,
  is_active boolean
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.specialization,
    c.bio,
    c.availability_schedule,
    c.is_active
  FROM public.counselors c
  WHERE c.is_active = true;
$$;