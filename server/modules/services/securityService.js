const config = require('config');
const cryptoGen = require('@common/auth/cryptoGen');
const nodemailer = require('nodemailer');
const httpStatus = require('http-status-codes');
const logger = require('@logging/logger');
const uuidlib = require('uuid');
const { Op } = require('sequelize');

const User = require('@catalogs/users/models');
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount');

/**
 * This service performs security related tasks, like register
 */
module.exports = {
  async emailConfirmationInstructions(email, name, token) {
    const emailAccount = await getServiceEmailAccount().catch((error) => {
      logger.error('Error in getServiceEmailAccount', { meta: error });
      return;
    });

    if (!emailAccount) {
      logger.error('Error in emailConfirmationInstructions ', { meta: 'Service email account not exist' });
      return;
    }

    if (!emailAccount.password) {
      logger.error('Error in emailConfirmationInstructions ', { meta: 'Service email account password not set' });
    }

    emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password));

    let emailConfig = {
      credentials: {
        host: emailAccount.smtpHost,
        port: emailAccount.smtpPort,
        secure: emailAccount.smtpTls,
        auth: {
          user: emailAccount.user,
          pass: emailAccount.password,
        },
        tls: {
          rejectUnauthorized: emailAccount.smtpTls,
        },
      },
    };

    let transporter = nodemailer.createTransport(emailConfig.credentials);

    transporter.verify(function (error, success) {
      if (error) {
        logger.error('Error in emailConfirmationInstructions ', { meta: error });
      } else {
        let mailOptions = {
          from: emailAccount.name,
          to: email,
          bcc: emailAccount.name,
          subject: 'Confirm Your Email',
          html:
            'Hi, ' +
            name +
            '<br><br>Please click the link below to confirm your email address<br><br><button><a href="' +
            config.get('frontendUrls.emailConfirmationBaseUrl') +
            '/' +
            token +
            '">Confirm Your Email Address</a></button>',
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            sendData.errorMessage = 'Error while sending email';
            logger.error('Error while sending service email', { meta: error });
          } else {
            logger.verbose('Service Email sent', { meta: info });
          }
        });
      }
    });
  },

  async register(userObj) {
    let result = {};
    try {
      const existUser = await User.findOne({ where: { [Op.or]: { email: userObj.email, login: userObj.login } } });

      if (existUser) {
        const errorMessage = 'A user with this login or email already exist';
        logger.error('Error in register Service', { meta: errorMessage });
        return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: errorMessage } };
      }

      let userInfo = {
        email: userObj.email,
        login: userObj.login,
        uuid: uuidlib.v4(),
        password: cryptoGen.createPasswordHash(userObj.password),
        name: userObj.name,
        isActive: false,
        fullRights: false,
        externalUser: false,
        emailConfirmationToken: await cryptoGen.generateRandomToken(),
        referralToken: await cryptoGen.generateRandomToken(),
      };

      const first = await firstUser();

      if (first === true) {
        userInfo.isActive = true;
        userInfo.fullRights = true;
      }

      return await User.create(userInfo)
        .then(async (user) => {
          logger.info('New user was registered', { meta: JSON.stringify({ id: user.id, name: user.name }) });

          if (first === false) {
            this.emailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken);
          }

          const responseData = { email: user.email, login: user.login, name: user.name };
          return { httpStatus: httpStatus.StatusCodes.OK, result: responseData };
        })
        .catch((error) => {
          logger.error('Error in register Service', { meta: error });
          return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: 'User create error.' } };
        });
    } catch (error) {
      logger.error('Error in register Service', { meta: error });
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } };
    }
  },

  async confirmEmailAddress(token) {
    return await User.findOne({ where: { emailConfirmationToken: token } })
      .then(async (user) => {
        // If an associated user with the given token is not found, then return failure
        if (!user) {
          logger.error('Error in confirmEmailAddress Service', { meta: 'Token not find.' });
          return { httpStatus: httpStatus.StatusCodes.NOT_FOUND, result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.NOT_FOUND) } };
        }

        // Go ahead and confirm the user email
        user = await user.update({ emailConfirmationToken: null });

        // If the user was not properly saved, stop here and return failure
        if (!user) {
          logger.error('Error in confirmEmailAddress Service', { meta: 'User not save.' });
          return {
            httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
            result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR) },
          };
        }

        // If we have gotten this far, return success
        return { httpStatus: httpStatus.StatusCodes.OK, result: true };
      })
      .catch((error) => {
        logger.error('Error in confirmEmailAddress Service', { meta: error });
        return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { errorDetails: error } };
      });
  },

  async resendEmailAddressConfirmationLink(email) {
    try {
      let user = await User.findOne({ where: { email: email } });
      let token = await cryptoGen.generateRandomToken();

      // If a user is found, and they are still unverified, ONLY THEN update the token and send the email
      if (!(user && token)) {
        return {
          httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
          result: { message: 'Email is already confirmed or does not exist in our records.' },
        };
      }

      // Overwrite the user record with new token.
      user = await user.update({ emailConfirmationToken: token });

      // If the user was not properly saved, stop here and return failure
      if (!user) {
        return {
          httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
          result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR) },
        };
      }

      // If we have gotten this far, return success
      this.emailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken);
      return { httpStatus: httpStatus.StatusCodes.OK, result: true };
    } catch (error) {
      logger.error('Error in resendEmailAddressConfirmationLink Service', { meta: error });
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } };
    }
  },

  async forgotPassword(email) {
    try {
      return await User.findOne({
        where: {
          email: email,
        },
      })
        .then(async (foundUser) => {
          let token = await cryptoGen.generateRandomToken();

          // If an associated user with the email wasn't found, and a token not generated, stop here
          if (!(foundUser && token)) {
            logger.error('Error in forgotPassword Service', { meta: 'User not found' });
            return { httpStatus: httpStatus.StatusCodes.NOT_FOUND, result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.NOT_FOUND) } };
          }

          // Generate password reset token and save it
          updateData = {
            passwordResetToken: token,
            passwordResetExpires: Date.now() + config.get('tokenValidity.passwordResetTokenValidFor'),
          };

          return await foundUser
            .update({ ...updateData })
            .then(async (updatedUser) => {
              // If the user was not properly saved, stop here and return failure
              if (!updatedUser) {
                logger.error('Error in forgotPassword Service', { meta: 'User not updated' });
                return {
                  httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
                  result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR) },
                };
              }

              // If we have gotten this far, return success
              return emailPasswordResetInstructions(updatedUser.email, updatedUser.name, updatedUser.passwordResetToken);
            })
            .catch((error) => {
              logger.error('Error in forgotPassword Service', { meta: error });
              return {
                httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
                result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR) },
              };
            });
        })
        .catch((error) => {
          logger.error('Error in forgotPassword Service', { meta: error });
          return {
            httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
            result: { message: 'Email is already confirmed or does not exist in our records.' },
          };
        });
    } catch (error) {
      logger.error('Error in forgotPassword Service', { meta: error });
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } };
    }
  },

  async isPasswordResetTokenValid(token) {
    try {
      let user = await User.findOne({ where: { passwordResetToken: token, passwordResetExpires: { [Op.gte]: Date.now() } } });
      return user ? { httpStatus: httpStatus.StatusCodes.OK, result: true } : { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: false };
    } catch (error) {
      logger.error('Error in isPasswordResetTokenValid Service', { meta: error });
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } };
    }
  },

  async resetPassword(token, newPassword) {
    try {
      let user = await User.findOne({ where: { passwordResetToken: token, passwordResetExpires: { [Op.gte]: Date.now() } } });

      // If an associated user with the given token is found and token hasn't expired yet, only then let's continue
      if (!user) {
        return { httpStatus: httpStatus.StatusCodes.NOT_FOUND, result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.NOT_FOUND) } };
      }

      // Overwrite the user variable with result from the new save.
      user = await user.update({ passwordResetToken: null, passwordResetExpires: null, password: cryptoGen.createPasswordHash(newPassword) });
      // If the user was not properly saved, stop here and return failure

      if (!user) {
        return {
          httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
          result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR) },
        };
      }

      // If we have gotten this far, return success
      emailPasswordResetConfirmation(user.email, user.name);

      return { httpStatus: httpStatus.OK, result: true };
    } catch (error) {
      logger.error('Error in resetPassword Service', { meta: error });
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } };
    }
  },
};

