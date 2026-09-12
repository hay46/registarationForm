import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userFindbyEmail, userInsertData } from '../models/userModel.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;