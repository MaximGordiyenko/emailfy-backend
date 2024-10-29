import { Account } from '../account.model.js';

export const seedAccounts = async () => {
  try {
    const accounts = [
      {
        email: 'john@example.com',
        password: '12345678',
        remember: true,
        role: 'user'
      },
      {
        email: 'jane@example.com',
        password: '87654321',
        remember: false,
        role: 'admin'
      },
      {
        email: 'bob@example.com',
        password: '34251678',
        remember: true,
        role: 'user'
      },
    ];
    
    for (const accountData of accounts) {
      const [account, created] = await Account.findOrCreate({
        where: { email: accountData.email },
        defaults: accountData,
      });
      
      if (created) {
        console.log(`Account for ${account.email} created 🌱`);
      } else {
        console.log(`Account for ${account.email} already exists.`);
      }
    }
  } catch (error) {
    console.error('Error seeding accounts:', error);
  }
};
