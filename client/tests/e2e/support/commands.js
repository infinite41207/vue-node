Cypress.Commands.add('login', (name, password) => {
  cy.visit('/')
  cy.contains('h1', 'Zaloguj się')

  cy.intercept('GET', /task/).as('getTasks')
  cy.get('input#username').type(name)
  cy.get('input#password').type(password)
  cy.get('button[type=submit]').click()

  // cy.wait('@getTasks')

  const getStore = () => cy.window().its('app.$store')
  getStore().its('state.auth.currentUser.login').should('equal', name)

  cy.get('.menu-list').children().should('have.length.greaterThan', 0)
})

Cypress.Commands.add('openSubsystem', (subsystemName) => {
  cy.get('.item-title').contains('Logistyka').parent().click()
})

Cypress.Commands.add('openList', (apiURI, title) => {
  cy.intercept('GET', `/${apiURI}*`).as('getList')
  cy.get('a').contains(title).click()
  cy.wait('@getList')
  cy.contains('h4', title)
  cy.title().should('eq', `${title} | SYNERGIA`)
})

Cypress.Commands.add('checkListSearch', (text) => {
  cy.get('input#search-input').type(text)
  cy.wait('@getList').then((interception) => {
    assert.isNotNull(interception.response.body, 'Search input is working')
  })
  cy.get('input#search-input').clear()
  cy.wait('@getList').then((interception) => {
    assert.isNotNull(interception.response.body, 'Search clear is working')
  })
})

Cypress.Commands.add('editFirstRow', (detailPath) => {
  cy.get('tr[aria-rowindex="1"]').children('td[aria-colindex="1"]').children('a').click()
  cy.url().should('include', `/${detailPath}/`)
})

Cypress.Commands.add('addNew', (detailPath, title) => {
  cy.get('button#add-btn').click()
  cy.url().should('include', `/${detailPath}/`)
  // cy.log(cy.title())
  cy.title().should('eq', `${title} | SYNERGIA`)
})

Cypress.Commands.add('deleteRestoreItem', (apiURL) => {
  //Marked to delete new item
  cy.get('tr[aria-rowindex="1"]').within(() => {
    cy.get('#del-res-btn').click()
  })

  cy.intercept('POST', `/${apiURL}/change_deletion_mark`).as('changeDM')

  cy.get('.btn-success').contains('OK').click()
  cy.wait('@changeDM').its('response.statusCode').should('eq', 200)

  //Restore new item
  cy.get('tr[aria-rowindex="1"]').within(() => {
    cy.get('#del-res-btn').click()
  })

  cy.get('.btn-success').contains('OK').click()
  cy.wait('@changeDM').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('writeAndClose', (apiURL, listPath) => {
  cy.intercept('POST', `/${apiURL}*`).as('createItem')
  cy.get('.btn-success').click()
  cy.wait('@createItem').its('response.statusCode').should('eq', 200)
  cy.url().should('include', `/${listPath}`)
})

Cypress.Commands.add('updateAndClose', (apiURL, listPath) => {
  cy.intercept('PUT', `**/${apiURL}/*`).as('updateItem')
  cy.get('.btn-success').click()
  cy.wait('@updateItem').its('response.statusCode').should('eq', 200)
  cy.url().should('include', `/${listPath}`)
})

Cypress.Commands.add('searchNewItem', (apiURL, searchText = 'CYPRES TEST NAME') => {
  cy.intercept('GET', `/${apiURL}*`, (req) => {
    if (req.query?.filter.includes(searchText)) {
      req.alias = 'getSearchList'
    }
  })

  cy.get('input#search-input').type(searchText)
  cy.wait('@getSearchList').its('response.statusCode').should('eq', 200)
})


Cypress.Commands.add('sortTable', (listPath, title) => {

  cy.get('table[role="grid"]').children('thead[role="rowgroup"]').children('tr[role="row"]').children('th[role="columnheader"]').each(($el) => {
    cy.wrap($el).click()
    cy.wait(200)

  })

  cy.url().should('include', `/${listPath}`)
  // cy.title().should('eq', `${title} | SYNERGIA`)

})

Cypress.Commands.add('iterateOverSelectorOptions', (selectorID) => {
  let currentOptionText
  cy.get(selectorID).children('option').each(($el) => {
    currentOptionText = $el.text()
    cy.get(selectorID).select(currentOptionText)
  })
})

