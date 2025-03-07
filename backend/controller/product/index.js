const uploadProduct = require("./uploadProduct")
const updateProduct = require("./updateProduct")
const searchProduct = require("./searchProduct")
const singleProductDetails = require("./getProductDetails")
const getAllProducts = require("./getProduct")
const getCategoryWiseProducts = require("./getCategoryWiseProduct")
const getProductsByCategory = require("./getCategoryProductOne")
const filterProduct = require("./filterProduct")

module.exports = { uploadProduct, updateProduct, searchProduct, singleProductDetails, getAllProducts, getCategoryWiseProducts, getProductsByCategory, filterProduct}
