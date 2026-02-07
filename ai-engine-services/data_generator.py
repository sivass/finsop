import os
import json
import random
from datetime import datetime, timedelta
from faker import Faker

# -----------------------------
# Setup
# -----------------------------
fake = Faker()
Faker.seed(42)
random.seed(42)

NUM_USERS = 100
TX_PER_USER = 200

# Ensure dataset folder exists
os.makedirs("dataset", exist_ok=True)

# -----------------------------
# Anomaly Patterns
# -----------------------------
ANOMALY_PATTERNS = ["amount_spike", "geo_mismatch", "velocity_burst"]

def inject_anomaly(tx, user):
    """Inject anomaly into a transaction"""
    pattern = random.choice(ANOMALY_PATTERNS)
    if pattern == "amount_spike":
        tx['amount'] *= random.uniform(5, 10)
        tx['remarks'] = "Amount spike detected"
    elif pattern == "geo_mismatch":
        tx['geoLocation']['country'] = random.choice(["RU","CN","BR","NG"])
        tx['remarks'] = "Geo mismatch detected"
    elif pattern == "velocity_burst":
        tx['amount'] *= random.uniform(2, 4)
        tx['remarks'] = "High frequency transaction"
    return tx

# -----------------------------
# User & Transaction Generators
# -----------------------------
def generate_user(user_id):
    account_types = ["MANAGER", "FINANCE", "RETIRED", "STUDENT"]
    role_map = {
        "MANAGER": "Senior Manager",
        "FINANCE": "Finance Officer",
        "RETIRED": "Retired Consultant",
        "STUDENT": "Intern"
    }

    account_type = random.choice(account_types)
    return {
        "userId": user_id,
        "name": fake.name(),
        "role": role_map[account_type],
        "department": fake.job(),
        "accountType": account_type,
        "email": f"{user_id.lower()}@example.com",
        "homeCountry": random.choice(["US", "SG", "MY", "AE", "IN"]),
        "status": "ACTIVE",
        "createdAt": fake.date_time_between(start_date="-5y", end_date="-1y").isoformat()
    }

def generate_transaction(user, tx_id, start_date):
    """Generate a transaction dict for a user"""
    amount_base = {
        "MANAGER": 2000,
        "FINANCE": 1500,
        "RETIRED": 200,
        "STUDENT": 100
    }
    std_dev = amount_base[user['accountType']] * 0.3

    # Base amount
    amount = round(random.gauss(amount_base[user['accountType']], std_dev), 2)
    if amount < 10:
        amount = 10

    # Recipient known 80% of time
    recipient_known = random.random() < 0.8
    recipient = fake.company() if not recipient_known else f"Vendor-Local-{random.randint(1,20)}"

    # Geo deviation
    geo_country = user['homeCountry'] if random.random() < 0.85 else random.choice(["US","SG","MY","AE","RU","IN"])
    geo_location = {
        "country": geo_country,
        "region": fake.state(),
        "city": fake.city()
    }

    # Night transaction
    tx_hour = random.randint(0,23)
    night_tx = 1 if tx_hour < 6 or tx_hour > 22 else 0
    tx_time = start_date + timedelta(days=random.randint(0, 365), hours=tx_hour, minutes=random.randint(0,59))

    remarks = ""
    if not recipient_known or geo_country != user['homeCountry']:
        remarks = "Foreign IP detected"

    tx = {
        "transactionId": tx_id,
        "userId": user['userId'],
        "amount": round(amount,2),
        "currency": "USD",
        "category": random.choice(["VendorPayment","Salary","Reimbursement","General"]),
        "recipient": recipient,
        "recipientKnown": recipient_known,
        "ipAddress": fake.ipv4(),
        "email": user['email'],
        "geoLocation": geo_location,
        "timestamp": tx_time.isoformat(),
        "status": random.choice(["COMPLETED","PENDING"]),
        "remarks": remarks,
        "nightTx": night_tx
    }

    # Inject anomaly 5% chance
    if random.random() < 0.05:
        tx = inject_anomaly(tx, user)

    return tx

# -----------------------------
# Baseline Calculation
# -----------------------------
def calculate_baseline(transactions):
    amounts = [tx['amount'] for tx in transactions]
    tx_per_day = len(transactions)/365
    night_ratio = sum([tx['nightTx'] for tx in transactions])/len(transactions)
    new_recipient_ratio = sum([not tx['recipientKnown'] for tx in transactions])/len(transactions)
    geo_entropy = sum([1 if tx['geoLocation']['country'] not in ["US","SG","MY"] else 0 for tx in transactions])/len(transactions)

    return {
        "avgAmount": round(sum(amounts)/len(amounts),2),
        "stdAmount": round((sum((x - sum(amounts)/len(amounts))**2 for x in amounts)/len(amounts))**0.5,2),
        "txPerDay": round(tx_per_day,2),
        "nightRatio": round(night_ratio,2),
        "newRecipientRatio": round(new_recipient_ratio,2),
        "geoEntropy": round(geo_entropy,2)
    }

# -----------------------------
# Generate Dataset
# -----------------------------
users = []
transactions = []
user_baselines = []

start_date = datetime(2025,1,1)

for i in range(1, NUM_USERS+1):
    user_id = f"USR-{i:03d}"
    user = generate_user(user_id)
    users.append(user)

    user_tx = []
    for j in range(1, TX_PER_USER+1):
        tx_id = f"TX-{i:03d}-{j:04d}"
        tx = generate_transaction(user, tx_id, start_date)
        transactions.append(tx)
        user_tx.append(tx)

    baseline = {
        "userId": user_id,
        "accountType": user['accountType'],
        "baseline": calculate_baseline(user_tx),
        "lastUpdated": datetime.utcnow().isoformat()
    }
    user_baselines.append(baseline)

# -----------------------------
# Save JSON files
# -----------------------------
with open("dataset/users.json","w") as f:
    json.dump(users, f, indent=2)

with open("dataset/transactions.json","w") as f:
    json.dump(transactions, f, indent=2)

with open("dataset/user_baselines.json","w") as f:
    json.dump(user_baselines, f, indent=2)

print("dataset generated: users.json, transactions.json, user_baselines.json")

