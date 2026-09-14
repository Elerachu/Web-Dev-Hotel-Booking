-- Sample data for hotel_db
USE hotel_db;

INSERT INTO guests (name, email, phone, passport_number) VALUES
                                                             ('Ashwin Patel', 'ashwin.patel@email.com', '57654321', 'P1234567'),
                                                             ('Bayo Moyo', 'bayo.moyo@email.com', '57654322', 'P2345678'),
                                                             ('Jean-Luc Victor', 'jeanluc.v@email.com', '57654323', 'P3456789'),
                                                             ('Zainab Osei', 'zainab.osei@email.com', '57654324', 'P4567890'),
                                                             ('Sherif Sumaila', 'marco.f@email.com', '57654325', 'P5678901');

INSERT INTO rooms (room_number, room_type, price_per_night, status) VALUES
                                                                        (101, 'Single', 60.00, 'available'),
                                                                        (102, 'Double', 90.00, 'available'),
                                                                        (103, 'Double', 90.00, 'occupied'),
                                                                        (201, 'Suite', 150.00, 'available'),
                                                                        (202, 'Suite', 150.00, 'maintenance');

INSERT INTO bookings (guest_id, room_id, check_in_date, check_out_date, total_price, status) VALUES
                                                                                                 (1, 1, '2026-09-20', '2026-09-22', 120.00, 'checked_in'),
                                                                                                 (2, 2, '2026-09-21', '2026-09-25', 360.00, 'pending'),
                                                                                                 (3, 4, '2026-09-22', '2026-09-24', 300.00, 'checked_out'),
                                                                                                 (4, 3, '2026-09-23', '2026-09-26', 270.00, 'pending'),
                                                                                                 (5, 5, '2026-09-24', '2026-09-27', 450.00, 'cancelled');