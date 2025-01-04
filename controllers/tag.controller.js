import { EmailClient } from '../models/email-client.model.js';
import { tagStatusCalculate } from '../helpers/tagStatusCalculate.js';

export const getEmailClientInfo = async (req, res) => {
  try {
    const { user } = req;
    
    const emailsOfClientsData = await EmailClient.findAll({
      where: { accountId: user.id }
    });
    
    res.status(200).json(emailsOfClientsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
  }
};

export const getTagsStatistic = async (req, res) => {
  try {
    const { user } = req;
    
    const emailsOfClientsData = await EmailClient.findAll({
      where: { accountId: user.id }
    });

// Example usage
    const result = tagStatusCalculate(emailsOfClientsData);
    console.log(result);
    
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
  }
};