async function firstUser() {
  return await User.findAll()
    .then((result) => {
      return result.length === 0;
    })
    .catch((err) => {
      return false;
    });
}

async function getServiceEmailAccount() {
  const emailAccount = await EmailAccount.findOne({ where: { isService: true } }).catch((error) => {
    throw error;
  });

  return emailAccount;
}

async function emailPasswordResetInstructions(email, name, token) {
  const emailAccount = await getServiceEmailAccount().catch((error) => {
    logger.error('Error in getServiceEmailAccount', { meta: error });
    return;
  });

  if (!emailAccount) {
    logger.error('Error in emailConfirmationInstructions ', { meta: 'Service email account not exist' });
    return { httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, result: { message: 'Service email account not exist' } };
  }

  if (!emailAccount.password) {
    logger.error('Error in emailConfirmationInstructions ', { meta: 'Service email account password not set' });
    return { httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, result: { message: 'Service email account password not set' } };
  }

  emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password));

  let emailConfig = {
    credentials: {
      host: emailAccount.smtpHost,
      port: emailAccount.smtpPort,
      secure: emailAccount.smtpTls,
      auth: {
        user: emailAccount.user,
        pass: emailAccount.password,
      },
      tls: {
        rejectUnauthorized: emailAccount.smtpTls,
      },
    },
  };

  let transporter = nodemailer.createTransport(emailConfig.credentials);

  transporter.verify(function (error, success) {
    if (error) {
      logger.error('Error in emailConfirmationInstructions ', { meta: error });
    } else {
      let mailOptions = {
        from: emailAccount.name,
        to: email,
        bcc: emailAccount.name,
        subject: 'Password Reset',
        html:
          'Hi, ' +
          name +
          '<br><br>Please click the link below to reset your password<br><br><button><a href="' +
          config.get('frontendUrls.passwordResetBaseUrl') +
          '/' +
          token +
          '">Reset Password</a></button>',
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          logger.error('Error while sending service email', { meta: error });
        } else {
          logger.verbose('Service Email sent', { meta: info });
        }
      });
    }
  });

  return { httpStatus: httpStatus.StatusCodes.OK, result: { message: 'OK' } };
}

