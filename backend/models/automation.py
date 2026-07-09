from database import db


class Automation(db.Model):
    __tablename__ = "automations"

    id = db.Column(db.Integer, primary_key=True)

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.id"),
        nullable=False,
        unique=True
    )

    photo_paths = db.Column(db.String(255))

    report_path = db.Column(db.String(255))

    summary = db.Column(db.Text)

    skill_mapping = db.Column(db.JSON)

    sdg_mapping = db.Column(db.JSON)

    event = db.relationship(
        "Event",
        back_populates="automation"
    )