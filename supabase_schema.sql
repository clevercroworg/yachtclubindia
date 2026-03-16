-- Run this script in your Supabase SQL Editor to create the required table

CREATE TABLE bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    yacht_title text,
    yacht_id text,
    booking_date text,
    time_slot text,
    guests integer,
    extra_hours numeric,
    addons jsonb,
    total_hours numeric,
    charter_cost numeric,
    addons_cost numeric,
    quantity integer,
    subtotal numeric,
    customer_first_name text,
    customer_last_name text,
    customer_email text,
    customer_phone text,
    customer_company text,
    status text DEFAULT 'pending'
);

-- Optional: Enable Row Level Security (RLS) but allow all operations since our Next.js API uses the Service Role Key to bypass it safely
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role full access" ON bookings USING (true);
