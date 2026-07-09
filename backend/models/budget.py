from database import db


class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.id"),
        nullable=False,
        unique=True
    )

    allocated_budget = db.Column(
        db.Float,
        nullable=False
    )

    estimated_budget = db.Column(
        db.Float,
        nullable=False
    )

    buffer_percentage = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    event = db.relationship(
        "Event",
        back_populates="budget"
    )


    expenses = db.relationship(
    "Expense",
    back_populates="budget",
    cascade="all, delete-orphan"
    )