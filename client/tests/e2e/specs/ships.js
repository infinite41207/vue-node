// https://docs.cypress.io/api/table-of-contents



describe('Test Logistyka', () => {
    beforeEach(() => {
        cy.login('test.user', '12345')
    })


    it('Test catalog Carriers (Przewoźnicy)', () => {
        // Input params
        const subsystem = 'Logistyka'
        const apiURL = 'carriers'
        const title = { single: 'Przewoźnik', multiple: 'Przewoźnicy' }
        const storeName = 'carriers'
        const detailPath = 'carrier-detail'
        const listPath = 'carriers'
        let arrayCellsValue = []
        let arrayCellsSort = []
        let currentCellText = ""
        //

        const getStore = () => cy.window().its('app.$store')

        // Open subsystem
        cy.openSubsystem(subsystem)

        // Open object list
        cy.openList(apiURL, title.multiple)


        cy.get('div').contains('Nazwa').parent().click()

        cy.get('a[href="javascript:void(0);"]').each(($el) => {
            currentCellText = $el.children('span').text()
            currentCellText = currentCellText.toString()
            if (currentCellText.length > 0 && currentCellText != 'Wyloguj') {
                arrayCellsValue.push(currentCellText.replace(/ /g, '').replace(/ /g, ''))
                arrayCellsSort.push(currentCellText.replace(/ /g, '').replace(/ /g, ''))
            }
        })

        cy.get('button[role="menuitemradio"]').contains('2').click()

        cy.get('a[href="javascript:void(0);"]').each(($el) => {
            currentCellText = $el.children('span').text()
            currentCellText = currentCellText.toString()
            if (currentCellText.length > 0 && currentCellText != 'Wyloguj') {
                arrayCellsValue.push(currentCellText.replace(/ /g, '').replace(/ /g, ''))
                arrayCellsSort.push(currentCellText.replace(/ /g, '').replace(/ /g, ''))
            }
        })

        cy.get('table').getTable().should(tableData => {
            const sorted = arrayCellsSort.sort((a, b) => {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
            for (let i = 0; i < sorted.length; i++) {
                // if (sorted[i] != arrayCellsValue[i]) {
                // console.log(sorted[i] + ';' + arrayCellsValue[i])
                // }
            }
        })

        let arrayLike = {
            0: "a",
            1: "b",
            length: 2
        };
        // cy.log(arrayLike.)
        // //Check list sort
        // cy.sortTable(listPath, title)

        // // Check search
        // cy.checkListSearch('TEST CYPRESS')

        // // Add new item
        // cy.addNew(detailPath, title.single)

        // // Input data
        // cy.get('input#item-code').type('111111111')
        // cy.get('input#item-name').type('CYPRES TEST NAME')

        // // Check store
        // getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

        // // Get New item ID
        // let newItemId
        // getStore().then((store) => {
        //   newItemId = store.state[storeName].objectViews[0].viewId
        // })

        // // Write and close object
        // cy.writeAndClose(apiURL, listPath)

        // //Search new item
        // cy.searchNewItem(apiURL)

        // //Delete restore new item
        // cy.deleteRestoreItem(apiURL)

        // //Edit new item
        // cy.editFirstRow(detailPath)

        // // Update fields data
        // cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
        // cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')

        // // Update and close detail view
        // cy.updateAndClose(apiURL, listPath)

        // //Delete new item
        // cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

        // getStore().then((store) => {
        //   store.dispatch(`${storeName}/delete`, { id: newItemId })
        // })

        // cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

        // cy.get('input#search-input').clear()

        // //Copy item 
        // cy.get('tr[aria-rowindex="1"]').click()
        // cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

        // // Input data for COPY
        // cy.get('input#item-code').clear().type('111111111')
        // cy.get('input#item-name').clear().type('COPY NAME')

        // // Check store for COPY
        // getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)


        // // Get COPY item ID
        // getStore().then((store) => {
        //   newItemId = store.state[storeName].objectViews[0].viewId
        // })
        // cy.log(newItemId)
        // // Write and close object
        // cy.writeAndClose(apiURL, listPath)
        // //Delete copy item
        // cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

        // getStore().then((store) => {
        //   store.dispatch(`${storeName}/delete`, { id: newItemId })
        // })

        // cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)


    })


    // it('Test catalog Vehicles (Środki transportu)', () => {
    //     // Input params
    //     const subsystem = 'Logistyka'
    //     const apiURL = 'vehicle'
    //     const title = { single: 'Środek transportu', multiple: 'Środki transportu' }
    //     const storeName = 'vehicles'
    //     const detailPath = 'vehicle-detail'
    //     const listPath = 'vehicles-list'
    //     //

    //     const getStore = () => cy.window().its('app.$store')

    //     // Open subsystem
    //     cy.openSubsystem(subsystem)

    //     // Open object list
    //     cy.openList(apiURL, title.multiple)

    //     //Check list sort
    //     cy.sortTable(listPath, title)

    //     // Check search
    //     cy.checkListSearch('TEST111')

    //     // Add new item
    //     cy.addNew(detailPath, title.single)

    //     // Input data
    //     cy.get('input#item-code').type('111111111')
    //     cy.get('input#item-number').type('TEST111')
    //     cy.get('input#item-tare').clear().type('21.900')
    //     cy.get('input#item-load-capacity').clear().type('10.900')
    //     cy.get('select#item-type').select('Carriage')
    //     cy.get('select#item-type').select('Car')
    //     cy.get('select#item-type').select('Trailer')

    //     // Check store
    //     getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    //     // Get New item ID
    //     let newItemId
    //     getStore().then((store) => {
    //         newItemId = store.state[storeName].objectViews[0].viewId
    //     })

    //     // Write and close object
    //     cy.writeAndClose(apiURL, listPath)

    //     //Search new item
    //     cy.searchNewItem(apiURL, 'TEST111')


    //     //Delete restore new item
    //     cy.deleteRestoreItem(apiURL)

    //     //Edit new item
    //     cy.editFirstRow(detailPath)

    //     // Update fields data
    //     cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    //     cy.get('input#item-number').should('have.value', 'TEST111').clear().type('TESTEDIT')
    //     cy.get('input#item-tare').should('have.value', '21.900').clear().type('10.10')
    //     cy.get('input#item-load-capacity').should('have.value', '10.900').clear().type('5.05')
    //     cy.get('select#item-type').select('Carriage')

    //     // Update and close detail view
    //     cy.updateAndClose(apiURL, listPath)

    //     //Delete new item
    //     cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    //     getStore().then((store) => {
    //         store.dispatch(`${storeName}/delete`, { id: newItemId })
    //     })

    //     cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    //     cy.get('input#search-input').clear()

    //     //Copy item 
    //     cy.get('tr[aria-rowindex="1"]').click()
    //     cy.get('button[class="btn btn-sm ml-1 btn-outline-secondary"]').click()

    //     // Input data for COPY
    //     cy.get('input#item-code').clear().type('111111111')
    //     cy.get('input#item-number').clear().type('TEST111')
    //     cy.get('input#item-tare').clear().type('21.900')
    //     cy.get('input#item-load-capacity').clear().type('10.900')

    //     // Check store for COPY
    //     getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)


    //     // Get COPY item ID
    //     getStore().then((store) => {
    //         newItemId = store.state[storeName].objectViews[0].viewId
    //     })
    //     cy.log(newItemId)
    //     // Write and close object
    //     cy.writeAndClose(apiURL, listPath)
    //     //Delete copy item
    //     cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    //     getStore().then((store) => {
    //         store.dispatch(`${storeName}/delete`, { id: newItemId })
    //     })

    //     cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    // })


    // it('Test catalog Drivers', () => {
    //     // Input params
    //     const subsystem = 'Logistyka'
    //     const apiURL = 'drivers'
    //     const title = { single: 'Kierowca', multiple: 'Kierowcy' }
    //     const storeName = 'drivers'
    //     const detailPath = 'driver-form'
    //     const listPath = 'drivers-list'
    //     //

    //     const getStore = () => cy.window().its('app.$store')

    //     // Open subsystem
    //     cy.openSubsystem(subsystem)

    //     // Open object list
    //     cy.openList(apiURL, title.multiple)

    //     // //_NW
    //     //Check list sort
    //     //cy.sortTable(listPath, title)
    //     // //_NW
    //     // Check search
    //     // cy.checkListSearch('TEST CYPRESS')

    //     // Add new item
    //     cy.addNew(detailPath, title.single)

    //     // Input data
    //     cy.get('input#item-code').type('111111111')
    //     cy.get('input#item-name').type('CYPRES TEST NAME')
    //     cy.get('input#item-card-serial').type('CT')
    //     cy.get('input#item-card-number').type('101010')
    //     cy.get('input#item-id-card').type('TST111')
    //     cy.get('input#item-terms-of-use').click({ force: true })
    //     cy.get('input#item-phone').type('9999999999')
    //     cy.get('input#item-email').type('cypress_test_mail@gmail.com')

    //     cy.get('a[aria-selected="false"]').click()
    //     cy.get('a[aria-selected="false"]').click()

    //     // Check store
    //     getStore().its(`state.${storeName}.objectViews.length`).should('equal', 1)

    //     // Get New item ID
    //     let newItemId
    //     getStore().then((store) => {
    //         newItemId = store.state.drivers.objectViews[0].viewId
    //     })

    //     // Write and close object
    //     cy.writeAndClose(apiURL, listPath)

    //     //Search new item
    //     cy.searchNewItem(apiURL)

    //     //Delete restore new item
    //     cy.deleteRestoreItem(apiURL)

    //     //Edit new item
    //     cy.editFirstRow(detailPath)

    //     // Update fields data
    //     cy.get('input#item-code').should('have.value', '111111111').clear().type('222222222')
    //     cy.get('input#item-name').should('have.value', 'CYPRES TEST NAME').clear().type('CYPRES TEST EDIT NAME')
    //     cy.get('input#item-card-number').should('have.value', '101010').clear().type('202020')
    //     cy.get('input#item-phone').should('have.value', '9999999999').clear().type('111111111')
    //     cy.get('input#item-email').should('have.value', 'cypress_test_mail@gmail.com').clear().type('cypress_edit_test_mail@gmail.com')

    //     // Update and close detail view
    //     cy.updateAndClose(apiURL, listPath)

    //     //Delete new item
    //     cy.intercept('DELETE', `**/${apiURL}/*`).as('deleteItem')

    //     getStore().then((store) => {
    //         store.dispatch(`${storeName}/delete`, { id: newItemId })
    //     })

    //     cy.wait('@deleteItem').its('response.statusCode').should('eq', 200)

    //     cy.get('input#search-input').clear()
    // })



})