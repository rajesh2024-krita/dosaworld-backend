const express = require("express");
const router = express.Router();
const partyController = require("../controllers/partyController");

// CRUD routes
router.get("/", partyController.getAllParties);
router.get("/overdue", partyController.getOverdueParties);
router.get("/:id", partyController.getPartyById);
router.post("/", partyController.addParty);
router.put("/:id", partyController.updateParty);
router.patch("/:id/status", partyController.updatePartyStatus);
router.delete("/:id", partyController.deleteParty);

module.exports = router;