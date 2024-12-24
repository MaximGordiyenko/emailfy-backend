export const tagStatusCalculate = (data) => {
  // Helper function to format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    if (diffInDays < 30) {
      return `${Math.round(diffInDays)} days ago`;
    } else if (diffInDays < 365) {
      return `${Math.round(diffInDays / 30)} months ago`;
    } else {
      return `${Math.round(diffInDays / 365)} years ago`;
    }
  };
  
  // Group by tagStatus
  const tagStatusCounts = data.reduce((acc, item) => {
    const { id, tagStatus, createdAt } = item;
    
    if (!acc[tagStatus]) {
      acc[tagStatus] = {
        id,
        tag: tagStatus,
        members: 0,
        created: new Date(createdAt), // Take the earliest date
      };
    }
    
    acc[tagStatus].members += 1;
    
    // Update the earliest created date for this tagStatus
    if (new Date(createdAt) < acc[tagStatus].created) {
      acc[tagStatus].created = new Date(createdAt);
    }
    
    return acc;
  }, {});
  
  // Format the result array
  return Object.values(tagStatusCounts).map(({ id, tag, members, created }) => ({
    id,
    tag,
    members,
    created: formatRelativeTime(created),
  }));
};
