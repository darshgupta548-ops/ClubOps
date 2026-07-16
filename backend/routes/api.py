from flask import Blueprint

from routes.club import club
from routes.member import member
from routes.event import event
from routes.budget import budget
from routes.expense import expense
from routes.attachment import attachment
from routes.resource import resource
from routes.automation import automation

api = Blueprint("api", __name__)

api.register_blueprint(club, url_prefix="/clubs")
api.register_blueprint(member, url_prefix="/members")
api.register_blueprint(event, url_prefix="/events")
api.register_blueprint(budget, url_prefix="/budgets")
api.register_blueprint(expense, url_prefix="/expenses")
api.register_blueprint(attachment)
api.register_blueprint(resource, url_prefix="/resources")
api.register_blueprint(automation, url_prefix="/automations")
