const express = require("express");
const router = express.Router();

router.post("/foodData", (req, res) => {
  try {
    res.send([global.My_Data, global.Food_Category]);
  } catch (error) {
    res.send("Server Error");
  }
});
module.exports = router;
