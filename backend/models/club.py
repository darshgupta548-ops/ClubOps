from database import db


class Club(db.Model):
    __tablename__ = "clubs"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text)

    logo = db.Column(db.String(255))

    faculty_advisor = db.Column(db.String(100))

    members = db.relationship(
    "Member",
    back_populates="club",
    cascade="all, delete-orphan"
    )