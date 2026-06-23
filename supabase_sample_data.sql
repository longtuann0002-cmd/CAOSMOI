-- =========================================================================
-- CAMLEASE SAMPLE DATA - INSERT TEST DATA INTO SUPABASE
-- Execute the following SQL commands in your Supabase project's SQL Editor
-- =========================================================================

-- 1. Insert Sample Customers
INSERT INTO public.customers (id, name, phone, email, address, id_number, trust_level) VALUES
('cust_001', 'Nguyễn Văn A', '0901234567', 'nvan.a@example.com', '123 Đường Lê Lợi, TP.HCM', '001234567890', 'trusted'),
('cust_002', 'Trần Thị B', '0912345678', 'tran.b@example.com', '456 Đường Nguyễn Huệ, TP.HCM', '001234567891', 'verified'),
('cust_003', 'Phạm Minh C', '0923456789', 'pham.c@example.com', '789 Đường Đinh Tiên Hoàng, TP.HCM', '001234567892', 'new'),
('cust_004', 'Võ Hoàng D', '0934567890', 'vo.d@example.com', '321 Đường Tôn Đức Thắng, TP.HCM', '001234567893', 'trusted'),
('cust_005', 'Bùi Minh E', '0945678901', 'bui.e@example.com', '654 Đường Bạch Đằng, TP.HCM', '001234567894', 'verified')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Sample Cameras
INSERT INTO public.cameras (id, name, model, brand, status, condition, rental_price) VALUES
('cam_001', 'Canon EOS R5', 'Canon EOS R5', 'Canon', 'available', 'excellent', 5000),
('cam_002', 'Sony A7IV', 'Sony A7IV', 'Sony', 'available', 'excellent', 4500),
('cam_003', 'Nikon Z9', 'Nikon Z9', 'Nikon', 'rented', 'excellent', 6000),
('cam_004', 'Fujifilm X-T5', 'Fujifilm X-T5', 'Fujifilm', 'available', 'good', 3500),
('cam_005', 'Canon EOS 5D Mark IV', 'Canon EOS 5D', 'Canon', 'maintenance', 'good', 3000),
('cam_006', 'Sony FX30', 'Sony FX30', 'Sony', 'available', 'excellent', 4000),
('cam_007', 'DJI Air 3S', 'DJI Air 3S', 'DJI', 'available', 'excellent', 2500),
('cam_008', 'GoPro Hero 12', 'GoPro Hero 12', 'GoPro', 'rented', 'excellent', 1500)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Sample Contracts
INSERT INTO public.contracts (id, customer_id, camera_id, status, start_date, end_date, rental_fee, deposit, total_cost) VALUES
('cont_001', 'cust_001', 'cam_001', 'active', '2026-06-20', '2026-06-27', 35000, 10000, 45000),
('cont_002', 'cust_002', 'cam_003', 'active', '2026-06-22', '2026-06-29', 42000, 15000, 57000),
('cont_003', 'cust_003', 'cam_004', 'completed', '2026-06-10', '2026-06-17', 24500, 8000, 32500),
('cont_004', 'cust_004', 'cam_008', 'active', '2026-06-21', '2026-06-24', 4500, 2000, 6500),
('cont_005', 'cust_005', 'cam_002', 'completed', '2026-06-01', '2026-06-15', 67500, 12000, 79500),
('cont_006', 'cust_001', 'cam_006', 'completed', '2026-05-01', '2026-05-10', 36000, 10000, 46000)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Sample Expenses
INSERT INTO public.expenses (id, category, description, amount, date, status) VALUES
('exp_001', 'maintenance', 'Bảo dưỡng Canon EOS R5', 2500000, '2026-06-15', 'completed'),
('exp_002', 'repair', 'Sửa chữa ống kính Sony', 1500000, '2026-06-18', 'completed'),
('exp_003', 'insurance', 'Bảo hiểm thiết bị quý II', 5000000, '2026-06-01', 'completed'),
('exp_004', 'utilities', 'Điện nước studio tháng 6', 800000, '2026-06-10', 'completed'),
('exp_005', 'staff', 'Lương nhân viên', 15000000, '2026-06-01', 'completed'),
('exp_006', 'equipment', 'Mua đèn chiếu sáng mới', 3000000, '2026-06-20', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample User Profiles (Optional - for Authentication)
INSERT INTO public.user_profiles (id, email, full_name, company, phone) VALUES
('user_001', 'admin@camlease.com', 'Quản Trị Viên', 'CAMLEASE', '0901111111'),
('user_002', 'staff@camlease.com', 'Nhân Viên', 'CAMLEASE', '0902222222'),
('user_003', 'customer@camlease.com', 'Khách Hàng', 'ABC Studio', '0903333333')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- VERIFICATION QUERIES - Run these to verify data was inserted
-- =========================================================================

-- Check customers count
-- SELECT COUNT(*) as total_customers FROM public.customers;

-- Check cameras count
-- SELECT COUNT(*) as total_cameras FROM public.cameras;

-- Check contracts count
-- SELECT COUNT(*) as total_contracts FROM public.contracts;

-- Check expenses count
-- SELECT COUNT(*) as total_expenses FROM public.expenses;

-- View all cameras with availability
-- SELECT id, name, model, status, rental_price FROM public.cameras ORDER BY name;

-- View all active contracts
-- SELECT c.id, cust.name, cam.name, c.start_date, c.end_date, c.total_cost 
-- FROM public.contracts c
-- JOIN public.customers cust ON c.customer_id = cust.id
-- JOIN public.cameras cam ON c.camera_id = cam.id
-- WHERE c.status = 'active';
