/*
  # QR Code Management Schema

  1. New Tables
    - `qr_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `slug` (text, unique identifier for QR code)
      - `redirect_url` (text, target URL)
      - `title` (text, name for the QR code)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `visits` (integer, tracks number of visits)

  2. Security
    - Enable RLS on `qr_codes` table
    - Add policies for:
      - Users can read their own QR codes
      - Users can create their own QR codes
      - Users can update their own QR codes
      - Anyone can read QR codes for redirection
*/

CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  slug text UNIQUE NOT NULL,
  redirect_url text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  visits integer DEFAULT 0
);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own QR codes
CREATE POLICY "Users can read own qr_codes" ON qr_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to create their own QR codes
CREATE POLICY "Users can create own qr_codes" ON qr_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own QR codes
CREATE POLICY "Users can update own qr_codes" ON qr_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow public access for redirection
CREATE POLICY "Public can read qr_codes for redirection" ON qr_codes
  FOR SELECT
  TO anon
  USING (true);