const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// CORS middleware setup
app.use(cors({
  origin: "http://localhost:3000"||"https://hmi-ui.vercel.app", // Allow requests from this origin
  methods: ["GET", "POST"], // Allow only GET and POST requests
  allowedHeaders: ["Content-Type"],
}));

mongoose
  .connect(
    "mongodb+srv://cucumber:pink-butterfly@cluster0.wjruhv3.mongodb.net/HMI?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const parameterSchema = new mongoose.Schema(
  {
    parameters: {
      "Total Dissolved Solids (TDS) Removal": Number,
      "Chlorine Removal": Number,
      "Bacteria Removal": Number,
      "Heavy Metals Removal": Number,
      "Turbidity Reduction": Number,
      Temperature: Number,
      Pressure: Number,
      Humidity: Number,
      "pH Level": Number,
      TDS: Number,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "data" } // Updated collection name
);

// Ensure the collection has an index on the `timestamp` field
parameterSchema.index({ timestamp: -1 });

const Parameter = mongoose.model("Parameter", parameterSchema);

app.get("/api/parameters/latest", async (req, res) => {
  try {
    const latestParameter = await Parameter.findOne().sort({ timestamp: -1 });

    if (latestParameter) {
      res.json(latestParameter);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    console.error("Error fetching latest parameter:", err);
    res.status(500).json({ message: err.message });
  }
});

// New endpoint to get all documents
app.get("/api/parameters", async (req, res) => {
  try {
    const allParameters = await Parameter.find();
    res.json(allParameters);
  } catch (err) {
    console.error("Error fetching all parameters:", err);
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
