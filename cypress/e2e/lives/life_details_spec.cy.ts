import { hasOperationName } from '../../utils/graphql-test-utils';

describe('LifeDetail page', () => {
    const visitPageAndIntercept = fixtureName => {
        cy.intercept('POST', '/graphql', req => {
            if (hasOperationName(req, 'getLifeById')) {
                req.reply({ fixture: fixtureName });
            }
        }).as('getLife');
        cy.visit('/lives/67285e8ae7dc6c6406422a53');
    };

    it('renders life details based on ID', () => {
        visitPageAndIntercept('life.json');
        cy.wait('@getLife');

        cy.fixture('life.json').then(response => {
            const { fullName, title, id, hobbies, description } = response.data.getLife;
            cy.contains('.ant-typography', `Life of ${fullName}`);
            cy.get('.ant-descriptions-item-content').eq(0).should('have.text', title);
            cy.get('.ant-descriptions-item-content').eq(1).should('not.have.text', 'Invalid Date');
            cy.get('.ant-descriptions-item-content').eq(2).should('have.text', id);
            cy.get('.ant-descriptions-item-content').eq(3).should('have.text', hobbies.join(', '));
            cy.get('.ant-descriptions-item-content').eq(4).should('have.text', description);
        });
    });

    it('renders invalid date', () => {
        visitPageAndIntercept('life-invalid-date.json');
        cy.wait('@getLife');

        cy.fixture('life-invalid-date.json').then(_ => {
            cy.get('.ant-descriptions-item-content').eq(1).should('have.text', 'Invalid Date');
        });
    });

    it('renders error', () => {
        cy.intercept('POST', '/graphql', req => {
            if (hasOperationName(req, 'getLifeById')) {
                req.reply({ statusCode: 400 });
            }
        }).as('getLife');

        cy.visit('/lives/67285e8ae7dc6c6406422a53');

        cy.wait('@getLife');

        cy.get('.ant-descriptions-item-content').should('not.exist');
        cy.get('.ant-result-title').should('have.text', '500');
    });
});
