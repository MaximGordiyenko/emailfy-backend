import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { sequelize } from '../DB.js';
import { EmailClient } from '../models/email-client.model.js';
import { Account } from '../models/account.model.js';
import { Campaign } from '../models/campaign.model.js';
import { SentEmailsStatistic } from '../models/sentEmailStatistics.model.js';
import bcrypt from 'bcrypt';
import { AudienceGroup } from '../models/audience-group.model.js';
import { extractBeforeAt } from './general.js';

export const generateRandomAccounts = async (count = 10) => {
  try {
    await sequelize.sync({ force: false }); // Ensure the database is synced
    
    const accountsData = Array.from({ length: count }).map(() => {
      const name = faker.person.fullName(); // Updated API for person name
      const description = faker.lorem.sentence();
      const email = faker.internet.email();
      const password = bcrypt.hashSync('password123', 10); // Hash a default password
      const role = faker.helpers.arrayElement(['user', 'admin', 'moderator']);
      
      return {
        id: uuidv4(),
        name,
        description,
        email,
        password,
        role
      };
    });
    
    await Account.bulkCreate(accountsData);
    console.log(`${count} random accounts inserted successfully!`);
  } catch (error) {
    console.error('Error inserting accounts:', error);
  }
};

export const generateRandomClientEmails = async (count = 10, id) => {
  try {
    // Ensure the database is synced
    await sequelize.sync({ force: false });
    
    // Define unsubscribe reasons and their corresponding probabilities
    const unsubscribeReasons = [
      { reason: 'Irrelevant content', weight: 15 }, // 15%
      { reason: 'Spam or unsolicited emails', weight: 3 }, //3%
      { reason: 'Not interested', weight: 40 }, // 50%
      { reason: 'Too many emails', weight: 25 }, // 25%
      { reason: 'Poor quality content', weight: 12 } // 2%
    ];
    
    const tagStatuses = [
      { status: 'passive', weight: 30 }, // 30%
      { status: 'active', weight: 50 }, // 50%
      { status: 'block', weight: 5 }, // 5%
      { status: 'wait', weight: 15 } // 15%
    ];
    
    // Generate random email data
    const emailData = Array.from({ length: count }).map(() => {
      const unsubscribed = faker.datatype.boolean();
      
      let unsubscribedReason = null;
      let tagStatus = null;
      
      if (unsubscribed) {
        // Create an array where each reason appears based on its weight
        const weightedReasons = [];
        unsubscribeReasons.forEach((entry) => {
          for (let i = 0; i < entry.weight; i++) {
            weightedReasons.push(entry.reason);
          }
        });
        
        // Randomly pick a reason based on the weighted distribution
        unsubscribedReason = faker.helpers.arrayElement(weightedReasons);
      }
      
      // Create an array where each status appears based on its weight
      const weightedStatuses = [];
      tagStatuses.forEach((entry) => {
        for (let i = 0; i < entry.weight; i++) {
          weightedStatuses.push(entry.status);
        }
      });
      
      // Randomly pick a status based on the weighted distribution
      tagStatus = faker.helpers.arrayElement(weightedStatuses);
      
      
      // Set the precise 'from' and 'to' dates
      const fromDate = new Date('2015-01-01T00:00:00.000Z');
      const toDate = new Date('2023-12-31T23:59:59.999Z');
      
      // Generate random dates for createdAt and updatedAt
      const createdAt = faker.date.between({
        from: fromDate,   // Set the `from` date to `createdAt`
        to: toDate     // Set the `to` date to the current date
      });
      
      const updatedAt = faker.date.between({
        from: createdAt,   // Set the `from` date to `createdAt`
        to: new Date()     // Set the `to` date to the current date
      });

      return {
        id: uuidv4(),
        accountId: id, // Assign a random accountId from the list
        email: faker.internet.email(), // Generate a random email address
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        country: faker.location.country(),
        city: faker.location.city(),
        address: faker.location.street(),
        zipCode: faker.location.zipCode(),
        unsubscribed,
        unsubscribedReason, // Conditionally assign reason
        tagStatus,
        createdAt,
        updatedAt
      };
    });
    
    // Bulk insert the generated emails into the database
    await EmailClient.bulkCreate(emailData);
    
    console.log(`${count} random emails inserted successfully!`);
  } catch (error) {
    console.error('Error inserting random emails:', error);
  }
};

