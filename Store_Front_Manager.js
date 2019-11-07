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

let managerOptions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View Products for Sale':
                viewAllProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

let viewAllProducts = () => {
    connection.query('SELECT ProductID, ProductName, Price, StockQuantity FROM `Products`', (error, results, fields) => {
        if (error) throw error;
        let headers = ['ProductID', 'ProductName', 'Price', 'StockQuantity'];
        let rows = [];
        results.forEach((result) => {
            rows.push([result.ProductID, result.ProductName, result.Price, result.StockQuantity]);
        });
        printTable(headers, rows);
        connection.end();
    });
}

let viewLowInventory = () => {
    connection.query('SELECT ProductID, ProductName, Price, StockQuantity FROM `Products` WHERE StockQuantity < 5', (error, results, fields) => {
        let headers = ['ProductID', 'ProductName', 'Price', 'StockQuantity'];
        let rows = [];
        results.forEach((result) => {
            rows.push([result.ProductID, result.ProductName, result.Price, result.StockQuantity]);
        });
        printTable(headers, rows);
        connection.end();
    });
}

let addToInventory = () => {
    inquirer.prompt([
        {
            name: 'id',
            message: 'What is the ID of the product you would like to update?'
        },
        {
            name: 'quantity',
            message: 'How many are you adding?'
        }
    ]).then((response) => {
        connection.query('SELECT StockQuantity FROM `Products` WHERE ProductID = ' + response.id, (error, results, fields) => {
            if (error) throw error;
            let quantityToAdd = parseInt(results[0].StockQuantity) + parseInt(response.quantity);
            connection.query('UPDATE Products SET StockQuantity = ? WHERE ProductID = ?', [quantityToAdd, response.id], (error, results, fields) => {
                if (error) throw error;
                connection.end();
            });
        });
    });
}

let addNewProduct = () => {
    inquirer.prompt([
        {
            name: 'name',
            message: 'What is the name of the product you are adding?'
        },
        {
            name: 'department',
            message: 'What department is the product in?'
        },
        {
            name: 'price',
            message: "What is the product's price?"
        },
        {
            name: 'quantity',
            message: 'What is the quantity you are adding to the inventory?'
        }
    ]).then((response) => {
        connection.query('INSERT INTO `Products` (ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?)', 
            [response.name, response.department, response.price, response.quantity], function (error, results, fields) {
                if (error) throw error;
                console.log(response.quantity + ' ' + response.name + 's successfully added to the inventory.');
                connection.end();
        });
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

managerOptions();
