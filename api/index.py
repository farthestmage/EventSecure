from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import io
from PIL import Image
import psycopg2
import bcrypt
import os
from datetime import datetime
import base64
from dotenv import load_dotenv
app = Flask(__name__)

load_dotenv()  # Load environment variables from .env file



# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL', os.getenv('DATABASE_URL'))

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def create_tables():
    """Create necessary database tables"""
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            
            # Users table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    phone VARCHAR(20) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    face_encoding TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Events table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS events (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    event_date DATE NOT NULL,
                    location VARCHAR(255) NOT NULL,
                    created_by INTEGER REFERENCES users(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Event registrations table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS event_registrations (
                    id SERIAL PRIMARY KEY,
                    event_id INTEGER REFERENCES events(id),
                    user_id INTEGER REFERENCES users(id),
                    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    verified BOOLEAN DEFAULT FALSE
                )
            ''')
            
            conn.commit()
            cur.close()
            conn.close()
            print("Tables created successfully")
        except Exception as e:
            print(f"Error creating tables: {e}")

def process_face_image(image_file):
    """Process uploaded face image and extract encoding"""
    try:
        # Read image file
        image = Image.open(io.BytesIO(image_file.read()))
        image = image.convert('RGB')
        image_array = np.array(image)
        
        # Find face encodings
        face_encodings = face_recognition.face_encodings(image_array)
        
        if len(face_encodings) == 0:
            return None, "No face detected in the image"
        
        if len(face_encodings) > 1:
            return None, "Multiple faces detected. Please upload an image with only one face"
        
        # Return the first (and only) face encoding
        return face_encodings[0], None
        
    except Exception as e:
        return None, f"Error processing image: {str(e)}"

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user with face recognition"""
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        face_image = request.files.get('face_image')
        
        # Validate required fields
        if not all([name, email, phone, password, face_image]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Process face image
        face_encoding, error = process_face_image(face_image)
        if error:
            return jsonify({'error': error}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Convert face encoding to string for storage
        face_encoding_str = base64.b64encode(face_encoding.tobytes()).decode('utf-8')
        
        # Save to database
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO users (name, email, phone, password_hash, face_encoding)
                VALUES (%s, %s, %s, %s, %s)
            ''', (name, email, phone, password_hash.decode('utf-8'), face_encoding_str))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return jsonify({'message': 'User registered successfully'}), 201
            
        except psycopg2.IntegrityError:
            return jsonify({'error': 'Email already exists'}), 400
        except Exception as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login with email, password, and face verification"""
    try:
        # Get form data
        email = request.form.get('email')
        password = request.form.get('password')
        face_image = request.files.get('face_image')
        
        # Validate required fields
        if not all([email, password, face_image]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Get user from database
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        try:
            cur = conn.cursor()
            cur.execute('''
                SELECT id, name, email, password_hash, face_encoding
                FROM users WHERE email = %s
            ''', (email,))
            
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401
            
            user_id, name, user_email, stored_password_hash, stored_face_encoding = user
            
            # Verify password
            if not bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Process uploaded face image
            face_encoding, error = process_face_image(face_image)
            if error:
                return jsonify({'error': error}), 400
            
            # Compare face encodings
            stored_encoding = np.frombuffer(
                base64.b64decode(stored_face_encoding.encode('utf-8')), 
                dtype=np.float64
            )
            
            # Calculate face distance (lower is better)
            face_distance = face_recognition.face_distance([stored_encoding], face_encoding)[0]
            
            # Threshold for face recognition (adjust as needed)
            if face_distance > 0.6:
                return jsonify({'error': 'Face verification failed'}), 401
            
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user_id,
                    'name': name,
                    'email': user_email
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor()
        cur.execute('''
            SELECT e.id, e.title, e.description, e.event_date, e.location,
                   u.name as created_by, e.created_at,
                   COUNT(er.id) as attendee_count
            FROM events e
            LEFT JOIN users u ON e.created_by = u.id
            LEFT JOIN event_registrations er ON e.id = er.event_id
            GROUP BY e.id, u.name
            ORDER BY e.event_date DESC
        ''')
        
        events = cur.fetchall()
        cur.close()
        conn.close()
        
        events_list = []
        for event in events:
            events_list.append({
                'id': event[0],
                'title': event[1],
                'description': event[2],
                'date': event[3].isoformat() if event[3] else None,
                'location': event[4],
                'created_by': event[5],
                'created_at': event[6].isoformat() if event[6] else None,
                'attendees': event[7] or 0
            })
        
        return jsonify({'events': events_list}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch events: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Face recognition API is running'}), 200

# Initialize database tables on startup
create_tables()

if __name__ == '__main__':
    app.run(debug=True, port=5328)
