var router = require("express").Router();
var videoController = require("../controllers/videoController");

router.post("/api/download", videoController.download);
router.post("/api/merge-videos", videoController.mergeVideos);

module.exports = router;
