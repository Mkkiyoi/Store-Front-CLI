// Node Module Imports
let inquirer = require('inquirer');
require('dotenv').config();
let keys = require('./keys');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: keys.CREDENTIALS.secret,
    database: "Store_Front_DB"
});
  
connection.connect((err) => {
    if (err) throw err;
});

connection.query('SELECT ProductID, ProductName, Price FROM `Products`', (error, results, fields) => {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    console.log('ID     Product                 Price')
    console.log('------------------------');
    results.forEach((result) => {
        console.log(result.ProductID + '      ' + result.ProductName + '                  ' + result.Price);
        console.log('------------------------')
    });
    promptUser();
});

let promptUser = () => {
    inquirer.prompt([
        {
            name: 'id',
            message: 'What is the ID of the product you would like to purchase?'
        },
        {
            name: 'quantity',
            message: 'How many would you like to buy?'
        }
    ]).then((response) => {
        let queryStr = 'SELECT ProductName, Price, StockQuantity FROM `Products` WHERE ProductID = ' + response.id;
        connection.query(queryStr, (error, results, fields) => {
            if (error) throw error;
    
            let productQuantityLeft = results[0].StockQuantity - response.quantity;
            if (productQuantityLeft >= 0) {
                updateQuery(connection, response.id, productQuantityLeft);
                console.log('You bought ' + response.quantity + ' ' + results[0].ProductName + 's for \$' + results[0].Price * response.quantity);
            } else {
                console.log('Insufficient quantity left!')
            }
            connection.end();
        });
    });
}


// let selectQuery = (connection, id) => {
    
// }

let updateQuery = (connection, id, quantity) => {
    connection.query('UPDATE Products SET StockQuantity = ? WHERE ProductID = ?', [quantity,id], (error, results, fields) => {
        if (error) throw error;
    });
}