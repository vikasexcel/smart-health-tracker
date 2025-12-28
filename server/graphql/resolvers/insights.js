import { UserInputError } from 'apollo-server-express';
import { Insight } from '../../models/Insight';
import { User } from '../../models/User';
import { getPersonalizedInsights } from '../../services/healthInsightsService';

const insightsResolver = {
  Query: {
    async personalizedInsights(_, { userId }, context) {
      if (!userId) {
        throw new UserInputError('User ID is required');
      }

      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new UserInputError('User not found');
        }

        const insights = await getPersonalizedInsights(user);
        return insights;
      } catch (error) {
        console.error('Error fetching personalized insights:', error);
        throw new Error('Failed to fetch personalized insights');
      }
    },
  },
};

export default insightsResolver;