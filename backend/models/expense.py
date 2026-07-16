from database import db


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)

    budget_id = db.Column(
        db.Integer,
        db.ForeignKey("budgets.id"),
        nullable=False
    )

    item_name = db.Column(
        db.String(100),
        nullable=False
    )

    category = db.Column(
        db.String(50)
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    unit_price = db.Column(
        db.Float,
        nullable=False
    )

    budget = db.relationship(
        "Budget",
        back_populates="expenses"
    )

    attachments = db.relationship(
        "Attachment",
        back_populates="expense",
        cascade="all, delete-orphan"
    )
