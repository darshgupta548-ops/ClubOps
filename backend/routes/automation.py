from flask import Blueprint, request, jsonify

from database import db
from models.automation import Automation
from models.event import Event

automation = Blueprint("automation", __name__)


def serialize_automation(a):
    return {
        "id": a.id,
        "event_id": a.event_id,
        "photo_paths": a.photo_paths,
        "report_path": a.report_path,
        "summary": a.summary,
        "skill_mapping": a.skill_mapping,
        "sdg_mapping": a.sdg_mapping
    }


@automation.route("/", methods=["GET"])
def get_automations():

    automations = Automation.query.all()

    return jsonify([
        serialize_automation(a)
        for a in automations
    ])


@automation.route("/<int:id>", methods=["GET"])
def get_automation(id):

    a = db.session.get(Automation, id)

    if not a:
        return jsonify({
            "error": "Automation not found."
        }), 404

    return jsonify(
        serialize_automation(a)
    )


@automation.route("/", methods=["POST"])
def create_automation():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "event_id" not in data:
        return jsonify({
            "error": "event_id is required."
        }), 400

    event = db.session.get(Event, data["event_id"])

    if not event:
        return jsonify({
            "error": "Event not found."
        }), 404

    existing_automation = Automation.query.filter_by(
        event_id=data["event_id"]
    ).first()

    if existing_automation:
        return jsonify({
            "error": "Automation already exists for this event."
        }), 409

    automation = Automation(
        event_id=data["event_id"],
        photo_paths=data.get("photo_paths"),
        report_path=data.get("report_path"),
        summary=data.get("summary"),
        skill_mapping=data.get("skill_mapping"),
        sdg_mapping=data.get("sdg_mapping")
    )

    db.session.add(automation)
    db.session.commit()

    return jsonify(
        serialize_automation(automation)
    ), 201


@automation.route("/<int:id>", methods=["PUT"])
def update_automation(id):

    automation = db.session.get(Automation, id)

    if not automation:
        return jsonify({
            "error": "Automation not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "event_id" in data:
        event = db.session.get(Event, data["event_id"])

        if not event:
            return jsonify({
                "error": "Event not found."
            }), 404

        existing_automation = Automation.query.filter_by(
            event_id=data["event_id"]
        ).first()

        if existing_automation and existing_automation.id != id:
            return jsonify({
                "error": "Automation already exists for this event."
            }), 409

        automation.event_id = data["event_id"]

    if "photo_paths" in data:
        automation.photo_paths = data["photo_paths"]

    if "report_path" in data:
        automation.report_path = data["report_path"]

    if "summary" in data:
        automation.summary = data["summary"]

    if "skill_mapping" in data:
        automation.skill_mapping = data["skill_mapping"]

    if "sdg_mapping" in data:
        automation.sdg_mapping = data["sdg_mapping"]

    db.session.commit()

    return jsonify(
        serialize_automation(automation)
    )


@automation.route("/<int:id>", methods=["DELETE"])
def delete_automation(id):

    automation = db.session.get(Automation, id)

    if not automation:
        return jsonify({
            "error": "Automation not found."
        }), 404

    db.session.delete(automation)
    db.session.commit()

    return jsonify({
        "message": "Automation deleted successfully."
    })