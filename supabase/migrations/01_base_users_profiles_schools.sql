-- Create User Types enum
CREATE TYPE user_type AS ENUM ('school', 'teacher', 'student', 'regular');

-- Create Schools table
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_person TEXT,
  access_key TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on schools
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Allow read access to schools for authentication checks (e.g. verifying access key)
CREATE POLICY "Allow public read access to schools" ON schools FOR SELECT USING (true);

-- Create Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_type user_type DEFAULT 'regular',
  school_id UUID REFERENCES schools(id),
  class_level TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'user_type')::user_type, 'regular')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Onboarding Responses table
CREATE TABLE onboarding_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  goals TEXT,
  usage_plan TEXT,
  additional_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on onboarding_responses
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own onboarding data
CREATE POLICY "Users can insert their own onboarding responses" 
ON onboarding_responses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own onboarding data
CREATE POLICY "Users can read their own onboarding responses" 
ON onboarding_responses FOR SELECT 
USING (auth.uid() = user_id);
