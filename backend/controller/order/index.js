const createOrder = require("./createOrder")
const deleteOrder = require("./deleteOrder")
const getOrderById = require("./getOrderById")
const getOrdersByAdmin = require("./getOrdersByAdmin")
const getOrdersByUser = require("./getOrdersByUser")
const updateOrderStatus = require("./updateOrderStatus")

module.exports = {createOrder, deleteOrder, getOrderById, getOrdersByAdmin, getOrdersByUser, updateOrderStatus}