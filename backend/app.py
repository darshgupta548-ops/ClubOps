from flask import Flask
from flask_cors import CORS
from routes.api import api
from database import db
from models.club import Club
from models.member import Member
from models.event import Event
from models.budget import Budget
from models.expense import Expense
from models.attachment import Attachment
from models.resource import Resource
from models.automation import Automation

app = Flask(__name__)

app.config.from_object("config")

CORS(app)

app.register_blueprint(api, url_prefix="/api")

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return {
        "message": "Welcome to ClubOps!"
    }


if __name__ == "__main__":
    app.run(debug=True)
