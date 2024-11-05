import { GraphQLLifeResolvers } from '../definitions';

const LifeGraphQL: GraphQLLifeResolvers = {
    id: root => root._id,
    fullName: root => `${root.firstName} ${root.lastName}`,
};

export default LifeGraphQL;
