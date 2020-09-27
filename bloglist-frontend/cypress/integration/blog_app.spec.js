describe('Blog app', function () {
    // start with a fresh database with one main user for creating blogs and another user for testing permissions
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        const user2 = {
            name: 'Luukkainen Matti',
            username: 'salainen',
            password: 'mluukkai'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user2)
        cy.visit('http://localhost:3000')
    })

    describe('Login', function () {
        it('Login form is shown', function () {
            cy.contains('log in to application')
            cy.get('#loginbutton-main').click()
            cy.get('#username').should('exist')
            cy.get('#password').should('exist')
            cy.get('#login-button').contains('login').should('exist')
            cy.get('#cancelButton-main').contains('cancel').should('exist')
        })

        it('Login form is not shown after cancel button hit', function () {
            cy.contains('log in to application')
            cy.get('#loginbutton-main').click()
            cy.get('#cancelButton-main').click()
            cy.contains('log in to application')
        })

        it('user with correct credentials can log in', function () {
            cy.get('#loginbutton-main').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()

            cy.contains('Matti Luukkainen logged in')
        })

        it('user with incorrect credentials cannot log in', function () {
            cy.get('#loginbutton-main').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('alainen')
            cy.get('#login-button').click()

            cy.get('.error')
                .should('contain', 'wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')
        })
    })

    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'mluukkai', password: 'salainen' })
        })

        it('logged in user can create blog post', function () {
            cy.contains('create new blog').click()
            cy.get('#title').type('The Joel Test: 12 Steps to Better Code')
            cy.get('#author').type('Joel Spolsky')
            cy.get('#url').type('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
            cy.get('#blogform-create').click()
            cy.get('.success')
                .should('contain', 'The Joel Test: 12 Steps to Better Code by Joel Spolsky')
                .and('have.css', 'color', 'rgb(0, 128, 0)')
                .and('have.css', 'border-style', 'solid')
        })

        it('authorised user cannot create blog without all details', function () {
            cy.contains('create new blog').click()
            cy.get('#blogform-create').click()
            cy.get('.error')
                .should('contain', 'Incorrect Blog Details')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')
        })

        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.createBlogWithLikes({
                    title: 'The Joel Test: 12 Steps to Better Code',
                    author: 'Joel Spolsky',
                    url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
                })
            })

            it('it can be made important', function () {
                cy.get('.blog')
                cy.contains('The Joel Test: 12 Steps to Better Code Joel Spolsky')
                cy.contains('view')
            })

            it('it can be viewed showing more details', function () {
                cy.get('.blog-viewButton').contains('view')
                cy.get('.blog-viewButton').click()
                cy.get('.blog-url').contains('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
                cy.get('.blog-likes').contains('0')
                cy.get('.blog-likeButton').contains('like')
                cy.get('.blog-username').contains('Matti Luukkainen')
                cy.get('.blog-deleteButton').contains('remove')
            })

            it('and the extra details can be hidden', function () {
                cy.get('.blog-viewButton').contains('view')
                cy.get('.blog-viewButton').click()
                cy.get('.blog-url').contains('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
                cy.get('.blog-likes').contains('0')
                cy.get('.blog-likeButton').contains('like')
                cy.get('.blog-username').contains('Matti Luukkainen')
                cy.get('.blog-deleteButton').contains('remove')
                cy.get('.blog-viewButton').contains('hide')
                cy.get('.blog-viewButton').click()
                cy.get('.blog-likes').should('not.exist')
                cy.get('.blog-likeButton').should('not.exist')
                cy.get('.blog-username').should('not.exist')
            })

            it('it can be liked', function () {
                cy.get('.blog-viewButton').click()
                cy.get('.blog-likes').contains('0')
                cy.get('.blog-likeButton').click()
                cy.get('.blog-likes').contains('1')
            })

            it('it can be removed', function () {
                cy.get('.blog-viewButton').click()
                cy.get('.blog-deleteButton').click()
                cy.get('.blog').should('not.exist')
            })

            describe('logging in with another user', function () {
                beforeEach(function () {
                    cy.login({ username: 'salainen', password: 'mluukkai' })
                })

                it('remove button doesn\'t exist for another user who is not author', function () {
                    cy.get('.blog').should('exist')
                    cy.get('.blog-viewButton').click()
                    cy.get('.blog-deleteButton').should('not.exist')
                })
            })

            describe('and another blog exists', function () {
                beforeEach(function () {
                    cy.createBlogWithLikes({
                        title: 'The Joel Test: 15 Steps to Better Code',
                        author: 'Joel Spolsky',
                        url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
                        likes: 15,
                    })
                    cy.createBlogWithLikes({
                        title: 'The Joel Test: 20 Steps to Better Code',
                        author: 'Joel Spolsky',
                        url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
                        likes: 20,
                    })

                    cy.get('.blog-viewButton').then(btn => {
                        btn.click()
                    })
                })

                it('checks blogs are ordered by likes', function () {
                    cy.get('.blog').then(blogs => {
                        for (let i = 0; i < blogs.length; i++) {
                            console.log('i:', i, blogs.find('.blog-likes-value')[i])

                            if (i < blogs.length - 1) {
                                expect(Number(blogs.find('.blog-likes-value')[i].innerText),).to.be.at.least(Number(blogs.find('.blog-likes-value')[i + 1].innerText),)
                            } else {
                                const lastIndex = blogs.length - 1;
                                for (let i = lastIndex; i > 0; i--) {
                                    expect(Number(blogs.find('.blog-likes-value')[i].innerText),).to.be.lessThan(Number(blogs.find('.blog-likes-value')[i - 1].innerText))
                                }
                            }
                        }
                    })
                })
            })

            it('logout', function () {
                cy.get('.app-logoutButton').click()
                cy.contains('log in to application')
                cy.get('#loginbutton-main').contains('log in')
            })
        })
    })
})