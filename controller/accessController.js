const asyncHandler = require("express-async-handler");
const { Select } = require("../repository/emsdb");

// @des Get all access
// @route GET /access
// @access Private
const getAllAccess = asyncHandler(async (req, res) => {
  let sql = "select * from master_access";
  Select(sql, (err, result) => {
    if (err) {
      res.json({
        msg: err,
      });
    }
    if (result != 0) {
      res.json({
        msg: "success",
        data: result,
      });
    } else {
      res.json(JsonDataResponse(result));
    }
  });
});

// @des Get access by ID
// @route GET /access/id
// @access Private
const getAccessById = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let sql = "select * from master_access";
  Select(sql, (err, result) => {
    if (err) {
      res.json({
        msg: err,
      });
    }
    if (result != 0) {
      res.json({
        msg: `id selected ${id}`,
        data: result,
      });
    } else {
      res.json(JsonDataResponse(result));
    }
  });
});

// @des Create a access
// @route POST /access
// @access Private
const createNewAccess = asyncHandler(async (req, res) => {
  const { accessName } = req.body;

  res.json({
    msg: "success",
    data: `creating new access ${accessName}`,
  });
});

// @des Update a access
// @route PATCH /access
// @access Private
const updateAccess = asyncHandler(async (req, res) => {});

// @des Update status access
// @route PATCH /access
// @access Private
const statusUpdate = asyncHandler(async (req, res) => {
  let id = req.params.id;
  res.json({
    msg: "success",
    data: `status updated ${id}`,
  });
});

module.exports = {
  getAllAccess,
  createNewAccess,
  updateAccess,
  getAccessById,
  statusUpdate,
};
