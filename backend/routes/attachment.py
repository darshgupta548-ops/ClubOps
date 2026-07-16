from flask import Blueprint, jsonify, request

from database import db
from models.attachment import Attachment
from models.expense import Expense

attachment = Blueprint("attachment", __name__)


def serialize_attachment(a):
    return {
        "id": a.id,
        "expense_id": a.expense_id,
        "file_name": a.file_name,
        "file_path": a.file_path,
        "uploaded_at": a.uploaded_at.isoformat() if a.uploaded_at else None
    }


@attachment.route("/expenses/<int:expense_id>/attachments", methods=["GET"])
def get_expense_attachments(expense_id):
    expense = db.session.get(Expense, expense_id)

    if not expense:
        return jsonify({
            "error": "Expense not found."
        }), 404

    return jsonify([
        serialize_attachment(a)
        for a in expense.attachments
    ])


@attachment.route("/expenses/<int:expense_id>/attachments", methods=["POST"])
def create_attachment(expense_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "JSON body is required."
        }), 400

    if not data.get("file_name"):
        return jsonify({
            "error": "file_name is required."
        }), 400

    if not data.get("file_path"):
        return jsonify({
            "error": "file_path is required."
        }), 400

    expense = db.session.get(Expense, expense_id)

    if not expense:
        return jsonify({
            "error": "Expense not found."
        }), 404

    attachment = Attachment(
        expense_id=expense_id,
        file_name=data["file_name"].strip(),
        file_path=data["file_path"].strip()
    )

    db.session.add(attachment)
    db.session.commit()

    return jsonify(
        serialize_attachment(attachment)
    ), 201


@attachment.route("/attachments/<int:attachment_id>", methods=["DELETE"])
def delete_attachment(attachment_id):
    attachment = db.session.get(Attachment, attachment_id)

    if not attachment:
        return jsonify({
            "error": "Attachment not found."
        }), 404

    db.session.delete(attachment)
    db.session.commit()

    return jsonify({
        "message": "Attachment deleted successfully."
    })
