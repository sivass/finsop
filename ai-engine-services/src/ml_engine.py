import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

# -----------------------------
# Load synthetic datasets
# -----------------------------
with open("dataset/users.json") as f:
    users = json.load(f)

with open("dataset/transactions.json") as f:
    transactions = json.load(f)

with open("dataset/user_baselines.json") as f:
    baselines = json.load(f)

df_tx = pd.DataFrame(transactions)
df_baseline = pd.DataFrame(baselines)

# Merge baseline into transactions
df = df_tx.merge(df_baseline[['userId','baseline','accountType']], on='userId', how='left')

# -----------------------------
# Feature extraction
# -----------------------------
def extract_features(row):
    baseline = row['baseline']
    tx_amount = row['amount']

    near_threshold = 1 if tx_amount >= baseline['avgAmount'] * 1.5 else 0
    night_tx = row.get('nightTx', 0)
    new_recipient = 0 if row.get('recipientKnown') else 1
    geo_mismatch = 1 if row['geoLocation']['country'] != users[int(row['userId'].split("-")[1])-1]['homeCountry'] else 0

    return pd.Series({
        "amount": tx_amount,
        "near_threshold": near_threshold,
        "night_tx": night_tx,
        "new_recipient": new_recipient,
        "geo_mismatch": geo_mismatch,
        "account_type_manager": 1 if row['accountType']=="MANAGER" else 0,
        "account_type_finance": 1 if row['accountType']=="FINANCE" else 0,
        "account_type_student": 1 if row['accountType']=="STUDENT" else 0,
        "account_type_retired": 1 if row['accountType']=="RETIRED" else 0
    })

df_features = df.apply(extract_features, axis=1)

# Label anomalies based on synthetic remarks
df_features['anomaly_label'] = df['remarks'].apply(lambda x: 1 if "detected" in x else 0)

# -----------------------------
# Train/Test Split
# -----------------------------
X = df_features.drop('anomaly_label', axis=1)
y = df_features['anomaly_label']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# -----------------------------
# Train RandomForest Classifier
# -----------------------------
clf = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42)
clf.fit(X_train, y_train)

# -----------------------------
# Save model
# -----------------------------
os.makedirs("ml_model", exist_ok=True)
joblib.dump({
    "model": clf,
    "scaler": scaler,
    "features": X.columns.tolist()
}, "ml_model/model.pkl")

# -----------------------------
# Evaluate
# -----------------------------
train_acc = clf.score(X_train, y_train)
test_acc = clf.score(X_test, y_test)
print(f"Train Accuracy: {train_acc:.2f}")
print(f"Test Accuracy: {test_acc:.2f}")


