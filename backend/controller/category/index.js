const createCategory = require("./createCategory")
const getAllCategoriesByAdmin = require("./getAllCategoriesByAdmin")
const getParentCategories = require("./getParentCategories")
const updateCategory = require("./updateCategory")
const deleteCategory = require("./deleteCategory")
const getCategoryById = require("./getCategoryById")

module.exports = {
    createCategory,
    getAllCategoriesByAdmin,
    getParentCategories,
    updateCategory,
    deleteCategory,
    getCategoryById
}