const express = require("express");

const fileControllers = require("../controllers/files");
const router = express.Router();

router.post("/api/files/", fileControllers.uploadFile);
router.get("/files/:uuid", fileControllers.dynamicLink);
router.get("/files/download/:uuid", fileControllers.downloadLink);
router.post("/api/files/send", fileControllers.sendFile);

module.exports = router;
