const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activityController"); 

// Ruta para registrar actividades
router.post("/registerActivity", activityController.registerActivity); 
router.get("/getActivity", activityController.getActivity);
router.get("/file/:fileName",activityController.getFileByName);

module.exports = router;
