const express = require("express");
const router = express.Router();
const {
  getAllAccess,
  createNewAccess,
  updateAccess,
  getAccessById,
  statusUpdate,
} = require("../controller/accessController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(getAllAccess)
  .post(createNewAccess)
  .patch(updateAccess)
  .delete();

router.route("/:id").get(getAccessById);

router.route("/status/:id").patch(statusUpdate);

module.exports = router;
