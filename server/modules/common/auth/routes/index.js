const express = require('express');
const router = express.Router();
const passport = require('passport');

const controllers = require('../controllers');

router.route('/auth/login').post(passport.authenticate('login'), controllers.login);
router.route('/auth/session').get(controllers.session);
router.route('/auth/logout').get(controllers.logout);
router.route('/auth/register').post(controllers.register);
router.route('/auth/confirm_email_address/:token').get(controllers.confirmEmailAddress);
router.route('/auth/resend_email_address_confirmation_link').get(controllers.resendEmailAddressConfirmationLink);
router.route('/auth/forgot_password').post(controllers.forgotPassword);
router.route('/auth/validate_password_reset_token/:token').get(controllers.validatePasswordResetToken);
router.route('/auth/reset_password').post(controllers.resetPassword);

module.exports = router;
