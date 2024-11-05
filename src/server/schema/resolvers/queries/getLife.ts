import { getDatabaseContext } from '../../../database';
import { GraphQLQueryResolvers } from '../definitions';

const query: GraphQLQueryResolvers['getLife'] = async (_, { lifeId }) => {
    const { collections } = await getDatabaseContext();

    return collections.lives.findOne({ _id: lifeId });
};

export default query;
