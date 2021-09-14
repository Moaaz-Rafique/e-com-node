var express = require("express");
var router = express.Router();

// Require controller modules.
var user_controller = require("../controllers/userController");
var product_controller = require("../controllers/productController");
var category_controller = require("../controllers/categoryController");
var cart_controller = require("../controllers/cartController");
const { route } = require(".");

router.get("/", product_controller.index);

/// Product ROUTES ///
router.get("/product", product_controller.product_detail);
router.get("/products", product_controller.product_list);
router.post("/product/add", product_controller.add_product);
router.post("/product/remove", product_controller.remove_product);
router.post("/product/update", product_controller.update_product);

/// Category ROUTES ///
router.get("/category", category_controller.category_detail);
router.get("/categories", category_controller.category_list);
router.post("/category/add", category_controller.add_category);
router.post("/category/remove", category_controller.remove_category);
router.post("/category/update", category_controller.update_category);

/// Cart ROUTES ///
router.get("/cart", cart_controller.cart_detail);
router.get("/carts", cart_controller.cart_list);
router.get("/user/cart", cart_controller.user_cart);
router.get("/user/cart/current", cart_controller.user_current_cart);
router.post("/cart/add", cart_controller.add_cart);
router.post("/cart/remove", cart_controller.remove_cart_by_cart_id);
router.post("/cart/update", cart_controller.update_cart);
/// user ROUTES ///
router.get("/users", user_controller.user_list);
router.get("/user", user_controller.user_detail);
router.post("/user/update", user_controller.user_update);
router.post("/login", user_controller.user_login);
router.post("/signup", user_controller.user_signup);

module.exports = router;