async function emailPasswordResetConfirmation(email, name) {
  const emailAccount = await getServiceEmailAccount().catch((error) => {
    logger.error('Error in getServiceEmailAccount', { meta: error });
    return;
  });

  if (!emailAccount) {
    logger.error('Error in emailConfirmationInstructions ', { meta: 'Service email account not exist' });
    return;
  }

  if (!emailAccount.password) {
    logger.error('Error in emailConfirmationInstructions ', { meta: 'Service email account password not set' });
  }

  emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password));

  let emailConfig = {
    credentials: {
      host: emailAccount.smtpHost,
      port: emailAccount.smtpPort,
      secure: emailAccount.smtpTls,
      auth: {
        user: emailAccount.user,
        pass: emailAccount.password,
      },
      tls: {
        rejectUnauthorized: emailAccount.smtpTls,
      },
    },
  };

  let transporter = nodemailer.createTransport(emailConfig.credentials);

  transporter.verify(function (error, success) {
    if (error) {
      logger.error('Error in emailConfirmationInstructions ', { meta: error });
    } else {
      let mailOptions = {
        from: emailAccount.name,
        to: email,
        bcc: emailAccount.name,
        subject: 'Password Reset Successful',
        html: 'Hi, ' + name + '<br><br>Your password has been successfully reset.<br><br>',
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          sendData.errorMessage = 'Error while sending email';
          logger.error('Error while sending service email', { meta: error });
        } else {
          logger.verbose('Service Email sent', { meta: info });
        }
      });
    }
  });
}
