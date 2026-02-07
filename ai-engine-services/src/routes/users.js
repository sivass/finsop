const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();


// Correct dataset paths
const USERS_PATH = path.join(__dirname, "..", "..", "dataset", "users.json");
const TX_PATH = path.join(__dirname, "..", "..", "dataset", "transactions.json");



let users = [];
let transactions = [];

try {
  users = JSON.parse(fs.readFileSync(USERS_PATH));
  transactions = JSON.parse(fs.readFileSync(TX_PATH));
} catch (err) {
  console.error("Error loading dataset:", err);
}

// -----------------------------
// GET all users
// -----------------------------
router.get("/", (req, res) => {
  const userList = users.map((u) => ({
    userId: u.userId,
    name: u.name,
    role: u.role,
    accountType: u.accountType,
    email: u.email,
    homeCountry: u.homeCountry,
    status: u.status,
    createdAt: u.createdAt,
  }));
  res.json(userList);
});

// -----------------------------
// GET user by ID + transactions + risk
// -----------------------------
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find((u) => u.userId === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Filter user's transactions
  const userTx = transactions.filter((tx) => tx.userId === userId);
  if (userTx.length === 0) {
    return res.json({ user, transactions: [], report: null });
  }

  // Call Python batch prediction
  const pyScript = path.join(__dirname, "..", "predict_user_transactions.py");

// Ensure temp file folder exists
const datasetDir = path.join(__dirname, "..", "..", "dataset");
if (!fs.existsSync(datasetDir)) fs.mkdirSync(datasetDir, { recursive: true });

const txFile = path.join(datasetDir, `tmp_${userId}.json`);
fs.writeFileSync(txFile, JSON.stringify(userTx, null, 2));

const py = spawn("python", [pyScript, txFile]);

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (data) => (stdout += data.toString()));
  py.stderr.on("data", (data) => (stderr += data.toString()));

  py.on("close", (code) => {
    // Remove temp file
    fs.unlinkSync(txFile);

    if (stderr) {
      return res
        .status(500)
        .json({ error: "Python ML error", details: stderr });
    }

    if (!stdout.trim()) {
      return res.status(500).json({ error: "Empty response from ML engine" });
    }

    let predictions;
    try {
      predictions = JSON.parse(stdout);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Invalid JSON from ML engine", rawOutput: stdout });
    }

    // Compute user risk summary
    const anomalyTx = predictions.filter((p) => p.predicted_anomaly === 1);
    const riskScore =
      anomalyTx.length > 0
        ? Math.round((anomalyTx.length / predictions.length) * 100)
        : 0;

    const report = {
      totalTransactions: predictions.length,
      flaggedTransactions: anomalyTx.length,
      riskScore,
      hasAnomaly: anomalyTx.length > 0,
      anomalies: anomalyTx.map((p) => ({
        transactionId: p.transactionId,
        aiPatternId: p.aiPatternId,
        riskScore: p.anomaly_score,
        sopAlert: p.sopAlert,
        explanation: p.explanation,
        detectedPatterns: p.detectedPatterns,
      })),
    };

    res.json({ user, transactions: predictions, report });
  });
});

module.exports = router;
