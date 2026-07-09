from flask import Blueprint, request, jsonify

from database import db
from models.member import Member
from models.club import Club

member = Blueprint("member", __name__)


def serialize_member(m):
    return {
        "id": m.id,
        "club_id": m.club_id,
        "name": m.name,
        "institute_email": m.institute_email,
        "position": m.position
    }


@member.route("/", methods=["GET"])
def get_members():
    members = Member.query.all()
    return jsonify([serialize_member(m) for m in members])


@member.route("/<int:id>", methods=["GET"])
def get_member(id):
    m = db.session.get(Member, id)

    if not m:
        return jsonify({"error": "Member not found."}), 404

    return jsonify(serialize_member(m))


@member.route("/", methods=["POST"])
def create_member():
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Member name is required."}), 400

    if not data.get("club_id"):
        return jsonify({"error": "club_id is required."}), 400

    if not data.get("institute_email"):
        return jsonify({"error": "Institute email is required."}), 400

    if not data.get("password_hash"):
        return jsonify({"error": "password_hash is required."}), 400

    if not data.get("position"):
        return jsonify({"error": "Position is required."}), 400

    club = db.session.get(Club, data["club_id"])
    if not club:
        return jsonify({"error": "Club not found."}), 404

    existing_member = Member.query.filter_by(
        institute_email=data["institute_email"].strip()
    ).first()

    if existing_member:
        return jsonify({"error": "Member already exists."}), 409

    m = Member(
        club_id=data["club_id"],
        name=data["name"].strip(),
        institute_email=data["institute_email"].strip(),
        password_hash=data["password_hash"],
        position=data["position"].strip()
    )

    db.session.add(m)
    db.session.commit()

    return jsonify(serialize_member(m)), 201


@member.route("/<int:id>", methods=["PUT"])
def update_member(id):
    m = db.session.get(Member, id)

    if not m:
        return jsonify({"error": "Member not found."}), 404

    data = request.get_json()

    if data.get("club_id"):
        club = db.session.get(Club, data["club_id"])
        if not club:
            return jsonify({"error": "Club not found."}), 404
        m.club_id = data["club_id"]

    if data.get("name") is not None:
        m.name = data["name"].strip()

    if data.get("institute_email") is not None:
        new_email = data["institute_email"].strip()
        existing_member = Member.query.filter(
            Member.institute_email == new_email,
            Member.id != id
        ).first()
        if existing_member:
            return jsonify({"error": "Member already exists."}), 409
        m.institute_email = new_email

    if data.get("password_hash") is not None:
        m.password_hash = data["password_hash"]

    if data.get("position") is not None:
        m.position = data["position"].strip()

    db.session.commit()

    return jsonify(serialize_member(m))


@member.route("/<int:id>", methods=["DELETE"])
def delete_member(id):
    m = db.session.get(Member, id)

    if not m:
        return jsonify({"error": "Member not found."}), 404

    db.session.delete(m)
    db.session.commit()

    return jsonify({"message": "Member deleted successfully."})