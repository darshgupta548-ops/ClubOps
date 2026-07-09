from datetime import datetime, date, time

from flask import Blueprint, jsonify, request

from database import db
from models.event import Event
from models.member import Member

event = Blueprint("event", __name__)


def serialize_event(e):
    return {
        "id": e.id,
        "creator_id": e.creator_id,
        "title": e.title,
        "description": e.description,
        "objective": e.objective,
        "category": e.category,
        "is_completed": e.is_completed,
        "venue": e.venue,
        "date": e.date.isoformat() if e.date else None,
        "start_time": e.start_time.isoformat() if e.start_time else None,
        "end_time": e.end_time.isoformat() if e.end_time else None,
        "attendees": e.attendees,
        "created_at": e.created_at.isoformat() if e.created_at else None,
        "updated_at": e.updated_at.isoformat() if e.updated_at else None,
    }


def parse_date(value):
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def parse_time(value):
    if not value:
        return None
    try:
        return time.fromisoformat(value)
    except ValueError:
        try:
            return datetime.strptime(value, "%H:%M").time()
        except ValueError:
            return None


@event.route("/", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([serialize_event(e) for e in events])


@event.route("/<int:id>", methods=["GET"])
def get_event(id):
    e = db.session.get(Event, id)

    if not e:
        return jsonify({"error": "Event not found."}), 404

    return jsonify(serialize_event(e))


@event.route("/", methods=["POST"])
def create_event():
    data = request.get_json()

    if not data:
        return jsonify({"error": "JSON body is required."}), 400

    if not data.get("creator_id"):
        return jsonify({"error": "creator_id is required."}), 400

    if not data.get("title"):
        return jsonify({"error": "Event title is required."}), 400

    creator = db.session.get(Member, data["creator_id"])
    if not creator:
        return jsonify({"error": "Creator member not found."}), 404

    event_date = parse_date(data.get("date"))
    if data.get("date") and event_date is None:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    start_time = parse_time(data.get("start_time"))
    if data.get("start_time") and start_time is None:
        return jsonify({"error": "Invalid start_time format. Use HH:MM or HH:MM:SS."}), 400

    end_time = parse_time(data.get("end_time"))
    if data.get("end_time") and end_time is None:
        return jsonify({"error": "Invalid end_time format. Use HH:MM or HH:MM:SS."}), 400

    e = Event(
        creator_id=data["creator_id"],
        title=data["title"].strip(),
        description=data.get("description"),
        objective=data.get("objective"),
        category=data.get("category"),
        is_completed=bool(data.get("is_completed", False)),
        venue=data.get("venue"),
        date=event_date,
        start_time=start_time,
        end_time=end_time,
        attendees=data.get("attendees", 0)
    )

    db.session.add(e)
    db.session.commit()

    return jsonify(serialize_event(e)), 201


@event.route("/<int:id>", methods=["PUT"])
def update_event(id):
    e = db.session.get(Event, id)

    if not e:
        return jsonify({"error": "Event not found."}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "JSON body is required."}), 400

    if data.get("creator_id"):
        creator = db.session.get(Member, data["creator_id"])
        if not creator:
            return jsonify({"error": "Creator member not found."}), 404
        e.creator_id = data["creator_id"]

    if data.get("title") is not None:
        e.title = data["title"].strip()

    if data.get("description") is not None:
        e.description = data["description"]

    if data.get("objective") is not None:
        e.objective = data["objective"]

    if data.get("category") is not None:
        e.category = data["category"]

    if "is_completed" in data:
        e.is_completed = bool(data["is_completed"])

    if data.get("venue") is not None:
        e.venue = data["venue"]

    if "date" in data:
        if data["date"] is None:
            e.date = None
        else:
            parsed_date = parse_date(data["date"])
            if parsed_date is None:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
            e.date = parsed_date

    if "start_time" in data:
        if data["start_time"] is None:
            e.start_time = None
        else:
            parsed_start = parse_time(data["start_time"])
            if parsed_start is None:
                return jsonify({"error": "Invalid start_time format. Use HH:MM or HH:MM:SS."}), 400
            e.start_time = parsed_start

    if "end_time" in data:
        if data["end_time"] is None:
            e.end_time = None
        else:
            parsed_end = parse_time(data["end_time"])
            if parsed_end is None:
                return jsonify({"error": "Invalid end_time format. Use HH:MM or HH:MM:SS."}), 400
            e.end_time = parsed_end

    if "attendees" in data:
        e.attendees = data["attendees"]

    db.session.commit()

    return jsonify(serialize_event(e))


@event.route("/<int:id>", methods=["DELETE"])
def delete_event(id):
    e = db.session.get(Event, id)

    if not e:
        return jsonify({"error": "Event not found."}), 404

    db.session.delete(e)
    db.session.commit()

    return jsonify({"message": "Event deleted successfully."})