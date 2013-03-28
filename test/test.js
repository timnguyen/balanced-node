//===========================================================================
// FILE: test.js
//
// DESCRIPTION:
//    unit tests
//
// HISTORY:
//    Created: 3/26/13 Chad Scharf
//===========================================================================
/**
 * Unit tests
 * //TODO: Implement assert statements and get a more complete set of use cases for unit tests outside of happy path
 *
 * @name test
 */

var nbalanced = require("./../lib/nbalanced");

// ******************************************************************************************
// ******************************************************************************************
// WARNING: This will create a lot of "stuff" in your account, so only use a test marketplace
// ******************************************************************************************
// ******************************************************************************************
var api = new nbalanced({
    marketplace_uri: "/v1/marketplaces/:marketplace-id", // test marketplace
    secret: ":secret" // test secret
});

function series(callbacks, last) {
    var results = [];
    function next() {
        try {
            var callback = callbacks.shift();
            if(callback) {
                callback(function() {
                    results.push(Array.prototype.slice.call(arguments));
                    next();
                });
            } else {
                last(results);
            }
        }
        catch (e){
            console.error(e);
            last(results);
        }
    }
    next();
}

var myCard;
var myBankAccount;
var myVerification;
var myHold;
var myDebit;
var myRefund;
var myCredit;
var myAccount;
var myAccountBankAccount;

