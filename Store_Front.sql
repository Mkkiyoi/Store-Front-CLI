DROP DATABASE IF EXISTS Store_Front_DB;

CREATE DATABASE Store_Front_DB;

USE Store_Front_DB;

CREATE TABLE Products (
    ProductID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ProductName VARCHAR(30) NOT NULL,
    DepartmentName VARCHAR(30) NOT NULL,
    Price DECIMAL(8,2) NOT NULL,
    StockQuantity INT NOT NULL
);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES
('Wrench', 'Tools', '9.99', 20),
('Screwdriver', 'Tools', '10.99', 15),
('AirPod Pro', 'Electronics', '249.00', 1000),
('King Sized Bed', 'Furniture', '9999.99', 5),
('Apple', 'Food', '1.99', 30),
('Bread', 'Food', '3.99', 40),
('Drill', 'Tools', '49.99', 10),
('Chair', 'Furniture', '29.99', 20),
('Razer Blade Stealth', 'Electronics', '1399.99', 20),
('Better Wrench', 'Tools', '999999.99', 3);

SELECT ProductName, StockQuantity FROM Products WHERE ProductID = 3
SELECT * FROM Products;