export const generateRandomCampaigns = async (count = 10, id) => {
  try {
    await sequelize.sync({ force: false }); // Ensure the database is synced
    
    // Fetch all EmailClients along with their associated Account
    const accountEmail = await EmailClient.findAll({
      include: [
        {
          model: Account,
          attributes: ['id', 'name', 'email']
        }
      ],
      where: {
        accountId: id
      }
    });
    
    const campaignsData = Array.from({ length: count }).map(() => {
      // Randomly select an EmailClient
      const emailClient = faker.helpers.arrayElement(accountEmail);
      
      // Ensure createdAt and updatedAt for the campaign are not later than the associated EmailClient's createdAt
      const emailClientCreatedAt = emailClient.createdAt;
      const campaignCreatedAt = faker.date.between({
        from: emailClientCreatedAt,
        to: new Date()
      });
      const campaignUpdatedAt = faker.date.between({
        from: campaignCreatedAt,
        to: new Date()
      });

      return {
        id: uuidv4(),
        emailId: emailClient.id, // Ensure the emailId matches an existing EmailClient.id
        subject: faker.lorem.sentence(),
        senderName: extractBeforeAt(emailClient.Account.email), // Use the associated Account name as senderName
        content: faker.lorem.paragraph(),
        createdAt: campaignCreatedAt,
        updatedAt: campaignUpdatedAt
      };
    });
    
    // Bulk insert campaigns into the database
    await Campaign.bulkCreate(campaignsData);
    
    console.log(`${count} random campaigns inserted successfully!`);
  } catch (error) {
    console.error('Error generating random campaigns:', error);
  }
};

export const generateRandomSentEmailsStatistic = async (id) => {
  try {
    await sequelize.sync({ force: false }); // Ensure the database is synced
    
    // Fetch all EmailClients
    const emails = await EmailClient.findAll({
      where: { accountId: id },
      attributes: ['id', 'createdAt', 'updatedAt'],
      include: [{ model: Campaign, attributes: ['id'] }]
    });
    
    const statisticsData = [];
    
    for (const email of emails) {
      const emailCampaigns = email.Campaigns; // Campaigns associated with this email
      if (!emailCampaigns || emailCampaigns.length === 0) continue;
      
      for (const campaign of emailCampaigns) {
        const delivered = faker.datatype.boolean();
        const opened = delivered ? faker.datatype.boolean() : false;
        const clicked = opened ? faker.datatype.boolean() : false;
        const bounced = !delivered;
        
        // Assign createAt and updateAt from the EmailClient model
        const createdAt = email.createdAt; // Same as in EmailClient
        const updatedAt = email.updatedAt; // Same as in EmailClient
        
        statisticsData.push({
          id: uuidv4(),
          emailId: email.id,
          campaignId: campaign.id,
          delivered,
          opened,
          clicked,
          bounced,
          createdAt,
          updatedAt
        });
      }
    }
    
    // Bulk insert EmailStatistics into the database
    await SentEmailsStatistic.bulkCreate(statisticsData);
    console.log(`Generated email statistics for ${statisticsData.length} email-campaign combinations.`);
  } catch (error) {
    console.error('Error generating random email statistics:', error);
  }
};

export const generateRandomAudienceGroups = async () => {
  const emailClients = await EmailClient.findAll({
    include: [
      {
        model: Account,
        attributes: ['id']
      }
    ]
  });
  
  // Randomly select a subset of email clients
  const selectedClients = faker.helpers.shuffle(emailClients).slice(0, faker.number.int({
    min: 1,
    max: emailClients.length
  }));
  
  // Count emails per account
  const accountEmailCounts = {};
  
  selectedClients.forEach((client) => {
    const accountId = client.Account.id;
    if (!accountEmailCounts[accountId]) {
      accountEmailCounts[accountId] = 0;
    }
    accountEmailCounts[accountId] += 1;
  });
  
  // Create AudienceGroup entries
  for (const accountId in accountEmailCounts) {
    const createdDate = faker.date.past();
    const modifiedDate = faker.date.between({
      from: createdDate,
      to: new Date()
    });
    
    await AudienceGroup.create({
      id: uuidv4(),
      name: faker.lorem.word(),
      contacts: accountEmailCounts[accountId],
      segments: faker.number.int({ min: 1, max: 5 }),
      created: createdDate,
      modified: modifiedDate
    }, {
      timestamps: false // Disable automatic management of timestamps
    });
  }
};
