import sys
import json
import pandas as pd
import joblib
import os

# -----------------------------
# Load ML model
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml_model", "model.pkl")

bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
scaler = bundle["scaler"]
features = bundle["features"]

# -----------------------------
# Read transaction JSON
# -----------------------------
raw_input = sys.argv[1]
data = json.loads(raw_input)
tx = data.get("transaction", data)
profile = data.get("behaviorProfile", {})

# -----------------------------
# Feature calculation (baseline aware)
# -----------------------------
amount_mean = profile.get("avgAmount", 100)
amount_std = profile.get("stdAmount", 50)
night_ratio = profile.get("nightRatio", 0.1)
new_recipient_ratio = profile.get("newRecipientRatio", 0.2)
home_country = profile.get("homeCountry", "US")

# z-score for amount anomaly
z_score = (tx["amount"] - amount_mean) / max(amount_std, 1)
near_threshold = 1 if z_score >= 2 else 0  # anomaly if >2 std devs

row = {
    "amount": tx["amount"],
    "near_threshold": near_threshold,
    "night_tx": tx.get("nightTx", 0),
    "new_recipient": 0 if tx.get("recipientKnown") else 1,
    "geo_mismatch": 1 if tx['geoLocation']['country'] != home_country else 0,
    "account_type_manager": 1 if tx.get("accountType")=="MANAGER" else 0,
    "account_type_finance": 1 if tx.get("accountType")=="FINANCE" else 0,
    "account_type_student": 1 if tx.get("accountType")=="STUDENT" else 0,
    "account_type_retired": 1 if tx.get("accountType")=="RETIRED" else 0
}

X = pd.DataFrame([row])[features]
X_scaled = scaler.transform(X)

# -----------------------------
# ML prediction
# -----------------------------
prediction = model.predict(X_scaled)[0]      # 1 if anomaly
proba = model.predict_proba(X_scaled)[0][1] # probability of anomaly

# -----------------------------
# Feature-based pattern detection
# -----------------------------
patterns = []

if row["near_threshold"]:
    patterns.append("amount_spike")
if row["geo_mismatch"]:
    patterns.append("geo_mismatch")
if row["night_tx"] and row["night_tx"] > night_ratio * 2:
    patterns.append("night_tx")
if row["new_recipient"] and row["new_recipient"] > new_recipient_ratio * 2:
    patterns.append("new_recipient")

# Determine AI Pattern ID (first detected)
ai_pattern_id = patterns[0] if patterns else None

# SOP alerts triggered if any pattern exists
sop_alerts = []
if patterns:
    sop_alerts = [
        "Confirm transaction legitimacy",
        "Verify recipient details",
        "Ensure no external influence"
    ]

# -----------------------------
# Final anomaly decision
# -----------------------------
# Hybrid: ML OR feature-based
is_anomaly = 1 if prediction == 1 or len(patterns) > 0 else 0

# -----------------------------
# Build output
# -----------------------------
output = {
    "predicted_anomaly": is_anomaly,
    "anomaly_score": round(proba, 2),
    "aiPatternId": ai_pattern_id,
    "sopAlert": sop_alerts,
    "explanation": row,
    "detectedPatterns": patterns
}

# -----------------------------
# Print ONLY JSON
# -----------------------------
print(json.dumps(output))
