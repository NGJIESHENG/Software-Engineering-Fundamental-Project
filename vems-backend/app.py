from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///vems.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.string(20), unique=True, nullable=False)
    name = db.Column(db.string(100), nullable=False)
    email = db.Column(db.string(100), unique=True, nullable=False)
    role = db.Column(db.string(50), nullable=False)

class Venue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Available')

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(
        userId=data['userId'],
        name=data['name'],
        email=data['email'],
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message: User registered successfully!"}), 201

if __name__=='__main__':
    app.run(debug=True, port=5000)