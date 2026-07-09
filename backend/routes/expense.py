from flask import Blueprint, request, jsonify

from database import db
from models.expense import Expense
from models.budget import Budget

expense = Blueprint("expense", __name__)


def serialize_expense(e):
    return {
        "id": e.id,
        "budget_id": e.budget_id,
        "item_name": e.item_name,
        "category": e.category,
        "quantity": e.quantity,
        "unit_price": e.unit_price
    }


@expense.route("/", methods=["GET"])
def get_expenses():

    expenses = Expense.query.all()

    return jsonify([
        serialize_expense(e)
        for e in expenses
    ])


@expense.route("/<int:id>", methods=["GET"])
def get_expense(id):

    expense = db.session.get(Expense, id)

    if not expense:
        return jsonify({
            "error": "Expense not found."
        }), 404

    return jsonify(
        serialize_expense(expense)
    )


@expense.route("/", methods=["POST"])
def create_expense():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "budget_id" not in data:
        return jsonify({
            "error": "budget_id is required."
        }), 400

    if not data.get("item_name"):
        return jsonify({
            "error": "item_name is required."
        }), 400

    if "quantity" not in data:
        return jsonify({
            "error": "quantity is required."
        }), 400

    if "unit_price" not in data:
        return jsonify({
            "error": "unit_price is required."
        }), 400

    budget = db.session.get(Budget, data["budget_id"])

    if not budget:
        return jsonify({
            "error": "Budget not found."
        }), 404

    if data["quantity"] < 0:
        return jsonify({
            "error": "quantity cannot be negative."
        }), 400

    if data["unit_price"] < 0:
        return jsonify({
            "error": "unit_price cannot be negative."
        }), 400

    expense = Expense(
        budget_id=data["budget_id"],
        item_name=data["item_name"].strip(),
        category=data.get("category"),
        quantity=data["quantity"],
        unit_price=data["unit_price"]
    )

    db.session.add(expense)
    db.session.commit()

    return jsonify(
        serialize_expense(expense)
    ), 201


@expense.route("/<int:id>", methods=["PUT"])
def update_expense(id):

    expense = db.session.get(Expense, id)

    if not expense:
        return jsonify({
            "error": "Expense not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if "item_name" in data:
        expense.item_name = data["item_name"].strip()

    if "category" in data:
        expense.category = data["category"]

    if "quantity" in data:

        if data["quantity"] < 0:
            return jsonify({
                "error": "quantity cannot be negative."
            }), 400

        expense.quantity = data["quantity"]

    if "unit_price" in data:

        if data["unit_price"] < 0:
            return jsonify({
                "error": "unit_price cannot be negative."
            }), 400

        expense.unit_price = data["unit_price"]

    db.session.commit()

    return jsonify(
        serialize_expense(expense)
    )


@expense.route("/<int:id>", methods=["DELETE"])
def delete_expense(id):

    expense = db.session.get(Expense, id)

    if not expense:
        return jsonify({
            "error": "Expense not found."
        }), 404

    db.session.delete(expense)
    db.session.commit()

    return jsonify({
        "message": "Expense deleted successfully."
    })