export const dashboardData = async (req, res) => {
  try {
    const mockData = {
      user: { id: 1, name: 'Test User' },
      stats: { views: 100, clicks: 50 }
    };
    res.status(200).json(mockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
