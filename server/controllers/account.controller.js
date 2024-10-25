import { Account } from '../models/account.model.js';

export const signInAccount = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: `Provide email or password please` });
    const findAccount = await Account.findOne({
      where: { email },
    });
    if (!findAccount) return res.status(401).send({ message: `Account Unauthorized` });
    if (findAccount?.email) return res.status(200).send(true);
  } catch (error) {
    next(error);
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const users = await Account.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
