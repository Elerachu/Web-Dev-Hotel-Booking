-- Sample data for restaurant_db
USE restaurant_db;

INSERT INTO customers (name, phone, email) VALUES
('Ashwin Patel', '57654321', 'ashwin.patel@email.com'),
('Lindiwe Princess', '57654322', 'lindiwe.princess@email.com'),
('Jean-Luc Victor', '57654323', 'jeanluc.b@email.com'),
('Zainab Osei', '57654324', 'zainab.osei@email.com'),
('Sherif Sumaila', '57654325', 'sherif.s@email.com');

INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
(1, 2, 'available'),
(2, 4, 'available'),
(3, 4, 'occupied'),
(4, 6, 'available'),
(5, 8, 'reserved');

INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time, number_of_people, status) VALUES
(1, 1, '2026-09-20', '19:00:00', 2, 'confirmed'),
(2, 2, '2026-09-20', '20:00:00', 4, 'pending'),
(3, 4, '2026-09-21', '18:30:00', 5, 'confirmed'),
(4, 5, '2026-09-21', '19:30:00', 7, 'pending'),
(5, 3, '2026-09-22', '20:30:00', 3, 'cancelled');