// Start our asynchronous dependency execution test chain
series([

    // ***********************************************************
    // Cards
    // ***********************************************************
    function (next) {
        api.Cards.create({
            card_number: "5105105105105100",
            expiration_year: 2020,
            expiration_month: 12,
            security_code: "123"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create", err);
                throw err;
            }
            myCard = object;
            console.log("Created new Card:", myCard.uri);
            next("api.Cards.create");
        });
    },
    function (next) {
        api.Cards.update(myCard.uri, {
            meta: {
                test: "my card test update metadata"
            }
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.update", err);
                throw err;
            }
            myCard = object;
            console.log("Updated Card:", myCard.uri);
            next("api.Cards.update");
        });
    },
    function (next) {
        api.Cards.get(myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Cards.get", err);
                throw err;
            }
            myCard = object;
            console.log("Retrieved Card:", myCard.uri);
            next("api.Cards.get");
        });
    },
    function (next) {
        api.Cards.list({
            limit: 20,
            offset: 0
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.list", err);
                throw err;
            }
            console.log("List Cards:", object.total, "total");
            next("api.Cards.list");
        });
    },
    function (next) {
        api.Cards.invalidate(myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Cards.invalidate", err);
                throw err;
            }
            myCard = object;
            console.log("Invalidated Card:", myCard.uri);
            next("api.Cards.invalidate");
        });
    },
    function (next) {
        api.Cards.create({
            card_number: "4111111111111111",
            expiration_year: 2018,
            expiration_month: 6,
            security_code: "456",
            name: "Stacey Ferrari"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create2", err);
                throw err;
            }
            myCard = object;
            console.log("Created another Card:", myCard.uri);
            next("api.Cards.create2");
        });
    },




    // ***********************************************************
    // Bank Accounts
    // ***********************************************************
    function (next) {
        api.BankAccounts.create({
            name: "Miranda Benz",
            account_number: "9900826301",
            routing_number: "121000359",
            type: "checking",
            meta: {
                info: "created another test account",
                test: true
            }
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create2", err);
                throw err;
            }
            myBankAccount = object;
            console.log("Created new Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.create2");
        });
    },
    function (next) {
        api.BankAccounts.delete(myBankAccount.uri, function (err) {
            if (err) {
                console.error("api.BankAccounts.delete", err);
                throw err;
            }
            console.log("Deleted Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.delete");
        });
    },
    function (next) {
        api.BankAccounts.create({
            name: "Jessica Maserati",
            account_number: "9900000001",
            routing_number: "121000358",
            type: "checking",
            meta: {
                info: "this is a test account",
                test: true
            }
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create", err);
                throw err;
            }
            myBankAccount = object;
            console.log("Created new Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.create");
        });
    },
    function (next) {
        api.BankAccounts.update(myBankAccount.uri, {
            meta: {
                additional_info: "All your bank are belong to us!",
                info: "I've been updated!"
            }
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.update", err);
                throw err;
            }
            myBankAccount = object;
            if (myBankAccount.meta.info == "I've been updated!") {
                console.log("Updated Bank Account:", myBankAccount.uri);
            } else {
                console.log("Updated Bank Account:", "[FAILED]", myBankAccount.uri);
            }
            next("api.BankAccounts.update");
        });
    },
    function (next) {
        api.BankAccounts.get(myBankAccount.uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.get", err);
                throw err;
            }
            myBankAccount = object;
            console.log("Retrieved Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.get");
        });
    },
    function (next) {
        api.BankAccounts.list(function (err, object) {
            if (err) {
                console.error("api.BankAccounts.list", err);
                throw err;
            }
            console.log("List Bank Accounts:", object.total, "total");
            next("api.BankAccounts.list");
        });
    },
    function (next) {
        api.BankAccounts.verify(myBankAccount.verifications_uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verify", myBankAccount.verifications_uri, " >> ", JSON.stringify(err));
                throw err;
            }
            myVerification = object;
            console.log("Verify Bank Account", myVerification.uri);
            next("api.BankAccounts.verify");
        });
    },
    function (next) {
        api.BankAccounts.verification(myVerification.uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verification", err);
                throw err;
            }
            myVerification = object;
            console.log("Retrieved Verification", myVerification.uri);
            next("api.BankAccounts.verification");
        });
    },
    function (next) {
        api.BankAccounts.verifications(myBankAccount.verifications_uri, {}, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verifications", err);
                throw err;
            }
            console.log("List Verifications:", object.total, "total");
            next("api.BankAccounts.verifications");
        });
    },
    function (next) {
        api.BankAccounts.confirm(myVerification.uri, 6, 2, function (err) {
            if (err) {
                console.log("Confirm:", err.description);
                next("api.BankAccounts.confirm.fail");
            } else {
                console.log("Confirm did not fail as expected");
                next("api.BankAccounts.confirm.fail");
            }
        });
    },
    function (next) {
        api.BankAccounts.confirm(myVerification.uri, 1, 1, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.confirm", err);
                throw err;
            }
            console.log("Confirm:", object.uri);
            next("api.BankAccounts.confirm");
        });
    },





    // ***********************************************************
    // Accounts
    // ***********************************************************
    function(next) {
        api.Accounts.create(function (err, object) {
            if (err) {
                console.error("api.Accounts.create", err);
                throw err;
            }
            myAccount = object;
            console.log("Created new Account:", myAccount.uri);
            next("api.Accounts.create");
        });
    },
    function(next) {
        api.Accounts.underwrite({
            type: "business",
            name: "Nikki's Porsche",
            phone_number: "+12025874411",
            tax_id: "215263254",
            postal_code: "90210",
            street_address: "123 Rodeo Drive"
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.underwrite", "business", err);
                throw err;
            }
            myAccount = object;
            console.log("Underwrite Account:", myAccount.uri);
            next("api.Accounts.underwrite.business");
        });
    },
    function(next) {
        api.Accounts.underwrite({
            type: "person",
            name: "Tabitha Royce",
            phone_number: "+15023335555",
            dob: "1981-12-01",
            postal_code: "90210",
            street_address: "123 Rodeo Drive"
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.underwrite", "person", err);
                throw err;
            }
            myAccount = object;
            // Create a new instance of our api client with our new account info
            api = api.Accounts.nbalanced(myAccount);
            console.log("Underwrite Account:", myAccount.uri);
            next("api.Accounts.underwrite.person");
        });
    },
    function (next) {
        api.Accounts.get(myAccount.uri, function (err, object) {
            if (err) {
                console.error("api.Accounts.get", err);
                throw err;
            }
            myAccount = object;
            console.log("Retrieved Account:", myAccount.uri);
            next("api.Accounts.get");
        });
    },
    function (next) {
        api.Accounts.list(function (err, object) {
            if (err) {
                console.error("api.Accounts.list", err);
                throw err;
            }
            console.log("List Accounts:", object.total, "total");
            next("api.Accounts.list");
        });
    },
    function (next) {
        api.Accounts.update(myAccount.uri, {
            description: "updated account description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.update", err);
                throw err;
            }
            myAccount = object;
            console.log("Updated Account:", myAccount.uri);
            next("api.Accounts.update");
        });
    },
    function (next) {
        api.Accounts.addCard(myAccount.uri, myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Accounts.addCard", err);
                throw err;
            }
            myAccount = object;
            console.log("Added Card to Account:", myAccount.uri);
            next("api.Accounts.addCard");
        });
    },
    /*
    function (next) {
        api.Accounts.addBankAccount(myAccount.uri, myBankAccount.uri, function (err, object) {
            if (err) {
                console.error("api.Accounts.addBankAccount", err);
                throw err;
            }
            myAccount = object;
            console.log("Added Bank Account to Account:", myAccount.uri);
            next("api.Accounts.addBankAccount");
        });
    },
    */
    function (next) {
        api.BankAccounts.create({
            name: "Veronica Lamborghini",
            account_number: "9900000001",
            routing_number: "121000358",
            type: "checking"
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create3", err);
                throw err;
            }
            myAccountBankAccount = object;
            console.log("Created new Bank Account:", myAccountBankAccount.uri);
            next("api.BankAccounts.create3");
        });
    },
    function (next) {
        api.BankAccounts.verify(myAccountBankAccount.verifications_uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verify2", myAccountBankAccount.verifications_uri, " >> ", JSON.stringify(err));
                throw err;
            }
            myVerification = object;
            console.log("Verify Bank Account", myVerification.uri);
            next("api.BankAccounts.verify2");
        });
    },
    function (next) {
        api.BankAccounts.confirm(myVerification.uri, 1, 1, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.confirm2", err);
                throw err;
            }
            console.log("Confirm:", object.uri);
            next("api.BankAccounts.confirm2");
        });
    },






    // ***********************************************************
    // Holds
    // ***********************************************************
    function (next) {
        api.Holds.create({
            amount: 10000,
            appears_on_statement_as: "HOLDS-R-US",
            source_uri: myCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Holds.create", err);
                throw err;
            }
            myHold = object;
            console.log("Created Hold:", myHold.uri);
            next("api.Holds.create");

        });
    },
    function (next) {
        api.Holds.get(myHold.uri, function (err, object) {
            if (err) {
                console.error("api.Holds.get", err);
                throw err;
            }
            myHold = object;
            console.log("Retrieved Hold:", myHold.uri);
            next("api.Holds.get");
        });
    },
    function (next) {
        api.Holds.list(function (err, object) {
            if (err) {
                console.error("api.Holds.list", err);
                throw err;
            }
            console.log("List Holds:", object.total, "total");
            next("api.Holds.list");
        });
    },
    function (next) {
        api.Holds.update(myHold.uri, {
            description: "updated hold description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Holds.update", err);
                throw err;
            }
            myHold = object;
            console.log("Updated Hold:", myHold.uri);
            next("api.Holds.update");
        });
    },
    function (next) {
        api.Holds.void(myHold.uri, function (err) {
            if (err) {
                console.error("api.Holds.void", err);
                throw err;
            }
            console.log("Void Hold:", myHold.uri);
            next("api.Holds.void");
        });
    },
    function (next) {
        api.Holds.create({
            amount: 10000,
            appears_on_statement_as: "HOLDS-R-US2",
            source_uri: myCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Holds.create2", err);
                throw err;
            }
            myHold = object;
            console.log("Created Hold:", myHold.uri);
            next("api.Holds.create2");

        });
    },






    // ***********************************************************
    // Debits
    // ***********************************************************
    function (next) {
        api.Debits.create({
            amount: 9800,
            hold_uri: myHold.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.create", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create");
        });
    },
    function (next) {
        api.Debits.create({
            amount: 20000,
            appears_on_statement_as: "TEST2CARD",
            description: "test debit on card",
            source_uri: myCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.create2", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create2");
        });
    },
    function (next) {
        api.Debits.refund(myDebit.uri, function (err, object) {
            if (err) {
                console.error("api.Debits.refund", err);
                throw err;
            }
            myRefund = object;
            console.log("Refunded Debit:", myRefund.uri);
            next("api.Debits.refund");
        });
    },
    function (next) {
        api.Debits.create({
            amount: 60000,
            appears_on_statement_as: "TEST2BANK",
            description: "test debit on bank account",
            source_uri: myAccountBankAccount.uri
        }, function (err, object) {
            if (err) {
                console.log("api.Debits.create3", myAccountBankAccount.uri);
                console.error("api.Debits.create3", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create3");
        });
    },
    function (next) {
        api.Debits.get(myDebit.uri, function (err, object) {
            if (err) {
                console.error("api.Debits.get", err);
                throw err;
            }
            console.log("Retrieved Debit:", object.uri);
            next("api.Debits.get");
        });
    },
    function (next) {
        api.Debits.list(function (err, object) {
            if (err) {
                console.error("api.Debits.list", err);
                throw err;
            }
            console.log("List Debits:", object.total, "total");
            next("api.Debits.list");
        });
    },
    function (next) {
        api.Debits.update(myDebit.uri, {
            description: "updated debit description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.update", err);
                throw err;
            }
            console.log("Updated Debit:", object.uri);
            next("api.Debits.update");
        });
    },







    // ***********************************************************
    // Credits
    // ***********************************************************
    function (next) {
        api.Credits.create({
            amount: 10000,
            bank_account: {
                routing_number: "121000358",
                account_number: "9900000001",
                type: "checking",
                name: "Jennifer Aston"
            }
        }, function (err, object) {
            if (err) {
                console.log("", err);
                throw err;
            }
            myCredit = object;
            console.log("api.Credits.create", myCredit.uri);
            next("api.Credits.create");
        });
    },
    function (next) {
        api.Credits.add(myAccountBankAccount.credits_uri, 10000, "Have some free money", function (err, object) {
            if (err) {
                console.error("api.Credits.add", err);
                throw err;
            }
            console.log("Credit Bank Account", object.uri);
            next("api.Credits.add");
        });
    },
    // This is here because we have to have money from a prior sequence before we can test this shortcut
    //  method on bandAccount.
     function (next) {
         api.BankAccounts.credit(myAccountBankAccount.credits_uri, 1000, "Have some free money", function (err, object) {
             if (err) {
                 console.error("api.BankAccounts.credit", err);
                 throw err;
             }
             console.log("Credit Bank Account", object.uri);
             next("api.BankAccounts.credit");
         });
    },
    // Now this should return something, exactly 1 credit hopefully.
    function (next) {
        api.BankAccounts.credits(myAccountBankAccount.credits_uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.credits", err);
                throw err;
            }
            console.log("Bank Account Credits", object.total, "total");
            next("api.BankAccounts.credits");
        });
    },
    function (next) {
        api.Credits.get(myCredit.uri, function (err, object) {
            if (err) {
                console.error("api.Credits.get", err);
                throw err;
            }
            console.log("Retrieved Credit:", object.uri);
            next("api.Credits.get");
        });
    },
    function (next) {
        api.Credits.list(function (err, object) {
            if (err) {
                console.error("api.Credits.list", err);
                throw err;
            }
            console.log("List Credits:", object.total, "total");
            next("api.Credits.list");
        });
    },





    // ***********************************************************
    // Refunds
    // ***********************************************************
    function (next) {
        api.Debits.create({
            amount: 20000,
            appears_on_statement_as: "TEST3CARD",
            description: "test debit on card",
            source_uri: myCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.create4", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create4");
        });
    },
    function (next) {
        api.Refunds.create(myDebit.uri, {
            description: "Customer is happy, but likes money too much",
            meta: {
                customer: "bob",
                is_wicket_smaht: true
            }
        }, function (err, object) {
            if (err) {
                console.log("api.Refunds.create", err);
                throw err;
            }
            myRefund = object;
            console.log("api.Refunds.create", myRefund.uri);
            next("api.Refunds.create");
        });
    },
    function (next) {
        api.Refunds.get(myRefund.uri, function (err, object) {
            if (err) {
                console.error("api.Refunds.get", err);
                throw err;
            }
            myRefund = object;
            console.log("Retrieved Refunds:", object.uri);
            next("api.Refunds.get");
        });
    },
    function (next) {
        api.Refunds.list(function (err, object) {
            if (err) {
                console.error("api.Refunds.list", err);
                throw err;
            }
            console.log("List Refunds:", object.total, "total");
            next("api.Refunds.list");
        });
    },
    function (next) {
        api.Refunds.update(myDebit.uri, {
            description: "updated refund description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Refunds.update", err);
                throw err;
            }
            console.log("Updated Refund:", object.uri);
            next("api.Refunds.update");
        });
    },




    // Default end sequence function, makes copy/paste easier w/ the commas
    function (next) {
        next("Sequence Complete");
    }


], function (results) {
    console.log("Done; completed the following tests:");
    console.log(results);
});
