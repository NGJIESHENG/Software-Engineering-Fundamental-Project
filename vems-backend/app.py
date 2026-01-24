from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, current_user, UserMixin
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SESSION_TYPE']='filesystem'
app.config['SECRET_KEY'] = 'dandfOUINWi3oinspdfj056dfh56w323rrtDGet456'
basedir = os.path.abspath(os.path.dirname(__file__))
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
#server_session = Session(app)
CORS(app,resources = {r"/api/*":{"origins":"*"}})
jwt = JWTManager(app)

SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = False

app.config['JWT_SECRET_KEY'] = 'IYfbisbegsougbef4t98473yt934hpGBfiebgAAAA' # New secret for tokens
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1) # Token expires in 1 hour

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///'+os.path.join(basedir,'vems.db')
db = SQLAlchemy(app)

class User(db.Model, UserMixin): #, UserMixin
    User_ID = db.Column(db.String(20), unique=True,  primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Password = db.Column(db.String(100), nullable=False)
    Role = db.Column(db.String(50), nullable=False)
    Phone = db.Column(db.String(20),nullable=True)
    bookings = db.relationship('Booking', backref='user_owner', lazy=True)
    approved_event = db.relationship('ApprovedEvent', backref='organizer', lazy=True)
    def get_id(self):
        return self.User_ID

class Admin(db.Model):
    __tablename__ = 'admin'
    Admin_ID = db.Column(db.String(20), primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Password = db.Column(db.String(100), nullable=False)
    logs = db.relationship('RequestLog', backref='authorozer', lazy=True)

class Venue(db.Model):
    Venue_ID = db.Column(db.Integer, primary_key=True)
    Venue_Name = db.Column(db.String(100), nullable=False)
    Venue_Type = db.Column(db.String(50), nullable=False) 
    Capacity = db.Column(db.Integer, nullable=False)
    Status = db.Column(db.String(50), default='Available')
    bookings = db.relationship('Booking', backref='location', lazy=True)

class Booking(db.Model):
    __tablename__ = 'booking'
    Booking_ID = db.Column(db.Integer,primary_key=True)
    User_ID = db.Column(db.String(20), db.ForeignKey('user.User_ID'), nullable=False)
    Venue_ID = db.Column(db.Integer, db.ForeignKey('venue.Venue_ID'), nullable=False)
    Date = db.Column(db.String(20), nullable=False)
    Submission_Date = db.Column(db.String(20))
    Start_Time = db.Column(db.String(10))
    End_Time = db.Column(db.String(10))
    Description = db.Column(db.String(255))
    Booking_Status = db.Column(db.String(20), default='Pending')
    Event_Name = db.Column(db.String(100)) 
    Estimated_Participants = db.Column(db.Integer) 
    Booking_Reason = db.Column(db.String(50)) 
    Organisation = db.Column(db.String(100)) 
    Special_Requirements = db.Column(db.String(255)) 
    Contact_Name = db.Column(db.String(100)) 
    Contact_Gender = db.Column(db.String(10)) 
    logs = db.relationship('RequestLog',backref='related_booking', lazy=True)
    events = db.relationship('ApprovedEvent', backref='source_booking', lazy=True)

class RequestLog(db.Model):
    __tablename__ = 'request_log'
    Log_ID = db.Column(db.Integer,primary_key=True)
    Booking_ID = db.Column(db.Integer, db.ForeignKey('booking.Booking_ID'), nullable =False)
    Admin_ID = db.Column(db.Integer, db.ForeignKey('admin.Admin_ID'), nullable = False)
    Action_Type = db.Column(db.String(50))
    Action_Time = db.Column(db.String(20))
    Reason_Notes = db.Column(db.String((255)))
    Old_Status = db.Column(db.String(20))
    New_Status = db.Column(db.String(20))

class ApprovedEvent (db.Model):
    __tablename__ = 'approved_event'
    Event_ID = db.Column(db.Integer, primary_key=True)
    User_ID = db.Column(db.String(20), db.ForeignKey('user.User_ID'), nullable = False)
    Venue_ID = db.Column(db.Integer, db.ForeignKey('venue.Venue_ID'), nullable = False)
    Booking_ID = db.Column(db.Integer, db.ForeignKey('booking.Booking_ID'), nullable = False)
    Admin_ID = db.Column(db.String(20), db.ForeignKey('admin.Admin_ID'), nullable = False)
    Event_Name = db.Column(db.String(100))
    Description = db.Column(db.String(255))
    Start_Time = db.Column(db.String(10))
    End_Time = db.Column(db.String(10))



with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(User_ID):
    return User.query.get(User_ID)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    existing_user=User.query.filter_by(User_ID=data['User_ID']).first()
    pw = data['Password']
    hashed_pw = bcrypt.generate_password_hash(pw)
    if existing_user:
         return jsonify({"message": "User ID already taken"}),400
    try:
        new_user = User(
            User_ID=data['User_ID'],
            Name=data['Name'],
            Email=data['Email'],
            Password=hashed_pw,
            Role=data['Role'],
            Phone=data.get('Phone',''),
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print(f"Databse Error: {e}")
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500
    
# REPLACE your login endpoint in app.py

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user_id = data.get('User_ID')
    password = data.get('Password')
    
    user = User.query.filter_by(User_ID=user_id).first()
    
    try:
        if user and bcrypt.check_password_hash(user.Password, password):
            login_user(user)
            
            # FIX: identity must be a STRING, not a dict
            access_token = create_access_token(identity=user.User_ID)
            
            return jsonify({
                "message": f"{user.Name} login successfully!",
                "token": access_token,
                "user": {
                    "Name": user.Name, 
                    "User_ID": user.User_ID, 
                    "Email": user.Email,
                    "Role": user.Role, 
                    "Phone": user.Phone
                }
            }), 200
        else:
            return jsonify({"message": "User ID or password incorrect."}), 401
            
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
@app.route('/api/user/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        # Verify the token's user matches the requested user
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({"message": "Unauthorized"}), 403
        
        user = User.query.filter_by(User_ID=user_id).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        return jsonify({
            "Name": user.Name,
            "User_ID": user.User_ID,
            "Email": user.Email,
            "Role": user.Role,
            "Phone": user.Phone
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
@app.route ('/api/update_phone',methods = ['POST'])
def update_phone():
    data = request.json
    User_ID = data.get('User_ID')
    if not User_ID:
        return jsonify({"message": "User ID is required"}), 400
    else:
        user = User.query.filter_by(User_ID=User_ID).first()
    try:
        if not user:
            return jsonify({"message": "User not found."}), 404
        else:
            user.Phone = data.get('Phone', '')
            db.session.commit()
            return jsonify({"message": "Phone number updated successfully!"}), 200
    except Exception as e:
        print(f"Database Error: {e}")
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/venue-types', methods=['GET'])
def get_venue_types():
    try:
        types = db.session.query(Venue.Venue_Type).distinct().all()
        type_list = [
            {
                'id': t[0].lower().replace(' ', '_'),
                'name': t[0]
            }
            for t in types
        ]
        
        return jsonify(type_list), 200
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500


@app.route('/api/venues-by-type/<type_id>', methods=['GET'])
def get_venues_by_type(type_id):
    try:
        type_name = ' '.join(word.capitalize() for word in type_id.split('_'))
        
        venues = Venue.query.filter_by(Venue_Type=type_name).all()
        venues_list = []
        
        for venue in venues:
            venues_list.append({
                'id': venue.Venue_ID,
                'name': venue.Venue_Name,
                'capacity': venue.Capacity,
                'status': venue.Status,
                'type': venue.Venue_Type
            })
        
        return jsonify(venues_list), 200
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/check-availability', methods=['POST'])
def check_availability():
    try:
        data = request.json
        date = data.get('date')
        venue_id = data.get('venue_id')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        venue = Venue.query.filter_by(Venue_ID=venue_id).first()
        if not venue:
            return jsonify({
                'available': False,
                'reason': 'Venue not found'
            }), 200
            
        if venue.Status != 'Available':
            return jsonify({
                'available': False,
                'reason': f'Venue is currently {venue.Status}'
            }), 200
        
        overlapping_bookings = Booking.query.filter_by(
            Venue_ID=venue_id,
            Date=date
        ).filter(
            (Booking.Start_Time < end_time) &
            (Booking.End_Time > start_time) &
            (Booking.Booking_Status.in_(['Approved', 'Pending']))
        ).all()
        
        is_available = len(overlapping_bookings) == 0
        
        response_data = {
            'available': is_available,
            'venue_status': venue.Status,
            'venue_capacity': venue.Capacity
        }
        
        if not is_available:
            response_data['reason'] = 'Time slot is already booked'
            response_data['conflicts'] = [{
                'start_time': booking.Start_Time,
                'end_time': booking.End_Time,
                'status': booking.Booking_Status
            } for booking in overlapping_bookings]
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/create-booking', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        # get_jwt_identity() now returns a string (User_ID), not a dict
        user_id_from_token = get_jwt_identity()
        
        data = request.json

        # Compare user_id directly (both are strings now)
        if data.get('user_id') != user_id_from_token:
            return jsonify({"message": "Unauthorized: You can only book for yourself"}), 403
        
        required_fields = ['user_id', 'venue_id', 'date', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"message": f"Missing required field: {field}"}), 400
    
        user = User.query.filter_by(User_ID=data['user_id']).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
     
        venue = Venue.query.filter_by(Venue_ID=data['venue_id']).first()
        if not venue:
            return jsonify({"message": "Venue not found"}), 405
    
        if venue.Status != 'Available':
            return jsonify({
                "message": f"Venue is currently {venue.Status}",
                "status": venue.Status
            }), 409
      
        overlapping_bookings = Booking.query.filter_by(
            Venue_ID=data['venue_id'],
            Date=data['date']
        ).filter(
            (Booking.Start_Time < data['end_time']) &
            (Booking.End_Time > data['start_time']) &
            (Booking.Booking_Status.in_(['Approved', 'Pending']))
        ).all()
        
        if overlapping_bookings:
            return jsonify({
                "message": "Venue is not available at the selected time",
                "conflicts": len(overlapping_bookings)
            }), 409
      
        new_booking = Booking(
            User_ID=data['user_id'],
            Venue_ID=data['venue_id'],
            Date=data['date'],
            Start_Time=data['start_time'],
            End_Time=data['end_time'],
            Description=data.get('description', ''),
            Submission_Date=datetime.now().strftime('%Y-%m-%d'),
            Booking_Status='Pending',
            Event_Name=data.get('event_name', ''),
            Estimated_Participants=data.get('estimated_participants'),
            Booking_Reason=data.get('booking_reason', ''),
            Organisation=data.get('organisation', ''),
            Special_Requirements=data.get('special_requirements', ''),
            Contact_Name=data.get('contact_name', ''),
            Contact_Gender=data.get('contact_gender', '')
        )
        
        db.session.add(new_booking)
        db.session.commit()
        
        return jsonify({
            "message": "Booking request submitted successfully!",
            "booking_id": new_booking.Booking_ID,
            "status": "Pending"
        }), 201
        
    except Exception as e:
        print(f"Database Error: {e}")
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500


@app.route('/api/user-bookings/<user_id>', methods=['GET'])
@jwt_required()
def get_user_bookings(user_id):
    try:
        
        user = User.query.filter_by(User_ID=user_id).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        results = db.session.query(
            Booking, 
            Venue.Venue_Name, 
            Venue.Venue_Type, 
            Venue.Capacity, 
            RequestLog.Reason_Notes
        )\
        .join(Venue, Booking.Venue_ID == Venue.Venue_ID)\
        .outerjoin(RequestLog, Booking.Booking_ID == RequestLog.Booking_ID)\
        .filter(Booking.User_ID == user_id)\
        .order_by(Booking.Date.desc())\
        .all()
        
        bookings_list = []
        for b, v_name, v_type, v_cap, reason in results:
            bookings_list.append({
                'booking_id': b.Booking_ID,
                'date': b.Date,
                'start_time': b.Start_Time,
                'end_time': b.End_Time,
                'description': b.Description,
                'status': b.Booking_Status,
                'submission_date': b.Submission_Date,
                'event_name': b.Event_Name,
                'estimated_participants': b.Estimated_Participants,
                'booking_reason': b.Booking_Reason,
                'organisation': b.Organisation,
                'special_requirements': b.Special_Requirements,
                'contact_name': b.Contact_Name,
                'contact_gender': b.Contact_Gender,
                'venue_name': v_name,
                'venue_type': v_type,
                'venue_capacity': v_cap,
                'rejection_reason': reason if b.Booking_Status == 'Rejected' else None
            })
        
        return jsonify({
            "user": {
                "id": user.User_ID,
                "name": user.Name,
                "email": user.Email,
                "role": user.Role
            },
            "bookings": bookings_list,
            "count": len(bookings_list)
        }), 200
        
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/admin/update-venue-status', methods=['POST'])
def update_venue_status():
    try:
        data = request.json
        venue_id = data.get('venue_id')
        new_status = data.get('status')
        reason = data.get('reason', '')
        
        if not venue_id or not new_status:
            return jsonify({"message": "Venue ID and status are required"}), 400
        
        if new_status not in ['Available', 'Maintenance', 'Closed', 'Reserved']:
            return jsonify({"message": "Invalid status"}), 400
        
        venue = Venue.query.filter_by(Venue_ID=venue_id).first()
        if not venue:
            return jsonify({"message": "Venue not found"}), 405
        
        old_status = venue.Status
        venue.Status = new_status
        
        db.session.commit()
        
        return jsonify({
            "message": f"Venue status updated to {new_status}",
            "venue_id": venue_id,
            "venue_name": venue.Venue_Name,
            "old_status": old_status,
            "new_status": new_status
        }), 200
        
    except Exception as e:
        print(f"Database Error: {e}")
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500

def populate_initial_data():
    with app.app_context():
        venue_count = Venue.query.count()
        
        if venue_count > 0:
            print("Database already has data. Skipping initialization.")
            return
        
        print("Populating initial data...")
        
        venue_data = [
            # Halls
            {'Venue_Name': 'DTC Grand Hall', 'Venue_Type': 'Hall', 'Capacity': 5000, 'Status': 'Available'},
            {'Venue_Name': 'Multi-purpose Hall', 'Venue_Type': 'Hall', 'Capacity': 200, 'Status': 'Available'},
            
            # Lecture Halls
            {'Venue_Name': 'Lecture Hall CNMX1001', 'Venue_Type': 'Lecture Hall', 'Capacity': 120, 'Status': 'Available'},
            {'Venue_Name': 'Lecture Hall CNMX1002', 'Venue_Type': 'Lecture Hall', 'Capacity': 120, 'Status': 'Available'},
            {'Venue_Name': 'Lecture Hall CNMX1003', 'Venue_Type': 'Lecture Hall', 'Capacity': 120, 'Status': 'Available'},
            {'Venue_Name': 'Lecture Hall CNMX1004', 'Venue_Type': 'Lecture Hall', 'Capacity': 120, 'Status': 'Available'},
            {'Venue_Name': 'Lecture Hall CNMX1005', 'Venue_Type': 'Lecture Hall', 'Capacity': 120, 'Status': 'Available'},
            
            # Sports Facility
            {'Venue_Name': 'Swimming Pool', 'Venue_Type': 'Sports Facility', 'Capacity': 50, 'Status': 'Available'},
            {'Venue_Name': 'Basketball Court', 'Venue_Type': 'Sports Facility', 'Capacity': 100, 'Status': 'Available'},
            
            # FCI Computer Labs
            {'Venue_Name': 'CQAR 1001', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQAR 1002', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQAR 1003', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQAR 1004', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQAR 1005', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQCR 2001', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQCR 2002', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQCR 2003', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQCR 2004', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
            {'Venue_Name': 'CQCR 2005', 'Venue_Type': 'FCI', 'Capacity': 30, 'Status': 'Available'},
        ]
        
        for venue_info in venue_data:
            venue = Venue(**venue_info)
            db.session.add(venue)
        
        db.session.commit()
        print(f"Initial data populated successfully! Added {len(venue_data)} venues.")

@app.route('/api/admin/all-bookings', methods=['GET'])
def get_all_bookings():
    try:
       
        bookings = db.session.query(Booking, Venue.Venue_Name, User.Name)\
            .join(Venue, Booking.Venue_ID == Venue.Venue_ID)\
            .join(User, Booking.User_ID == User.User_ID)\
            .filter(Booking.Booking_Status == 'Pending')\
            .all()

        output = []
        for b, venue_name, user_name in bookings:
            output.append({
                "id": b.Booking_ID,
                "user_name": user_name,
                "venue_name": venue_name,
                "date": b.Date,
                "start_time": b.Start_Time,
                "end_time": b.End_Time,
                "status": b.Booking_Status,
                "event_name": b.Event_Name
            })
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@app.route('/api/admin/decide-booking', methods=['POST'])

def decide_booking():
    try:
        data = request.json
        booking_id = data.get('booking_id')
        decision = data.get('decision') 
        admin_id = data.get('admin_id', 'admin01')
        reason = data.get('reason', '') 

        booking = Booking.query.get(booking_id) 
        if not booking:
            return jsonify({"message": "Booking not found"}), 407

        old_status = booking.Booking_Status
        booking.Booking_Status = decision

        log_entry = RequestLog(
                Booking_ID=booking_id,
                Admin_ID=admin_id,
                Action_Type=decision,
                Action_Time=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                Reason_Notes=reason,
                Old_Status=old_status,
                New_Status=decision
            )
        db.session.add(log_entry)

        if decision == 'Approved':
            
            new_event = ApprovedEvent(
                User_ID=booking.User_ID,
                Venue_ID=booking.Venue_ID,
                Booking_ID=booking.Booking_ID,
                Admin_ID=admin_id,
                Event_Name=booking.Event_Name,
                Description=booking.Description,
                Start_Time=booking.Start_Time,
                End_Time=booking.End_Time
            )
            db.session.add(new_event)

        db.session.commit()
        return jsonify({"message": f"Booking {decision} successfully!"}), 200

    except Exception as e:
        print(f"Error: {e}") 
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
    
@app.route('/api/booking-details', methods=['GET'])
@jwt_required()
def get_booking_details():
    try:
        booking_id = request.args.get('booking_id')
        
        if not booking_id:
            return jsonify({'message': 'Booking ID is required'}), 400

        result = db.session.query(Booking, Venue)\
            .join(Venue, Booking.Venue_ID == Venue.Venue_ID)\
            .filter(Booking.Booking_ID == booking_id)\
            .first()

        if not result:
            return jsonify({'message': 'Booking not found'}), 404

        booking, venue = result  # Unpack the tuple returned by the query

        # 3. Construct the response object
        # Keys here match exactly what your React 'setFormData' and 'setSummaryData' expect
        response_data = {
            # Meta / Summary Data
            "booking_id": booking.Booking_ID,
            "status": booking.Booking_Status,
            "date": booking.Date if booking.Date else None,
            "start_time": str(booking.Start_Time),
            "end_time": str(booking.End_Time),
            "venue_name": venue.Venue_Name,
            "venue_type": getattr(venue, 'Venue_Type', 'N/A'), # Use getattr in case column is missing
            "venue_capacity": venue.Capacity,

            # Form Data Fields
            "contact_name": booking.Contact_Name,
            "contact_gender": booking.Contact_Gender,
            "booking_reason": booking.Booking_Reason,
            "description": booking.Description,
            "organisation": booking.Organisation,
            "event_name": booking.Event_Name,
            "estimated_participants": booking.Estimated_Participants,
            "special_requirements": booking.Special_Requirements
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error fetching booking details: {str(e)}")
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

@app.route('/api/update-booking', methods=['PUT'])
@jwt_required()
def update_booking():
    try:
        # 1. Get JSON data from the request body
        data = request.get_json()
        booking_id = data.get('booking_id')

        if not booking_id:
            return jsonify({'message': 'Booking ID is required'}), 400

        # 2. Find the existing booking in the database
        booking = db.session.query(Booking).filter(Booking.Booking_ID == booking_id).first()

        if not booking:
            return jsonify({'message': 'Booking not found'}), 404

        # 3. Update the fields
        # We use .get() to only update if the new value is provided, otherwise keep existing
        booking.Description = data.get('description', booking.Description)
        booking.Event_Name = data.get('event_name', booking.Event_Name)
        booking.Estimated_Participants = data.get('estimated_participants', booking.Estimated_Participants)
        booking.Booking_Reason = data.get('booking_reason', booking.Booking_Reason)
        booking.Organisation = data.get('organisation', booking.Organisation)
        booking.Special_Requirements = data.get('special_requirements', booking.Special_Requirements)
        booking.Contact_Name = data.get('contact_name', booking.Contact_Name)
        booking.Contact_Gender = data.get('contact_gender', booking.Contact_Gender)

        # 4. Commit changes to the database
        db.session.commit()

        return jsonify({
            'message': 'Booking updated successfully',
            'booking_id': booking.Booking_ID
        }), 200

    except Exception as e:
        db.session.rollback() # Rollback in case of error to keep DB clean
        print(f"Error updating booking: {str(e)}")
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

with app.app_context():
    db.create_all()
    populate_initial_data()

if __name__=='__main__':
    app.run(debug=True, port=5000)