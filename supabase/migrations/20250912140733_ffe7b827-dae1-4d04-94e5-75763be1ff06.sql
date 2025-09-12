-- Create an institution for demo purposes if it doesn't exist
INSERT INTO institutions (id, name, domain, contact_email, helpline_number, emergency_number)
VALUES (
  '167c2cf7-9848-4db0-a984-0f625c7e2c56',
  'Demo University',
  'demo.edu',
  'support@demo.edu',
  '1-800-HELP',
  '911'
) ON CONFLICT (id) DO NOTHING;

-- Assign admin role to the first user (kshitijdatir1@gmail.com)
INSERT INTO user_institutions (user_id, institution_id, role, is_active)
VALUES (
  '10343f2e-27a4-477d-9a76-3e385697a1d8',
  '167c2cf7-9848-4db0-a984-0f625c7e2c56',
  'admin',
  true
) ON CONFLICT (user_id, institution_id) DO UPDATE SET role = 'admin', is_active = true;

-- Create user accounts for existing counselors
-- Note: These will need to sign up with these emails first
INSERT INTO user_institutions (user_id, institution_id, role, is_active)
SELECT 
  auth.users.id,
  '167c2cf7-9848-4db0-a984-0f625c7e2c56',
  'counselor',
  true
FROM auth.users 
CROSS JOIN counselors
WHERE auth.users.email = counselors.email
ON CONFLICT (user_id, institution_id) DO UPDATE SET role = 'counselor', is_active = true;