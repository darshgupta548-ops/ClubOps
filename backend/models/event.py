from database import db
from datetime import datetime


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)

    creator_id = db.Column(
        db.Integer,
        db.ForeignKey("members.id"),
        nullable=False
    )

    title = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text)

    objective = db.Column(db.Text)

    category = db.Column(db.String(50))

    is_completed = db.Column(
        db.Boolean,
        default=False
    )

    venue = db.Column(db.String(100))

    date = db.Column(db.Date)

    start_time = db.Column(db.Time)

    end_time = db.Column(db.Time)

    attendees = db.Column(
        db.Integer,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    creator = db.relationship(
        "Member",
        back_populates="events"
    )

    budget = db.relationship(
    "Budget",
    back_populates="event",
    uselist=False,
    cascade="all, delete-orphan"
    )

    resources = db.relationship(
    "Resource",
    back_populates="event",
    cascade="all, delete-orphan"
    )

    automation = db.relationship(
    "Automation",
    back_populates="event",
    uselist=False,
    cascade="all, delete-orphan"
    )