from flask import Blueprint, request, jsonify

from database import db
from models.club import Club

club = Blueprint("club", __name__)


@club.route("/", methods=["GET"])
def get_clubs():

    clubs = Club.query.all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "faculty_advisor": c.faculty_advisor
        }
        for c in clubs
    
    ])

@club.route("/<int:id>", methods=["GET"])
def get_club(id):

    c = Club.query.get(id)

    if not c:
        return jsonify({
            "message": "Club not found!"
        }), 404

    return jsonify({
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "logo": c.logo,
        "faculty_advisor": c.faculty_advisor
    })

@club.route("/<int:id>", methods=["PUT"])
def update_club(id):

    club = Club.query.get(id)

    if not club:
        return jsonify({
            "message": "Club not found!"
        }), 404

    data = request.get_json()

    club.name = data.get("name", club.name)
    club.description = data.get("description", club.description)
    club.logo = data.get("logo", club.logo)
    club.faculty_advisor = data.get("faculty_advisor", club.faculty_advisor)

    db.session.commit()

    return jsonify({
        "message": "Club updated successfully!"
    })

@club.route("/", methods=["POST"])
def create_club():

    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({
        "error": "Club name is required."
        }), 400

    existing = Club.query.filter_by(name=data["name"].strip()).first()

    if existing:
        return jsonify({
            "error": "Club already exists."
        }), 409

    club = Club(
        name=data["name"].strip(),
        description=data.get("description"),
        logo=data.get("logo"),
        faculty_advisor=data.get("faculty_advisor")
    )

    db.session.add(club)
    db.session.commit()

    return jsonify({
        "message": "Club created successfully!"
    }), 201

@club.route("/<int:id>", methods=["DELETE"])
def delete_club(id):

    club = Club.query.get(id)

    if not club:
        return jsonify({
            "message": "Club not found!"
        }), 404

    db.session.delete(club)
    db.session.commit()

    return jsonify({
        "message": "Club deleted successfully!"
    })