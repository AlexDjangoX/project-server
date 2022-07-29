import User from '../domain/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  JWT_EXPIRY,
  JWT_SECRET,
  JWT_PASSWORD_RESET_EXPIRY,
} from '../utils/config.js';
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';
import { sendEmail } from '../utils/email.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendDataResponse(res, 401, {
      email: 'Invalid email or/and password provided',
    });
  }

  try {
    const foundUser = await User.findByEmail(email);
    const areCredentialsValid = await validateCredentials(password, foundUser);

    if (!areCredentialsValid) {
      return sendDataResponse(res, 401, {
        email: 'Invalid email and/or password provided',
      });
    }

    const token = generateJwt(foundUser.id);

    return sendDataResponse(res, 200, { token, ...foundUser.toJSON() });
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to process request');
  }
};

export const resetPassword = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;
  console.log('REQUEST_BODY : ', req.body);
  try {
    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      return sendDataResponse(res, 400, { email: 'Email not Valid' });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      existingUser.passwordHash
    );
    if (isPasswordValid) {
      const newPasswordHash = await bcrypt.hash(newPassword, 8);
      existingUser.passwordHash = newPasswordHash;
      existingUser.update();
      return sendDataResponse(res, 200, {
        message: 'Password changed successfully',
      });
    } else {
      return sendDataResponse(res, 401, {
        message: 'Invalid Data. unable to change password.',
      });
    }
  } catch (error) {
    console.error('something went wrong', error.message);
    return sendMessageResponse(res, 500, 'Unable to reset password');
  }
};

export const resetForgotPasswordLink = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (!existingUser) {
      return sendDataResponse(res, 400, { email: 'Email not Valid' });
    }

    const secret = `${JWT_SECRET}${existingUser.passwordHash}`;
    const payload = {
      email: existingUser.email,
      id: existingUser.id,
    };

    const token = generateJwtPasswordReset(
      payload,
      secret,
      JWT_PASSWORD_RESET_EXPIRY
    );
    const link = `http://localhost:3000/reset-forgot-password/${existingUser.id}/${token}`;
    const message = `Forgot your password? Reset link: ${link}`;
    const from = 'AlexDjangoX <hello@alexdjangox.io>';
    const subject = 'Reset token';
    const emailOptions = { from, email, subject, message };

    try {
      await sendEmail(emailOptions);
    } catch (error) {
      throw new Error('Please provide a valid email');
    }

    return sendDataResponse(res, 200, {
      message: 'Token sent to email',
      link,
    });
  } catch (error) {
    console.error('something went wrong', error.message);
    return sendMessageResponse(res, 500, 'Unable to reset password');
  }
};

export const resetForgotPassword = async (req, res) => {
  const { id, token, newPassword } = req.body;
  console.log('RESET_FORGOT_PASSWORD : ', req.body);
  try {
    const existingUser = await User.findById(Number(id));

    if (!existingUser) {
      return sendDataResponse(res, 400, { id: 'User ID not Valid' });
    }
    const secret = `${JWT_SECRET}${existingUser.passwordHash}`;

    try {
      const payload = jwt.verify(token, secret);
      if (payload) {
        const newPasswordHash = await bcrypt.hash(newPassword, 8);
        existingUser.passwordHash = newPasswordHash;
        existingUser.update();
        return sendDataResponse(res, 200, {
          message: 'Password changed successfully',
        });
      }
    } catch (error) {
      console.error('Token has not valid', error.message);
      return sendMessageResponse(res, 500, '1_Unable to reset password');
    }
  } catch (error) {
    console.error('User not in DB', error.message);
    return sendMessageResponse(res, 500, '2_Unable to reset password');
  }
};

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function generateJwtPasswordReset(payload, secret, expires) {
  return jwt.sign(payload, secret, {
    expiresIn: expires,
  });
}

async function validateCredentials(password, user) {
  if (!user) {
    return false;
  }

  if (!password) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return false;
  }

  return true;
}
