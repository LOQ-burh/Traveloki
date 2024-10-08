'use strict'

const express = require("express");
const route = express.Router();

const {
  GetLichSuDatXeOto,
  createHistory,
  DeleteLichSuDatXeOto,
} = require("../../controllers/historyCar_controller");

route.get("/GetLichSuDatXeOto", GetLichSuDatXeOto);
route.post("/createHistory", createHistory);
route.delete("/DeleteLichSuDatXeOto", DeleteLichSuDatXeOto);

module.exports = route;
