import { Account } from '../../models/account.model.js';

export const seedAccounts = async () => {
  try {
    const accounts = [
      {
        email: 'john@example.com',
        password: '12345678',
        remember: true,
      },
      {
        email: 'jane@example.com',
        password: '87654321',
        remember: false,
      },
      {
        email: 'bob@example.com',
        password: '34251678',
        remember: true,
      },
    ];
    
    // Create all accounts
    await Account.bulkCreate(accounts, {
      validate: true,
      individualHooks: true
    });
    
    console.log('Accounts seeded 🌱 successfully');
  } catch (error) {
    console.error('Error seeding accounts:', error);
  }
};
