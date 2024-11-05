import { gql } from '@apollo/client';
import { ObjectId } from 'mongodb';
import { getDatabaseContext } from '../../server/database';
import { composeHandlers, setupDatabase, cleanDatabase, setupWebService, getApolloClient } from '../helpers';

const mutation = gql`
    mutation test($life: CreateLifeProps!) {
        createLife(life: $life) {
            id
        }
    }
`;

const webService = setupWebService();

beforeEach(composeHandlers(setupDatabase, webService.initialize));

afterEach(composeHandlers(cleanDatabase, webService.cleanUp));

test('Create new life successfully', async () => {
    const { client } = getApolloClient(webService.url);
    const lifeInput = {
        firstName: 'August',
        lastName: 'Caesar',
        birthday: '1996-01-19T02:35:00.000Z',
        title: 'Globetrotter',
        description: 'A wanderer with stories from every corner of the globe.',
        hobbies: ['traveling', 'photography', 'writing travel blogs'],
    };
    const variables = {
        life: lifeInput,
    };
    const { data } = await client.mutate({ mutation, variables });
    const userId = new ObjectId(data.createLife.id);
    const { collections } = await getDatabaseContext();
    const lifeOutput = await collections.lives.findOne({ _id: userId });
    expect(lifeOutput).not.toBeNull();
    expect(lifeOutput.firstName).toBe(lifeInput.firstName);
});

test('Fails to create life with missing required fields', async () => {
    const { client } = getApolloClient(webService.url);
    const invalidInput = {
        lastName: 'Caesar',
    };
    const variables = { life: invalidInput };

    await expect(client.mutate({ mutation, variables })).rejects.toThrow(/400/);
});

test('Fails to create life with invalid birthday format', async () => {
    const { client } = getApolloClient(webService.url);
    const invalidInput = {
        firstName: 'August',
        lastName: 'Caesar',
        birthday: 'invalid-date-format',
        title: 'Globetrotter',
        description: 'A wanderer with stories from every corner of the globe.',
        hobbies: ['traveling', 'photography', 'writing travel blogs'],
    };
    const variables = { life: invalidInput };

    await expect(client.mutate({ mutation, variables })).rejects.toThrow(/400/);
});

test('Fails to create life with duplicate firstName and lastName combination', async () => {
    const { client } = getApolloClient(webService.url);
    const lifeInput = {
        firstName: 'John',
        lastName: 'Doe',
        birthday: '1990-01-01T00:00:00.000Z',
        title: 'The Explorer',
        description: 'An adventurer at heart.',
        hobbies: ['exploring', 'hiking', 'traveling'],
    };
    const variables = { life: lifeInput };

    // First, create a life entry with the specified firstName and lastName
    const { data } = await client.mutate({ mutation, variables });

    const userId = new ObjectId(data.createLife.id);
    const { collections } = await getDatabaseContext();
    const lifeOutput = await collections.lives.findOne({ _id: userId });

    expect(lifeOutput).not.toBeNull();
    expect(lifeOutput.firstName).toBe(lifeInput.firstName);
    expect(lifeOutput.lastName).toBe(lifeInput.lastName);

    // Now attempt to create another life with the same firstName and lastName
    await expect(client.mutate({ mutation, variables })).rejects.toThrow(/E11000/);
});
