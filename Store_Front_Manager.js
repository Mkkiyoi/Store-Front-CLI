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

let viewAllProducts = () => {
    connection.query('SELECT ProductID, ProductName, Price, StockQuantity FROM `Products`', (error, results, fields) => {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        console.log('ID     Product                 Price     Quantity')
        console.log('------------------------');
        results.forEach((result) => {
            console.log(result.ProductID + '      ' + result.ProductName + '                  ' + result.Price + '     ' + result.StockQuantity);
            console.log('------------------------')
        });
        promptUser();
    });
}

