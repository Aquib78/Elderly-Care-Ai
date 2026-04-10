from database.mongo import db

# USERS
db.users.create_index("email", unique=True)
db.users.create_index("phone", unique=True)

# REPORTS
db.reports.create_index("user_id")
db.reports.create_index("status")
db.reports.create_index([("created_at", -1)])

# MEDICATIONS
db.medications.create_index("user_id")
db.medications.create_index("report_id")
db.medications.create_index("normalized_name")
db.medications.create_index("is_verified")

# REMINDERS
db.reminders.create_index("user_id")
db.reminders.create_index("status")
db.reminders.create_index("duration.end_date")

# ALERTS
db.alerts.create_index("user_id")
db.alerts.create_index("resolved")

# AI OUTPUTS
db.ai_outputs.create_index("report_id")
db.ai_outputs.create_index("type")

print("✅ Indexes created successfully!")