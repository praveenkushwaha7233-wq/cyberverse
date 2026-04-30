from flask import Flask, render_template, request, redirect
from flask_pymongo import PyMongo
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = "secret123"

# 🔥 MongoDB Connection (SAFE VERSION)
mongo_uri = os.environ.get("MONGO_URI")

if not mongo_uri:
    print("❌ MONGO_URI NOT FOUND")

app.config["MONGO_URI"] = mongo_uri

mongo = PyMongo(app)
@app.route('/test-db')
def test_db():
    try:
        mongo.db.test.insert_one({"msg": "working"})
        return "✅ MongoDB Connected"
    except Exception as e:
        return f"❌ DB Error: {e}"


# Login Manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# User Class
class User(UserMixin):
    def __init__(self, username, role="user"):
        self.id = username
        self.role = role

# Load user
@login_manager.user_loader
def load_user(user_id):
    user_data = mongo.db.users.find_one({"username": user_id})
    if user_data:
        return User(user_data['username'], user_data.get('role', 'user'))
    return None

# Home
@app.route('/')
def home():
    try:
        if mongo.db is None:
            return "❌ MongoDB not connected"

        tools = list(mongo.db.tools.find())
        return render_template('index.html', tools=tools)

    except Exception as e:
        return f"❌ Error: {e}"
# Register
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        hashed_password = generate_password_hash(password)

        mongo.db.users.insert_one({
            "username": username,
            "password": hashed_password,
            "role": "user"
        })

        return redirect('/login')

    return render_template('register.html')

# Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user_data = mongo.db.users.find_one({"username": username})

        if user_data and check_password_hash(user_data['password'], password):
            user = User(user_data['username'], user_data.get('role', 'user'))
            login_user(user)
            return redirect('/admin')

        return "Invalid Login ❌"

    return render_template('login.html')

# Logout
@app.route('/logout')
def logout():
    logout_user()
    return redirect('/')

# Admin Panel
@app.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    if current_user.role != "admin":
        return "Access Denied ❌"

    if request.method == 'POST':
        name = request.form['name']
        desc = request.form['desc']

        mongo.db.tools.insert_one({
            "name": name,
            "desc": desc
        })

        return redirect('/admin')

    tools = mongo.db.tools.find()
    return render_template('admin.html', tools=tools)

# Labs Page
@app.route('/labs', methods=['GET', 'POST'])
def labs():
    result = ""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username == "admin" and password == "admin":
            result = "Login Successful"
        else:
            result = "Try SQL Injection 😈"

    return render_template('labs.html', result=result)

# Password Checker
@app.route('/check_password', methods=['POST'])
def check_password():
    pwd = request.form['pwd']

    if len(pwd) < 6:
        strength = "Weak ❌"
    elif any(char.isdigit() for char in pwd):
        strength = "Medium ⚠️"
    else:
        strength = "Strong ✅"

    return render_template('labs.html', strength=strength)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)