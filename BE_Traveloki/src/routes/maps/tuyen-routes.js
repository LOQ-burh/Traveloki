'use strict'

const express = require("express");
const route = express.Router();
const {
  GetTuyen,
  CreateTuyen,
  TuyenDiemSanBay,
  DeleteTuyen,
  TuyenIDTuyen,
} = require("../../controllers/tuyen_controller");

route.get("/GetTuyen", GetTuyen);
route.get("/TuyenID/:id", TuyenIDTuyen);
route.post("/CreateTuyen", CreateTuyen);
route.delete("/DeleteTuyen/:id", DeleteTuyen);
route.get("/TuyenDiemSanBay", TuyenDiemSanBay);

module.exports = route;
