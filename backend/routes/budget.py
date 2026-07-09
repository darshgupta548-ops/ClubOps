from flask import Blueprint, request, jsonify

from database import db
from models.budget import Budget
from models.event import Event

budget = Blueprint("budget", __name__)


def serialize_budget(b):
    return {
        "id": b.id,
        "event_id": b.event_id,
        "allocated_budget": b.allocated_budget,
        "estimated_budget": b.estimated_budget,
        "buffer_percentage": b.buffer_percentage
    }


@budget.route("/", methods=["GET"])
def get_budgets():

    budgets = Budget.query.all()

    return jsonify([
        serialize_budget(b)
        for b in budgets
    ])


@budget.route("/<int:id>", methods=["GET"])
def get_budget(id):

    budget = db.session.get(Budget, id)

    if not budget:
        return jsonify({
            "error": "Budget not found."
        }), 404

    return jsonify(
        serialize_budget(budget)
    )


@budget.route("/", methods=["POST"])
def create_budget():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "event_id" not in data:
        return jsonify({
            "error": "event_id is required."
        }), 400

    if "allocated_budget" not in data:
        return jsonify({
            "error": "allocated_budget is required."
        }), 400

    if "estimated_budget" not in data:
        return jsonify({
            "error": "estimated_budget is required."
        }), 400

    event = db.session.get(Event, data["event_id"])

    if not event:
        return jsonify({
            "error": "Event not found."
        }), 404

    existing_budget = Budget.query.filter_by(
        event_id=data["event_id"]
    ).first()

    if existing_budget:
        return jsonify({
            "error": "Budget already exists for this event."
        }), 409

    if data["allocated_budget"] < 0:
        return jsonify({
            "error": "allocated_budget cannot be negative."
        }), 400

    if data["estimated_budget"] < 0:
        return jsonify({
            "error": "estimated_budget cannot be negative."
        }), 400

    buffer = data.get("buffer_percentage", 0)

    if buffer < 0:
        return jsonify({
            "error": "buffer_percentage cannot be negative."
        }), 400

    budget = Budget(
        event_id=data["event_id"],
        allocated_budget=data["allocated_budget"],
        estimated_budget=data["estimated_budget"],
        buffer_percentage=buffer
    )

    db.session.add(budget)
    db.session.commit()

    return jsonify(
        serialize_budget(budget)
    ), 201


@budget.route("/<int:id>", methods=["PUT"])
def update_budget(id):

    budget = db.session.get(Budget, id)

    if not budget:
        return jsonify({
            "error": "Budget not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "allocated_budget" in data:

        if data["allocated_budget"] < 0:
            return jsonify({
                "error": "allocated_budget cannot be negative."
            }), 400

        budget.allocated_budget = data["allocated_budget"]

    if "estimated_budget" in data:

        if data["estimated_budget"] < 0:
            return jsonify({
                "error": "estimated_budget cannot be negative."
            }), 400

        budget.estimated_budget = data["estimated_budget"]

    if "buffer_percentage" in data:

        if data["buffer_percentage"] < 0:
            return jsonify({
                "error": "buffer_percentage cannot be negative."
            }), 400

        budget.buffer_percentage = data["buffer_percentage"]

    db.session.commit()

    return jsonify(
        serialize_budget(budget)
    )


@budget.route("/<int:id>", methods=["DELETE"])
def delete_budget(id):

    budget = db.session.get(Budget, id)

    if not budget:
        return jsonify({
            "error": "Budget not found."
        }), 404

    db.session.delete(budget)
    db.session.commit()

    return jsonify({
        "message": "Budget deleted successfully."
    })