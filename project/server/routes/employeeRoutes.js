const express = require("express");
const Employee = require("../models/Employee.js");

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add new employee
router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
