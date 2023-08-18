// https://docs.cypress.io/api/table-of-contents

describe('Test Logistic', () => {
  beforeEach(() => {
    cy.login('test.user', '12345')
  })

  it('Test catalog Counterparties (Kontrahenci)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'counterparties'
    const storeName = 'counterparties'
    const title = { single: 'Kontrahent', multiple: 'Kontrahenci' }
    const detailPath = 'counterparties-detail'
    const listPath = 'counterparties'

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('CYPRES TEST NAME')

    // // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#object-name').type('CYPRES TEST NAME')
    cy.get('input#object-pricesType').type('default')
    cy.get('input#object-nip').type('12345678901')
    cy.get('input#object-abbreviation').type('SAD')
    cy.get('input#customer-commission').type('5')
    cy.get('input#object-region').type('test region')
    cy.get('input#object-email').type('test@gmail.com')
    cy.get('input#object-phone').type('999999999')
    cy.get('input#object-address').type('test address')
    cy.get('input#object-customersGroup').type('test group')
    cy.get('input#item-customer').click({ force: true })
    // //Why with  item-customer?
    cy.get('input#item-supplier').click({ force: true })
    cy.iterateOverSelectorOptions('select#object-packageMaterial')
    cy.get('div#object-currency').children('div[class="input-group-append"]').children('button#customer-search').click()
    cy.get('tr[aria-rowindex="1"]').children('td[aria-colindex="1"]').click()

    cy.get('label[for="object-currency"]')
      .parent()
      .within(() => {
        cy.get('button[title="Clear Selected"]').click()
        cy.get('input[aria-autocomplete="list"]').type('usd')
        cy.get('li[aria-selected="true"]').click()
      })

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#object-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#object-name').clear().type('CYPRES TEST NAME')
    cy.get('input#object-pricesType').clear().type('default')
    cy.get('input#object-nip').clear().type('12345678901')
    cy.get('input#object-abbreviation').clear().type('SAD')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Ships (Statki)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'ship'
    const storeName = 'ships'
    const title = { single: 'Dane statku', multiple: 'Statki' }
    const detailPath = 'ship-detail'
    const listPath = 'ships'

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST NAME')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-number ').type('12')
    cy.get('input#item-name').type('CYPRES TEST NAME')
    cy.get('input#item-length').type('1')
    cy.get('input#item-width').type('2')
    cy.get('input#item-imo').type('IMO')
    cy.get('textarea#item-comment').type('CYPRES TEST COMMENT')
    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-number').should('have.value', '12').clear().type('21')

    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES EDIT TEST NAME')
    cy.get('input#item-length').should('have.value', '1').clear().type('3')
    cy.get('input#item-width').should('have.value', '2').clear().type('4')
    cy.get('input#item-imo').should('have.value', 'IMO').clear().type('TST')
    cy.get('textarea#item-comment').should('have.value', 'CYPRES TEST COMMENT').clear().type('EDIT COMMENT')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //cy.forseDelete(apiURL, storeName, newItemId)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-number ').type('12')
    cy.get('input#item-name').type('CYPRES TEST NAME')
    cy.get('input#item-length').type('1')
    cy.get('input#item-width').type('2')
    cy.get('input#item-imo').type('IMO')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Assortments (Sortymenty)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'assortments'
    const storeName = 'assortments'
    const title = { single: 'Sortyment', multiple: 'Sortymenty' }
    const detailPath = 'assortment-detail'
    const listPath = 'assortments'

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('CYPRES TEST NAME')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //cy.forseDelete(apiURL, storeName, newItemId)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').clear().type('111111111')
    cy.get('input#item-name').clear().type('COPY NAME')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Carriers (Przewoźnicy)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'carriers'
    const title = { single: 'Przewoźnik', multiple: 'Przewoźnicy' }
    const storeName = 'carriers'
    const detailPath = 'carrier-detail'
    const listPath = 'carriers'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST CYPRESS')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').clear().type('111111111')
    cy.get('input#item-name').clear().type('COPY NAME')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Control companies (Firmy kontrolne)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'control_companies'
    const title = { single: 'Firma kontrolna', multiple: 'Firmy kontrolne' }
    const storeName = 'controlCompanies'
    const detailPath = 'control-company-detail'
    const listPath = 'control-companies'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST CYPRESS')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Fill fields
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')
    cy.get('textarea#item-comment').type('CYPRES TEST COMMENT')

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')
    cy.get('textarea#item-comment').should('have.value', 'CYPRES TEST COMMENT').type('CYPRES TEST EDIT COMMENT')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').clear().type('111111111')
    cy.get('input#item-name').clear().type('COPY NAME')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Mines (Kopalnie)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'mine'
    const title = { single: 'Kopalnia', multiple: 'Kopalnie' }
    const storeName = 'mines'
    const detailPath = 'mine-detail'
    const listPath = 'mines-list'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST CYPRESS')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').clear().type('111111111')
    cy.get('input#item-name').clear().type('COPY NAME')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Schemes of cargo (Relacje przeładunkowe)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'scheme_of_cargo'
    const title = { single: 'Relacja przeładunkowa', multiple: 'Relacje przeładunkowe' }
    const storeName = 'schemesOfCargo'
    const detailPath = 'scheme-of-cargo'
    const listPath = 'schemes-of-cargo-list'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST CYPRESS')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#object-number').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')
    cy.iterateOverSelectorOptions('select#documentType')
    cy.iterateOverSelectorOptions('select#operationType')
    cy.get('button#customer-search').click()
    cy.get('tr[aria-rowindex="1"]').children('td[aria-colindex="1"]').click()
    cy.get('button[aria-label="Clear Selected"]').click()
    cy.wait(200)
    cy.get('button#customer-search').click()
    cy.get('tr[aria-rowindex="1"]').children('td[aria-colindex="1"]').click()
    cy.wait(200)
    cy.get('input[aria-autocomplete="list"]').type('adm')
    //cy.get('input[aria-labelledby="vs2__combobox"]').type('adm')
    cy.get('li[aria-selected="true"]').click()
    //enable checkboxes
    cy.get('input#ship').click({ force: true })
    cy.get('input#returnToWarehouse').click({ force: true })
    cy.get('input#reverseOperation').click({ force: true })
    cy.get('input#disableControlOnScales').click({ force: true })
    cy.get('input#disableControlInDispositions').click({ force: true })
    //disable checkboxes
    cy.get('input#ship').click({ force: true })
    cy.get('input#returnToWarehouse').click({ force: true })
    cy.get('input#reverseOperation').click({ force: true })
    cy.get('input#disableControlOnScales').click({ force: true })
    cy.get('input#disableControlInDispositions').click({ force: true })

    cy.get('a[aria-selected="false"]').click()
    cy.get('a[aria-selected="false"]').click()
    cy.get('a[aria-selected="false"]').click()

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#object-number').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

    cy.get('button#customer-search').click()
    cy.get('tr[aria-rowindex="1"]').children('td[aria-colindex="1"]').click()
    cy.wait(200)
    cy.get('input[aria-autocomplete="list"]').type('o')
    cy.get('li[aria-selected="true"]').click()

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#object-number').clear().type('111111111')
    cy.get('input#item-name').clear().type('CYPRES TEST NAME')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Vendors and customers (Dostawcy i odbiorcy)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'vendor_and_customer'
    const title = { single: 'Dane dostawców i odbiorców', multiple: 'Dostawcy i odbiorcy' }
    const storeName = 'vendorsAndCustomers'
    const detailPath = 'vendors-and-customers-detail'
    const listPath = 'vendors-and-customers'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST CYPRESS')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#object-code').type('111111111')
    cy.get('input#object-name').type('CYPRES TEST NAME')
    cy.get('input#object-full-name').type('CYPRES TEST FULL NAME')
    cy.get('input#object-number-of-copies').type('1')
    cy.get('input#object-not-use').click({ force: true })
    cy.get('input#object-is-customer').click({ force: true })
    cy.get('input#object-actual-warehouse').click({ force: true })
    cy.get('input#object-is-vendor').click({ force: true })
    cy.get('input#object-send-sms').click({ force: true })
    cy.get('input#object-forwarder').click({ force: true })
    cy.get('input#object-prod-condition').click({ force: true })

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#object-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#object-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')
    cy.get('input#object-full-name').should('have.value', 'CYPRES TEST FULL NAME').clear().type('CYPRES TEST EDIT FULL NAME')
    cy.get('input#object-number-of-copies').should('have.value', '1').clear().type('2')

    cy.get('input#object-not-use').click({ force: true })
    cy.get('input#object-is-customer').click({ force: true })
    cy.get('input#object-actual-warehouse').click({ force: true })
    cy.get('input#object-is-vendor').click({ force: true })
    cy.get('input#object-send-sms').click({ force: true })
    cy.get('input#object-forwarder').click({ force: true })
    cy.get('input#object-prod-condition').click({ force: true })

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('input#object-code').clear().type('111111111')
    cy.get('input#object-name').clear().type('CYPRES TEST NAME')
    cy.get('input#object-full-name').clear().type('CYPRES TEST FULL NAME')
    cy.get('input#object-number-of-copies').clear().type('1')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Vehicles (Środki transportu)', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'vehicle'
    const title = { single: 'Środek transportu', multiple: 'Środki transportu' }
    const storeName = 'vehicles'
    const detailPath = 'vehicle-detail'
    const listPath = 'vehicles-list'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    //Check list sort
    cy.sortTable(listPath, title)

    // Check search
    cy.checkListSearch('TEST111')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-number').type('TEST111')
    cy.get('input#item-tare').clear().type('21.900')
    cy.get('input#item-load-capacity').clear().type('10.900')
    cy.get('select#item-type').select('Carriage')
    cy.get('select#item-type').select('Car')
    cy.get('select#item-type').select('Trailer')

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL, 'TEST111')

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-number').should('have.value', 'TEST111').clear().type('TESTEDIT')
    cy.get('input#item-tare').should('have.value', '21.900').clear().type('10.10')
    cy.get('input#item-load-capacity').should('have.value', '10.900').clear().type('5.05')
    cy.get('select#item-type').select('Carriage')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').clear().type('111111111')
    cy.get('input#item-number').clear().type('TEST111')
    cy.get('input#item-tare').clear().type('21.900')
    cy.get('input#item-load-capacity').clear().type('10.900')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })

  it('Test catalog Drivers', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'drivers'
    const title = { single: 'Kierowca', multiple: 'Kierowcy' }
    const storeName = 'drivers'
    const detailPath = 'driver-form'
    const listPath = 'drivers-list'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    // //_NW
    //Check list sort
    //cy.sortTable(listPath, title)
    // //_NW
    // Check search
    // cy.checkListSearch('TEST CYPRESS')

    // Add new item
    cy.addNew(detailPath, title.single)

    // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')
    cy.get('input#item-card-serial').type('CT')
    cy.get('input#item-card-number').type('101010')
    cy.get('input#item-id-card').type('TST111')
    cy.get('input#item-terms-of-use').click({ force: true })
    cy.get('input#item-phone').type('9999999999')
    cy.get('input#item-email').type('cypress_test_mail@gmail.com')

    cy.get('a[aria-selected="false"]').click()
    cy.get('a[aria-selected="false"]').click()

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state.drivers.objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    //Search new item
    cy.searchNewItem(apiURL)

    //Delete restore new item
    cy.deleteRestoreItem(apiURL)

    //Edit new item
    cy.editFirstRow(detailPath)

    // Update fields data
    cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')
    cy.get('input#item-card-number').should('have.value', '101010').clear().type('202020')
    cy.get('input#item-phone').should('have.value', '9999999999').clear().type('111111111')
    cy.get('input#item-email').should('have.value', 'cypress_test_mail@gmail.com').clear().type('cypress_edit_test_mail@gmail.com')

    // Update and close detail view
    cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    cy.get('input#search-input').clear()
  })

  it('Test catalog scales', () => {
    // Input params
    const subsystem = 'Logistyka'
    const apiURL = 'scale'
    const title = { single: 'Waga', multiple: 'Wagi' }
    const storeName = 'scales'
    const detailPath = 'scale-detail'
    const listPath = 'scales-list'
    //

    const getStore = () => cy.window().its('app.$store')

    // Open subsystem
    cy.openSubsystem(subsystem)

    // Open object list
    cy.openList(apiURL, title.multiple)

    // //Check list sort
    cy.sortTable(listPath, title)
    ////_NW
    // // Check search
    // cy.checkListSearch('TEST CYPRESS')

    // // Add new item
    cy.addNew(detailPath, title.single)

    // // Input data
    cy.get('input#item-code').type('111111111')
    cy.get('input#item-name').type('CYPRES TEST NAME')
    cy.get('input#scalesNumber').clear().type('1')
    cy.get('input#scalesVersion').clear().type('1')
    cy.get('input#Factor').clear().type('1')
    cy.get('input#Deviation').clear().type('0.1')
    cy.get('input#address').type('test address')
    cy.get('input#port').clear().type('1010')
    cy.get('input#updatePeriod').type('1')
    cy.get('input[type="checkbox"]').each(($el) => {
      $el.click()
    })

    cy.iterateOverSelectorOptions('select#scyleTypeOptions')
    cy.iterateOverSelectorOptions('select#typeOfDocumentOptions')

    cy.get('label[for="scyleTypeOptions"')
      .parent()
      .parent()
      .within(() => {
        cy.get('button#customer-search').click()
      })
    cy.get('tr[aria-rowindex="1"]').children('td[aria-colindex="1"]').click()
    cy.get('label[for="scyleTypeOptions"')
      .parent()
      .parent()
      .within(() => {
        cy.get('button[title="Clear Selected"]').click()
        cy.get('input[aria-autocomplete="list"]').type('wie')
        cy.get('li[aria-selected="true"]').click()
      })

    cy.get('a[role="tab"]').contains('Rejestrator wideo').click()
    cy.get('input#videoRecorderServer').type('1.1.1.1')
    cy.get('input#videoRecorderPort').type('1000')
    cy.get('input#videoRecorderUser').type('user')
    cy.get('input#videoRecorderPassword').type('password')
    cy.get('input#VideoRecorderPathToFile').type('path')
    cy.get('textarea#VideoRecorderRequest').type('request')

    cy.get('a[role="tab"]').contains('Parametry bramy Iot').click()
    cy.get('input#gatewayServer').type('test')
    cy.get('input#gatewayLogin').type('test')
    cy.get('input#gatewayPassword').type('test')
    cy.get('input#gatewayPort').type('1010')

    cy.get('a[role="tab"]').contains('Tablica świetlne').click()
    cy.get('input#lightBoardNumber').type('1')
    cy.get('input#DisplayPort').type('1')

    cy.get('a[role="tab"]').contains('Dodatkowo').click()
    cy.get('input#RegistrAdress').type('test')
    cy.get('a[role="tab"]').contains('Protokółs').click()

    // Check store
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)
    // Get New item ID
    let newItemId
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })

    // Write and close object
    cy.writeAndClose(apiURL, listPath)

    // //_NW
    // //Search new item
    // cy.searchNewItem(apiURL)
    // //_NW
    // //Delete restore new item
    // cy.deleteRestoreItem(apiURL)

    // //Edit new item _NW
    // cy.editFirstRow(detailPath)
    // // Update fields data
    // cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    // cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

    // // Update and close detail view
    // cy.updateAndClose(apiURL, listPath)

    //Delete new item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    ////_NW
    // cy.get('input#search-input').clear()

    //Copy item
    cy.get('tr[aria-rowindex="1"]').click()
    cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    // Input data for COPY
    cy.get('input#item-code').clear().type('111111111')
    cy.get('input#item-name').clear().type('CYPRES TEST NAME')
    cy.get('input#scalesNumber').clear().type('1')
    cy.get('input#scalesVersion').clear().type('1')

    // Check store for COPY
    getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    // Get COPY item ID
    getStore().then((store) => {
      newItemId = store.state[storeName].objectViews[0].viewId
    })
    cy.log(newItemId)
    // Write and close object
    cy.writeAndClose(apiURL, listPath)
    //Delete copy item
    cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    getStore().then((store) => {
      store.dispatch(`${storeName}/delete`, { id: newItemId })
    })

    cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)
  })
})
