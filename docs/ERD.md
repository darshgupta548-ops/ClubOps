# ClubOps ERD (Version 1)

---

# Entity Relationship Diagram

## Club

| Field | Type |
|-------|------|
| id | PK |
| name | TEXT |
| description | TEXT |
| logo | TEXT |
| faculty_advisor | TEXT |

### Relationship
- One Club → Many Members
- One Club → Many Events (organized through members)

---

## Member

| Field | Type |
|-------|------|
| id | PK |
| name | TEXT |
| institute_email | TEXT |
| password_hash | TEXT |
| position | TEXT |

### Relationship
- Belongs to one Club
- Creates many Events

---

## Event

| Field | Type |
|-------|------|
| id | PK |
| creator_id | FK |
| title | TEXT |
| description | TEXT |
| objective | TEXT |
| category | TEXT |
| is_completed | BOOLEAN |
| venue | TEXT |
| date | DATE |
| start_time | TIME |
| end_time | TIME |
| attendees | INTEGER |
| created_at | DATETIME |
| updated_at | DATETIME |

### Relationship
- Created by one Member
- Has one Budget
- Has one Automation
- Uses many Resources

---

## Budget

| Field | Type |
|-------|------|
| id | PK |
| event_id | FK |
| allocated_budget | REAL |
| estimated_budget | REAL |
| buffer_percentage | REAL |

### Relationship
- Belongs to one Event
- Contains many Expenses

---

## Expense

| Field | Type |
|-------|------|
| id | PK |
| budget_id | FK |
| item_name | TEXT |
| category | TEXT |
| unit_price | REAL |
| quantity | INTEGER |

### Notes

Derived values are **not stored**.

```
total_cost = quantity × unit_price
```

```
actual_expense = SUM(all expenses)
```

```
remaining_budget = allocated_budget - actual_expense
```

---

## Resource

| Field | Type |
|-------|------|
| id | PK |
| event_id | FK |
| name | TEXT |
| quantity | INTEGER |
| condition | TEXT |

### Relationship
- Used by one Event

---

## Automation

| Field | Type |
|-------|------|
| id | PK |
| event_id | FK |
| photo_path s| TEXT (Optional) |
| report_path | TEXT (Optional) |
| summary | TEXT |
| skill_mapping | JSON |
| sdg_mapping | JSON |

### Notes

Automation stores **paths**, not files.

Example

```
uploads/events/42/photos/
```

```
reports/event_42.pdf
```

---

# Relationship Summary

```
Club
 └── Member (1 : N)

Member
 └── Event (1 : N)

Event
 ├── Budget (1 : 1)
│     └── Expense (1 : N)
│
├── Resource (1 : N)
│
└── Automation (1 : 1)
```

---

# Design Decisions

- Passwords are stored only as hashed values.
- Images are stored locally; only their paths are saved in the database.
- Reports are stored as file paths.
- Skill Mapping and SDG Mapping are stored as JSON.
- Computed values (Total Cost, Actual Expense, Remaining Budget) are derived at runtime and are **not** stored in the database.
- Database is normalized to minimize redundancy and keep the MVP simple.