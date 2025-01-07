import { AudienceGroup } from '../models/audience-group.model.js';

export const getGroupAudienceList = async (req, res) => {
  try {
    const { user } = req;
    
    const emailsOfClientsData = await AudienceGroup.findAll();
    
    res.status(200).json(emailsOfClientsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
  }
};
