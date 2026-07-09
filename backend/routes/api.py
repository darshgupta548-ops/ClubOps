from flask import Blueprint

from routes.club import club

api = Blueprint("api", __name__)

api.register_blueprint(
    club,
    url_prefix="/clubs"
)