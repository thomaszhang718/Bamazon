
CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE `Products` (
  `ItemID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(100) DEFAULT NULL,
  `DepartmentName` varchar(100) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `StockQuantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Bamazon`.`Products` (`ProductName`, `DepartmentName`, `Price`, `StockQuantity`) 
VALUES ('MESHA 12 Inches Assorted Color Party Balloons (144 Pcs)', 'Toys & Games', '9.99', '150'),
('Exploding Kittens: NSFW Edition (Explicit Content)', 'Toys & Games', '19.99', '44'),
('Logitech M510 Wireless Mouse', 'Electronics', '20.99', '814'),
('Ultra Thin Soft Silicone Keyboard Protector Cover Skin', 'Electronics', '8.90', '76'),
('Inova CB-R Translucent Microlight', 'Tools & Home Improvement', '6.99', '222'),
('TP-LINK N900 Wireless Dual Band PCI Express Adapter', 'Electronics', '34.72', '375'),
('Star Wars Mens Chewbacca Graphic Tank Top', 'Clothing', '15.79', '12'),
('SteelSeries QcK+ Gaming Mouse Pad (Black)', 'Office Products', '12.90', '502'),
('Logitech HD Pro Webcam C920', 'Electronics', '59.99', '129'),
('Pirate Eye Patch w/Plastic Gold Earring Party Accessory', 'Event & Party Supplies', '5.28', '4');

Select * FROM Products;