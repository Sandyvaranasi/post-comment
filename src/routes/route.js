const router = require('express').Router();

const controllers = require('../controllers/userController');


router.post('/register',controllers.createCustomer);
router.post('/login',controllers.customerLogin);
router.post('/orders',controllers.createOrder);


module.exports = router;