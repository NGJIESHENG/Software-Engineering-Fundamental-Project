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
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(10),nullable=True)

class Venue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Available')

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
        if bcrypt.check_password_hash(user.password, pw):
            login_user(user)
            if user.role == "Admin":
                current_user.role = "admin"
            return jsonify({"message": "${user} login successfully!"}), 202
        else:
            return jsonify({"message": "User ID or password incorrect."}), 401
    except Exception as e:
        print(f"Databse Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/logout')
def logout():
    logout_user()
    return "User logout successfully!", 203

@app.route('/test')
def test():
    if current_user.is_authenticated:
        return 'Yes'
    else:
        return 'No'
        

@app.route ('/api/update_phone',methods = ['POST'])
def update_phone():
    data = request.json
    existing_user = User.query.filter_by(userId=data['userId']).first()
    try:
        if not existing_user:
            return jsonify({"message": "User not found."}), 404
        else:
            existing_user.phone = data['phone']
            db.session.commit()
            return jsonify({"message": "Phone number updated successfully!"}), 200
    except Exception as e:
        print(f"Database Error: {e}")
        db.session.rollback()
        return jsonify({"message": "Internal Server Error"}), 500

if __name__=='__main__':
    app.run(debug=True, port=5000)
