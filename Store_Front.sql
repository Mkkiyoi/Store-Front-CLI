DROP DATABASE IF EXISTS StoreFrontDB;

CREATE DATABASE StoreFrontDB;

USE StoreFrontDB;

CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    DepartmentName VARCHAR(30) NOT NULL,
    OverHeadCosts DECIMAL(8,2) NOT NULL
);

CREATE TABLE Products (
    ProductID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ProductName VARCHAR(30) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL,
    ProductSales DECIMAL(10,2) NOT NULL,
    DepartmentID INT NOT NULL,
    CONSTRAINT FK_DepartmentID FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

INSERT INTO Departments (DepartmentName, OverHeadCosts)
VALUES
('Tools', 999999.99),
('Electronics', 10000.00),
('Food', 12345.67),
('Furniture', 10.00);

INSERT INTO Products (ProductName, DepartmentID, Price, StockQuantity)
VALUES
('Wrench', 1, '9.99', 20),
('Screwdriver', 1, '10.99', 15),
('AirPod Pro', 2, '249.00', 1000),
('King Sized Bed', 4, '9999.99', 5),
('Apple', 3, '1.99', 30),
('Bread', 3, '3.99', 40),
('Drill', 1, '49.99', 10),
('Chair', 4, '29.99', 20),
('Razer Blade Stealth', 2, '1399.99', 20),
('Better Wrench', 1, '999999.99', 3);



SELECT ProductName, StockQuantity FROM Products WHERE ProductID = 3
SELECT * FROM Products;