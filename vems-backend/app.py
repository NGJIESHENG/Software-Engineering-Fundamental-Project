from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, current_user, UserMixin
from flask_bcrypt import Bcrypt
from flask_session import Session
import os

app = Flask(__name__)
app.config['SESSION_TYPE']='filesystem'
app.config['SECRET_KEY'] = 'your_very_secret_key_here'
basedir = os.path.abspath(os.path.dirname(__file__))
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
server_session = Session(app)
CORS(app,resources = {r"/api/*":{"origins":"*"}})
app.secret_key = 'supersecretkey'

SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = False

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///'+os.path.join(basedir,'vems.db')
db = SQLAlchemy(app)

class User(db.Model, UserMixin):
<<<<<<< HEAD
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20),nullable=True)
=======
    
    User_ID = db.Column(db.String(20), unique=True,  primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Password = db.Column(db.String(100), nullable=False)
    RecursionErrorole = db.Column(db.String(50), nullable=False)
    Phone = db.Column(db.String(10),nullable=True)

    bookings = db.relationship('Booking', backref='user_owner', lazy=True)
    approved_event = db.relationship('ApprovedEvent', backref='organizer', lazy=True)

class Admin(db.Model):
    __tablename__ = 'admin'
    Admin_ID = db.Column(db.String(20), primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Password = db.Column(db.String(100), nullable=False)

    logs = db.relationship('RequestLog', backref='authorozer', lazy=True)
>>>>>>> 583d756 (Add all db and connect all table tgt)

class Venue(db.Model):
    Venue_Id = db.Column(db.Integer, primary_key=True)
    Venue_Name = db.Column(db.String(100), nullable=False)
    Capacity = db.Column(db.Integer, nullable=False)
    Status = db.Column(db.String(50), default='Available')

    bookings = db.relationship('Bookinng', backref='location',lazy=True)

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

    logs = db.relationship('RequestLog',backref='related_booking', lazy=True)
    events = db.relationship('ApprovedEvent', backref='source_booking', lazy=True)

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    existing_user=User.query.filter_by(userId=data['userId']).first()
    pw = data['password']
    hashed_pw = bcrypt.generate_password_hash(pw)
    if existing_user:
         return jsonify({"message": "User ID already taken"}),400
    try:
        new_user = User(
            userId=data['userId'],
            name=data['name'],
            email=data['email'],
            password=hashed_pw,
            role=data['role'],
            phone=data.get('phone',''),
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print(f"Databse Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
    
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(userId=data['userId']).first()
    pw = data['password']
    try:
        if user and bcrypt.check_password_hash(user.password, pw):
            login_user(user)
            if user.role == "Admin":
                current_user.role = "admin"
            return jsonify({"message": f"{user.name} login successfully!","user": {"name": user.name, "userId": user.userId, "email": user.email, "role": user.role, "phone": user.phone}}), 200
        else:
            return jsonify({"message": "User ID or password incorrect."}), 401
    except Exception as e:
        print(f"Databse Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/logout')
def logout():
    logout_user()
    return "User logout successfully!", 203


        

@app.route ('/api/update_phone',methods = ['POST'])
def update_phone():
    data = request.json
    user_id = data.get('userId')
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    else:
        user = User.query.filter_by(userId=user_id).first()
    try:
        if not user:
            return jsonify({"message": "User not found."}), 404
        else:
            user.phone = data.get('phone', '')
            db.session.commit()
            return jsonify({"message": "Phone number updated successfully!"}), 200
    except Exception as e:
        print(f"Database Error: {e}")
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500


if __name__=='__main__':
    app.run(debug=True, port=5000)
