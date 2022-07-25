import User from '../domain/user.js';
import jwt from 'jsonwebtoken';
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';
import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js';

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body);

  try {
    const existingUser = await User.findByEmail(userToCreate.email);

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' });
    }

    const createdUser = await userToCreate.save();

    const token = generateJwt(createdUser.id);

    return sendDataResponse(res, 200, { token, ...createdUser.toJSON() });
  } catch (error) {
    console.error('something went wrong', error.message);
    return sendMessageResponse(res, 500, 'Unable to create new user');
  }
};

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}
