import { ObjectId } from 'mongodb';
import { getDatabaseContext, Life } from '../../../database';
import { GraphQLMutationResolvers } from '../definitions';

const mutation: GraphQLMutationResolvers['createLife'] = async (_, { life }) => {
    const { collections } = await getDatabaseContext();
    const document: Life = {
        _id: new ObjectId(),
        ...life,
    };

    await collections.lives.insertOne(document);

    return document;
};

export default mutation;
