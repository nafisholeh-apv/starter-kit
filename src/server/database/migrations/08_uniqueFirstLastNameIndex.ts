import { DatabaseContext } from '../instance';

export default {
    identifier: '06_uniqueFirstLastNameIndex',

    async up({ regular: { db } }: DatabaseContext): Promise<void> {
        await db.collection('lives').createIndex(
            { firstName: 1, lastName: 1 },
            { unique: true }
        );
    },
};