import { Account } from '../models/account.model.js';
import { EmailClient } from '../models/email-client.model.js';
import { SentEmailsStatistic } from '../models/sentEmailStatistics.model.js';
import { Campaign } from '../models/campaign.model.js';
import { calculateRate } from '../helpers/calculateRate.js';

export const getTotalEmailAnalytics = async (req, res) => {
  try {
    const { user } = req;
    const accountId = user.id;
    
    // Fetching the account's email clients and their sent email statistics based on the provided accountId
    const account = await Account.findOne({
      where: { id: accountId },
      include: [
        {
          model: EmailClient,
          include: [SentEmailsStatistic]
        }
      ]
    });
    
    // If no account is found for the provided accountId, return a 404 error
    if (!account) {
      return res.status(404).json({ message: `Account with ID ${accountId} not found` });
    }
    
    const { EmailClients: emailClients } = account;
    if (!emailClients || emailClients.length === 0) {
      return res.status(404).json({ message: `No email clients found for account ${accountId}` });
    }
    
    // Initialize counters for total email statistics
    let totalEmailsSent = 0;
    let totalDelivered = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalBounced = 0;
    let totalUnsubscribed = 0;
    const associatedEmails = [];
    
    // Loop over each email client to aggregate the statistics
    for (const emailClient of emailClients) {
      const { id: emailClientId, SentEmailsStatistics: emailStats, unsubscribed } = emailClient;
      
      if (!emailStats || emailStats.length === 0) {
        continue; // Skip email clients with no statistics
      }
      
      associatedEmails.push(emailClientId);
      
      // Initialize counters for this email client
      let clientEmailsSent = 0;
      let clientDelivered = 0;
      let clientOpened = 0;
      let clientClicked = 0;
      let clientBounced = 0;
      let clientUnsubscribed = unsubscribed ? 1 : 0;
      
      // Loop through each SentEmailsStatistic and update the counters
      for (const stat of emailStats) {
        clientEmailsSent += 1;
        if (stat.delivered) clientDelivered += 1;
        if (stat.opened) clientOpened += 1;
        if (stat.clicked) clientClicked += 1;
        if (stat.bounced) clientBounced += 1;
      }
      
      // Aggregate client data into total counts
      totalEmailsSent += clientEmailsSent;
      totalDelivered += clientDelivered;
      totalOpened += clientOpened;
      totalClicked += clientClicked;
      totalBounced += clientBounced;
      totalUnsubscribed += clientUnsubscribed;
    }

   // Calculate the rates using the helper function
    const totalDeliveryRate = calculateRate(totalDelivered, totalEmailsSent);
    const totalOpenRate = calculateRate(totalOpened, totalDelivered);
    const totalClickRate = calculateRate(totalClicked, totalDelivered);
    const totalBounceRate = calculateRate(totalBounced, totalEmailsSent);
    
    // Prepare the response data
    const data = {
      accountId,
      totalEmailsSent,
      totalDeliveryRate: parseFloat(totalDeliveryRate.toFixed(1)),
      totalOpenRate: parseFloat(totalOpenRate.toFixed(1)),
      totalClickRate: parseFloat(totalClickRate.toFixed(1)),
      totalBounceRate: parseFloat(totalBounceRate.toFixed(1)),
      totalUnsubscribeCount: totalUnsubscribed,
      associatedEmails
    };
    
    // Respond with the aggregated email analytics data
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching campaign statistics:', error);
    res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
  }
};

export const getCampaignStatisticsByEmailID = async (req, res) => {
  try {
    const { params, user } = req;
    const emailId = params.id;  // Retrieve emailId from route params
    
    // Fetch email client data based on the emailId from the params
    const emailClient = await EmailClient.findOne({
      where: { id: emailId },
      include: [
        {
          model: Campaign,
          include: [SentEmailsStatistic]
        }
      ]
    });
    
    // If no email client is found for the given emailId, return a 404 error
    if (!emailClient) {
      return res.status(404).json({ message: `Email client with ID ${emailId} not found` });
    }
    
    const { id: emailClientId, Campaigns: campaigns, unsubscribed } = emailClient;
    
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ message: `No campaigns found for email client with ID ${emailClientId}` });
    }
    
    // Initialize counters for statistics
    let totalEmailsSent = 0;
    let deliveredCount = 0;
    let openedCount = 0;
    let clickedCount = 0;
    let bouncedCount = 0;
    const campaignIds = [];
    
    // Aggregate data from all campaigns under this email client
    for (const campaign of campaigns) {
      const { id: campaignId, SentEmailsStatistics: emailStats } = campaign;
      
      // Add campaignId to the array
      campaignIds.push(campaignId);
      
      if (emailStats && emailStats.length > 0) {
        totalEmailsSent += emailStats.length;
        deliveredCount += emailStats.filter((stat) => stat.delivered).length;
        openedCount += emailStats.filter((stat) => stat.opened).length;
        clickedCount += emailStats.filter((stat) => stat.clicked).length;
        bouncedCount += emailStats.filter((stat) => stat.bounced).length;
      }
    }
    
    // Calculate the campaign rates using the helper function
    const deliveryRate = calculateRate(deliveredCount, totalEmailsSent);
    const openRate = calculateRate(openedCount, deliveredCount);
    const clickRate = calculateRate(clickedCount, deliveredCount);
    const bounceRate = calculateRate(bouncedCount, totalEmailsSent);
    
    // Prepare the response data
    const data = {
      emailId,
      totalEmailsSent,
      deliveryRate: parseFloat(deliveryRate.toFixed(1)),
      openRate: parseFloat(openRate.toFixed(1)),
      clickRate: parseFloat(clickRate.toFixed(1)),
      bounceRate: parseFloat(bounceRate.toFixed(1)),
      unsubscribeCount: unsubscribed ? 1 : 0,
      campaignIds  // Store the array of campaign IDs
    };
    
    // Respond with the aggregated data for the given emailId
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching campaign statistics:', error);
    res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
  }
};

export const getClientEmails = async (req, res) => {
  try {
    const { user } = req;
    // await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailsOfClientsData = await EmailClient.findAll({
      where: { accountId: user.id }
    });
    
    res.status(200).json(emailsOfClientsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
  }
};

export const getTotalUnsubscribedEmailStatistic = async (req, res) => {
  try {
    const { user } = req;
    
    const emailsOfClientsData = await EmailClient.findAll({
      where: { accountId: user.id }
    });
    
    const initValue = {
      totalSubscriptions: {
        'Subscribed': 0,
        'Unsubscribed': 0,
      },
      unsubscribedReasons: {
        'Irrelevant content': 0,
        'Spam or unsolicited emails': 0,
        'Not interested': 0,
        'Too many emails': 0,
        'Poor quality content': 0,
      }
    }
    
    const statistics = emailsOfClientsData.reduce((acc, emailClient) => {
      if (emailClient.unsubscribed) {
        acc.totalSubscriptions['Subscribed'] += 1;
        
        // Count unsubscribed reasons
        const reason = emailClient.unsubscribedReason;
        acc.unsubscribedReasons[reason] = (acc.unsubscribedReasons[reason] || 0) + 1;
      } else {
        acc.totalSubscriptions['Unsubscribed'] += 1;
      }
      return acc;
    }, { ...initValue }); // Clone initValue to avoid mutation
    
    console.log(JSON.stringify(emailsOfClientsData, null, 2));
    
    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Unsubscribed emails statistic', error: error.message });
  }
}
