import { hasOperationName } from '../../utils/graphql-test-utils';

describe('LivesList page', () => {
    const visitPageAndIntercept = fixtureName => {
        cy.intercept('POST', '/graphql', req => {
            if (hasOperationName(req, 'getLives')) {
                req.reply({ fixture: fixtureName });
            }
        }).as('getLives');
        cy.visit('/lives');
    };

    it('renders list of lives with correct data', () => {
        visitPageAndIntercept('lives.json');
        cy.wait('@getLives');

        cy.fixture('lives.json').then(response => {
            const firstItem = response.data.listLives[0];
            cy.get('table').should('exist');
            cy.get('table').contains('td', firstItem.fullName).should('exist');
            cy.get('.ant-empty').should('not.exist');
        });
    });

    it('renders empty data', () => {
        visitPageAndIntercept('lives-empty.json');
        cy.wait('@getLives');

        cy.fixture('lives-empty.json').then(_ => {
            cy.get('table').should('exist');
            cy.get('.ant-empty').should('exist');
        });
    });

    it('renders error', () => {
        cy.intercept('POST', '/graphql', req => {
            if (hasOperationName(req, 'getLives')) {
                req.reply({ statusCode: 400 });
            }
        }).as('getLives');

        cy.visit('/lives');

        cy.wait('@getLives');

        cy.get('table').should('exist');
        cy.get('.ant-result-title').should('have.text', '500');
    });
});
