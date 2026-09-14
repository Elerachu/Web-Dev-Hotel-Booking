-- Hotel Room Booking Management System schema
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

CREATE TABLE guests (
                        guest_id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        email VARCHAR(100) UNIQUE,
                        phone VARCHAR(20) NOT NULL,
                        passport_number VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE rooms (
                       room_id INT AUTO_INCREMENT PRIMARY KEY,
                       room_number INT NOT NULL UNIQUE,
                       room_type VARCHAR(50) NOT NULL,
                       price_per_night DECIMAL(10,2) NOT NULL,
                       status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available'
);

CREATE TABLE bookings (
                          booking_id INT AUTO_INCREMENT PRIMARY KEY,
                          guest_id INT NOT NULL,
                          room_id INT NOT NULL,
                          check_in_date DATE NOT NULL,
                          check_out_date DATE NOT NULL,
                          total_price DECIMAL(10,2) NOT NULL,
                          status ENUM('pending', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
                          FOREIGN KEY (guest_id) REFERENCES guests(guest_id)
                              ON DELETE CASCADE,
                          FOREIGN KEY (room_id) REFERENCES rooms(room_id)
                              ON DELETE CASCADE
);