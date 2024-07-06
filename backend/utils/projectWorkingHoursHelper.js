export function getProjectWorkingHourDistributionByUserId(projectWorkingHours, userId, startDate, endDate) {
    
  // Filter the data based on userId and date range
  const filteredData = projectWorkingHours.filter((entry) => {
    // note: to compare mongoDB objectIDs they need to be converted to strings
    return (
      entry.userId.toString() === userId.toString() &&
      entry.date >= startDate &&
      entry.date <= endDate
    );
  });

  // Create a distribution object
  const distribution = {};
  let totalHours = 0;

  // Calculate the working hours per project and the total hours
  filteredData.forEach((entry) => {
    if (!distribution[entry.projectId]) {
      distribution[entry.projectId] = 0;
    }
    distribution[entry.projectId] += entry.numberOfRealWorkingHours;
    totalHours += entry.numberOfRealWorkingHours;
  });

  // Calculate the percentage distribution
  const percentageDistribution = {};
  for (const projectId in distribution) {
    percentageDistribution[projectId] =
      ((distribution[projectId] / totalHours) * 100).toFixed(2) + '%';
  }

  // Calculate the number of projects
  const numberOfProjects = Object.keys(distribution).length;

  return {
    userId,
    startDate,
    endDate,
    totalHours,
    numberOfProjects,
    distribution,
    percentageDistribution,
  };
}
