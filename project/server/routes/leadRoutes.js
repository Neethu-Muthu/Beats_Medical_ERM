import express from "express";
import Lead from "../models/Lead.js";
import Notification from "../models/Notification.js";
import Customer from "../models/Customer.js";

const router = express.Router();

// Get all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().populate("assigned_to", "name member_id");
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add new lead
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
      status,
      source,
      assigned_to,
      notes,
    } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      address,
      status,
      source,
      assigned_to,
      notes,
    });

    // Create notification if assigned_to exists
    if (assigned_to) {
      await Notification.create({
        type: "lead_assigned",
        title: "New Lead Assigned",
        message: `You have been assigned a new lead: "${name}" from ${company}`,
        user_id: assigned_to,
      });
    }

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update lead
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
      status,
      source,
      assigned_to,
      notes,
    } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        company,
        address,
        status,
        source,
        assigned_to,
        notes,
        updated_at: new Date(),
      },
      { new: true }
    );

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete lead
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Convert lead to customer
router.post("/:id/convert", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      address: lead.address || "",
      status: "active",
      total_value: 0,
    });

    await Lead.findByIdAndDelete(req.params.id);

    if (lead.assigned_to) {
      await Notification.create({
        type: "lead_converted",
        title: "Lead Converted",
        message: `Lead "${lead.name}" has been converted to a customer`,
        user_id: lead.assigned_to,
      });
    }

    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
