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

let supervisorOptions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Choose an option:',
            choices: [
                'View Product Sales by Department',
                'Create New Department',
                'Exit'
            ]
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View Product Sales by Department':
                viewProductSalesByDepartment();
                break;
            case 'Create New Department':
                createDepartment();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

let viewProductSalesByDepartment = () => {
    connection.query('SELECT d.DepartmentID, d.DepartmentName, d.OverHeadCosts, SUM(p.ProductSales) AS ps, (SUM(p.ProductSales) - d.OverHeadCosts) AS TotalProfit FROM Departments AS d JOIN Products AS p ON d.DepartmentID = p.DepartmentID GROUP BY d.DepartmentID', 
        function (error, results, fields) {
            if (error) throw error;
            let headers = ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit'];
            let rows = [];
            results.forEach((result) => {
                rows.push([result.DepartmentID, result.DepartmentName, result.OverHeadCosts, result.ps, result.TotalProfit]);
            });
            printTable(headers, rows);
            connection.end();
        });
}

let createDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            message: 'What is the name of the department you are adding?'
        },
        {
            name: 'cost',
            message: 'What is the overhead cost of this department?'
    }]).then((response) => {
        connection.query('INSERT INTO `Departments` (DepartmentName, OverHeadCosts) VALUES (?, ?)', 
            [response.name, response.cost], function (error, results, fields) {
                if (error) throw error;
                console.log(response.name + ' ' + ' department' + ' successfully added.');
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

supervisorOptions();