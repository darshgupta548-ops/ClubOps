from database import db


class Member(db.Model):
    __tablename__ = "members"

    id = db.Column(db.Integer, primary_key=True)

    club_id = db.Column(
        db.Integer,
        db.ForeignKey("clubs.id"),
        nullable=False
    )

    name = db.Column(db.String(100), nullable=False)

    institute_email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    position = db.Column(db.String(50))

    club = db.relationship(
        "Club",
        back_populates="members"
    )


    events = db.relationship(
    "Event",
    back_populates="creator",
    cascade="all, delete-orphan"
    )