const express = require("express");
const router = express.Router();
const superController = require("../controllers/superController");

router.post("/register", superController.registerSuperAdmin);
router.get("/", superController.getSuperAdmin);

module.exports = router;