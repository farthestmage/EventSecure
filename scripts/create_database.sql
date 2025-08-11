-- Create database and tables for event management system

-- Create database (run this separately if needed)
-- CREATE DATABASE eventdb;

-- Connect to the database
-- \c eventdb;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    face_encoding TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    user_id INTEGER REFERENCES users(id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);

-- Insert sample events (optional)
INSERT INTO events (title, description, event_date, location) VALUES
('Tech Conference 2024', 'Annual technology conference featuring latest innovations', '2024-03-15', 'Convention Center, NYC'),
('AI Workshop', 'Hands-on workshop on artificial intelligence and machine learning', '2024-02-28', 'Tech Hub, San Francisco'),
('Startup Pitch Day', 'Entrepreneurs pitch their innovative ideas to investors', '2024-02-10', 'Innovation Center, Austin')
ON CONFLICT DO NOTHING;
