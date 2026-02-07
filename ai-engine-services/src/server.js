const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// Load user baselines
const userBaselines = JSON.parse(fs.readFileSync("./dataset/user_baselines.json"));

app.post("/api/transaction/check", (req, res) => {
  const transaction = req.body.transaction || req.body;
  const userProfile = userBaselines.find(u => u.userId === transaction.userId);

  const payload = JSON.stringify({
    transaction,
    behaviorProfile: userProfile ? userProfile.baseline : {}
  });

  const pyPath = path.join(__dirname, "predict_transaction.py");
  if (!fs.existsSync(pyPath)) {
    return res.status(500).json({
      error: "Python file not found",
      path: pyPath,
    });
  }

  // ✅ Use pyPath here, not `path`
  const py = spawn("python", [pyPath, payload]);

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (data) => { stdout += data.toString(); });
  py.stderr.on("data", (data) => { stderr += data.toString(); });

  py.on("close", (code) => {
    if (stderr) {
      return res.status(500).json({ error: "Python ML error", details: stderr });
    }

    if (!stdout.trim()) {
      return res.status(500).json({ error: "Empty response from ML engine" });
    }

    let prediction;
    try { prediction = JSON.parse(stdout); } 
    catch (err) { return res.status(500).json({ error: "Invalid JSON from ML engine", rawOutput: stdout }); }

    res.json({
      transactionId: transaction.id,
      userId: transaction.userId,
      isAnomaly: prediction.predicted_anomaly === 1,
      riskScore: Math.round(prediction.anomaly_score * 100),
      aiPatternId: prediction.aiPatternId,
      sopAlert: prediction.sopAlert,
      explanation: prediction.explanation,
      detectedPatterns: prediction.detectedPatterns
    });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));


