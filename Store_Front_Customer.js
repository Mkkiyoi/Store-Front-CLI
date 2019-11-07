// Node Module Imports
let inquirer = require('inquirer');
require('dotenv').config();
let keys = require('./keys');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.CREDENTIALS.secret,
    database: "StoreFrontDB"
});
  
connection.connect((err) => {
    if (err) throw err;
});

connection.query('SELECT ProductID, ProductName, Price FROM `Products`', (error, results, fields) => {
    let headers = ['ProductID', 'ProductName', 'Price'];
    let rows = [];
    results.forEach((result) => {
        rows.push([result.ProductID, result.ProductName, result.Price]);
    });
    printTable(headers, rows);
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
        let queryStr = 'SELECT ProductName, Price, StockQuantity, ProductSales FROM `Products` WHERE ProductID = ' + response.id;
        connection.query(queryStr, (error, results, fields) => {
            if (error) throw error;
    
            let productQuantityLeft = parseInt(results[0].StockQuantity) - parseInt(response.quantity);
            let newProductSales = results[0].ProductSales + (results[0].Price * response.quantity);
            if (productQuantityLeft >= 0) {
                updateQuery(connection, response.id, productQuantityLeft, newProductSales);
                console.log('You bought ' + response.quantity + ' ' + results[0].ProductName + 's for \$' + results[0].Price * response.quantity);
            } else {
                console.log('Insufficient quantity left!')
            }
            connection.end();
        });
    });
}

let updateQuery = (connection, id, quantity, newProductSales) => {
    connection.query('UPDATE Products SET StockQuantity = ?, ProductSales = ? WHERE ProductID = ?', [quantity, newProductSales, id], (error, results, fields) => {
        if (error) throw error;
    });
}

let printTable = (headers, rows) => {
    let Table = require('cli-table');
    let table = new Table({
        head: headers,
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    rows.forEach((row) => {
        table.push(row);
    });
    
    console.log(table.toString());
}