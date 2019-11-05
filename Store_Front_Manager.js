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
        }
    });
}

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
        connection.end();
    });
}

let viewLowInventory = () => {
    connection.query('SELECT ProductID, ProductName, Price, StockQuantity FROM `Products` WHERE StockQuantity < 5', (error, results, fields) => {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        console.log('ID     Product                 Price     Quantity')
        console.log('------------------------');
        results.forEach((result) => {
            console.log(result.ProductID + '      ' + result.ProductName + '                  ' + result.Price + '     ' + result.StockQuantity);
            console.log('------------------------')
        });
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

managerOptions();
