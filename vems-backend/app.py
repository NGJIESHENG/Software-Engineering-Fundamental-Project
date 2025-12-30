from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
login_manager = LoginManager()
login_manager.init_app(app)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///'+os.path.join(basedir,'vems.db')
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Venue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Available')

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    existing_user=User.query.filter_by(userId=data['userId']).first()
    if existing_user:
         return jsonify({"message": "User ID already taken"}),400
    try:
        new_user = User(
            userId=data['userId'],
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=data['role']
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
    existing_user = User.query.filter_by(userId=data['userId'], password=data['password']).first()
    try:
        if not existing_user:
            return jsonify({"message": "User ID or password incorrect."}), 401
        else:
            #login_user(user_id)
            return jsonify({"message": "User login successfully!"}), 202
    except Exception as e:
        print(f"Databse Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

if __name__=='__main__':
        app.run(debug=True, port=5000)