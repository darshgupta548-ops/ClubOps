from flask import Blueprint, request, jsonify

from database import db
from models.event import Event
from models.resource import Resource

resource = Blueprint("resource", __name__)


def serialize_resource(r):
    return {
        "id": r.id,
        "event_id": r.event_id,
        "name": r.name,
        "quantity": r.quantity,
        "condition": r.condition
    }


@resource.route("/", methods=["GET"])
def get_resources():

    resources = Resource.query.all()

    return jsonify([
        serialize_resource(r)
        for r in resources
    ])


@resource.route("/<int:id>", methods=["GET"])
def get_resource(id):

    resource = db.session.get(Resource, id)

    if not resource:
        return jsonify({
            "error": "Resource not found."
        }), 404

    return jsonify(
        serialize_resource(resource)
    )


@resource.route("/", methods=["POST"])
def create_resource():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "event_id" not in data:
        return jsonify({
            "error": "event_id is required."
        }), 400

    if not data.get("name"):
        return jsonify({
            "error": "name is required."
        }), 400

    if "quantity" not in data:
        return jsonify({
            "error": "quantity is required."
        }), 400
    
    if data["quantity"] < 0:
        return jsonify({
        "error": "quantity cannot be negative."
        }), 400


    event = db.session.get(Event, data["event_id"])

    if not event:
        return jsonify({
            "error": "Event not found."
        }), 404


    resource = Resource(
        event_id=data["event_id"],
        name=data["name"].strip(),
        quantity=data["quantity"],
        condition=data.get("condition")
    )

    db.session.add(resource)
    db.session.commit()

    return jsonify(
        serialize_resource(resource)
    ), 201


@resource.route("/<int:id>", methods=["PUT"])
def update_resource(id):

    resource = db.session.get(Resource, id)

    if not resource:
        return jsonify({
            "error": "Resource not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "name" in data:
        resource.name = data["name"].strip()

    if "condition" in data:
        resource.condition = data["condition"]

    if "quantity" in data:
        if data["quantity"] < 0:
            return jsonify({
                "error": "quantity cannot be negative."
            }), 400

        resource.quantity = data["quantity"]

    db.session.commit()

    return jsonify(
        serialize_resource(resource)
    )


@resource.route("/<int:id>", methods=["DELETE"])
def delete_resource(id):

    resource = db.session.get(Resource, id)

    if not resource:
        return jsonify({
            "error": "Resource not found."
        }), 404

    db.session.delete(resource)
    db.session.commit()

    return jsonify({
        "message": "Resource deleted successfully."
    })