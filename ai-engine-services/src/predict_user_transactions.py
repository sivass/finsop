import sys
import json
import pandas as pd
import joblib
import os

# -----------------------------
# Check command line argument
# -----------------------------
if len(sys.argv) < 2:
    print(json.dumps({"error": "Missing input file"}))
    sys.exit(1)

input_file = sys.argv[1]

if not os.path.exists(input_file):
    print(json.dumps({"error": f"File not found: {input_file}"}))
    sys.exit(1)

# -----------------------------
# Load transactions JSON
# -----------------------------
with open(input_file, "r") as f:
    data = json.load(f)

# If it's a dict with "transactions" key, use it; else assume list
if isinstance(data, dict):
    transactions = data.get("transactions", [])
else:
    transactions = data

# -----------------------------
# Load user baselines
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_BASELINE_PATH = os.path.join(BASE_DIR, "..", "dataset", "user_baselines.json")
with open(USER_BASELINE_PATH, "r") as f:
    user_baselines = json.load(f)
baseline_map = {u["userId"]: u["baseline"] for u in user_baselines}

# -----------------------------
# Load ML model
# -----------------------------
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml_model", "model.pkl")
bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
scaler = bundle["scaler"]
features = bundle["features"]

# -----------------------------
# Batch prediction
# -----------------------------
results = []

for tx in transactions:
    user_profile = baseline_map.get(tx["userId"], {})
    amount_mean = user_profile.get("avgAmount", 100)
    amount_std = user_profile.get("stdAmount", 50)
    night_ratio = user_profile.get("nightRatio", 0.1)
    new_recipient_ratio = user_profile.get("newRecipientRatio", 0.2)
    home_country = user_profile.get("homeCountry", "US")

    # -----------------------------
    # Feature calculation
    # -----------------------------
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
    # Pattern detection
    # -----------------------------
    patterns = []
    if row["near_threshold"]: patterns.append("amount_spike")
    if row["geo_mismatch"]: patterns.append("geo_mismatch")
    if row["night_tx"] and row["night_tx"] > night_ratio * 2: patterns.append("night_tx")
    if row["new_recipient"] and row["new_recipient"] > new_recipient_ratio * 2: patterns.append("new_recipient")

    ai_pattern_id = patterns[0] if patterns else None
    sop_alerts = [
        "Confirm transaction legitimacy",
        "Verify recipient details",
        "Ensure no external influence"
    ] if patterns else []

    # -----------------------------
    # Hybrid anomaly decision
    # -----------------------------
    is_anomaly = 1 if prediction == 1 or len(patterns) > 0 else 0

    # -----------------------------
    # Append result
    # -----------------------------
    results.append({
        "transactionId": tx.get("transactionId") or tx.get("id"),
        "userId": tx["userId"],
        "predicted_anomaly": is_anomaly,
        "anomaly_score": round(proba, 2),
        "aiPatternId": ai_pattern_id,
        "sopAlert": sop_alerts,
        "explanation": row,
        "detectedPatterns": patterns
    })

# -----------------------------
# Print all results as JSON
# -----------------------------
print(json.dumps(results, indent=2))

