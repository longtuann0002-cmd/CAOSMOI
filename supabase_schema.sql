-- =========================================================================
-- CAOSMOI SUPABASE DATABASE SETUP SCHEMA
-- Execute the following SQL commands in your Supabase project's SQL Editor
-- to create the required tables and Row-Level Security (RLS) policies.
-- =========================================================================

-- 1. Create table to store application state blocks
CREATE TABLE IF NOT EXISTS camlease_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create application data tables
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  idNumber TEXT,
  trustLevel TEXT,
  rentalCount INTEGER DEFAULT 0,
  notes TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shortName TEXT,
  category TEXT,
  dailyRate NUMERIC,
  price6Hours NUMERIC,
  price1Day NUMERIC,
  price2Days NUMERIC,
  price3Days NUMERIC,
  price4DaysPlus NUMERIC,
  status TEXT,
  serialNumber TEXT,
  image TEXT,
  description TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  contractCode TEXT,
  customerId TEXT,
  customerName TEXT,
  customerPhone TEXT,
  customerDocType TEXT,
  customerDocNote TEXT,
  items JSONB,
  startDate TEXT,
  endDate TEXT,
  is6Hours BOOLEAN,
  returnTime TEXT,
  totalPrice NUMERIC,
  discountPercent NUMERIC,
  paidAmount NUMERIC,
  depositAmount NUMERIC,
  status TEXT,
  note TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  description TEXT,
  amount NUMERIC,
  date TEXT,
  category TEXT,
  operator TEXT,
  status TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- 3. Enable Row-Level Security (RLS) for all tables
ALTER TABLE camlease_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies to permit public client access

-- camlease_store
CREATE POLICY "Allow public read access" ON camlease_store FOR SELECT USING (true);
CREATE POLICY "Allow public insert/upsert" ON camlease_store FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON camlease_store FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON camlease_store FOR DELETE USING (true);

-- customers
CREATE POLICY "Allow public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert/upsert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON customers FOR DELETE USING (true);

-- cameras
CREATE POLICY "Allow public read access" ON cameras FOR SELECT USING (true);
CREATE POLICY "Allow public insert/upsert" ON cameras FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON cameras FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON cameras FOR DELETE USING (true);

-- contracts
CREATE POLICY "Allow public read access" ON contracts FOR SELECT USING (true);
CREATE POLICY "Allow public insert/upsert" ON contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON contracts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON contracts FOR DELETE USING (true);

-- expenses
CREATE POLICY "Allow public read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/upsert" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON expenses FOR DELETE USING (true);
