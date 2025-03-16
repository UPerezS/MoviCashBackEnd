const express = require("express");
const router = express.Router();
const superController = require("../controllers/superController");

router.post("/register", superController.registerSuperAdmin);
router.get("/", superController.getSuperAdmin);
router.put("/:id", superController.updateSuperAdmin);

module.exports = router;