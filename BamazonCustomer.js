//Add dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');

//Create connection variable for mysql connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root", //Your username
	password: "root", //Your password
	database: "bamazon"
});

//Connect to localhost server and log id
connection.connect(function(err) {
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
});

//Adding a cariable for current total for their cart
var currentTotal = 0;

//Creating our main function. We pass in a parameter called previousBalance for the cost of the items already selected
mainFunc = function(previousBalance) {

    //updating the current total, parseFloat just in case to keep as a number
    currentTotal = parseFloat(previousBalance);

    //Welcome messages
    console.log("Welcome to Bamazon, we're definitely not Amazon!");
    console.log("Check out our available products below: \n");

    //This connection is to grab the column names and display them at the top
    connection.query('SHOW COLUMNS FROM products', function(err, res) {
        if (err) throw err;
        //console.log(res);
        console.log(res[0].Field + " |                         " + res[1].Field + "                         |       " + res[2].Field + "       |  " + res[3].Field + "  |  " + res[4].Field);
    });

    //This connection grabs the data from the table and displays it
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        //console.log(res);

        //I tried a for loop initially but the spacing was terrible and didn't match the column heads. I couldn't figure out how to space it with set lengths for each column, so I just spaced it manually for now
        //for (i=0; i < res.length; i++) {
            //console.log("   " + res[i].ItemID + "   " + res[i].ProductName + "   " + res[i].DepartmentName + "   " + res[i].Price + "   " + res[i].StockQuantity); 
        //} 

        //Not sure how to align my data up nicely, but did it manually just for appearances in Node
        console.log("   " + res[0].ItemID + "   |  " + res[0].ProductName + "    |  " + res[0].DepartmentName + "              |  $" + res[0].Price + "  |  " + res[0].StockQuantity);
        console.log("   " + res[1].ItemID + "   |  " + res[1].ProductName + "         |  " + res[1].DepartmentName + "              |  $" + res[1].Price + " |  " + res[1].StockQuantity);
        console.log("   " + res[2].ItemID + "   |  " + res[2].ProductName + "                               |  " + res[2].DepartmentName + "               |  $" + res[2].Price + " |  " + res[2].StockQuantity);
        console.log("   " + res[3].ItemID + "   |  " + res[3].ProductName + "     |  " + res[3].DepartmentName + "               |  $" + res[3].Price + "   |  " + res[3].StockQuantity);
        console.log("   " + res[4].ItemID + "   |  " + res[4].ProductName + "                          |  " + res[4].DepartmentName + "  |  $" + res[4].Price + "  |  " + res[4].StockQuantity);
        console.log("   " + res[5].ItemID + "   |  " + res[5].ProductName + "        |  " + res[5].DepartmentName + "               |  $" + res[5].Price + " |  " + res[5].StockQuantity);
        console.log("   " + res[6].ItemID + "   |  " + res[6].ProductName + "                  |  " + res[6].DepartmentName + "                  |  $" + res[6].Price + " |  " + res[6].StockQuantity);
        console.log("   " + res[7].ItemID + "   |  " + res[7].ProductName + "                  |  " + res[7].DepartmentName + "           |  $" + res[7].Price + "  |  " + res[7].StockQuantity);
        console.log("   " + res[8].ItemID + "   |  " + res[8].ProductName + "                                |  " + res[8].DepartmentName + "               |  $" + res[8].Price + " |  " + res[8].StockQuantity);
        console.log("   " + res[9].ItemID + "  |  " + res[9].ProductName + "    |  " + res[9].DepartmentName + "    |  $" + res[9].Price + "  |  " + res[9].StockQuantity);

        console.log("\n");

        //Call the promptFunc to ask the questions on what they want to purchase after displaying the current inventory
        promptFunc();

    })

};

//Creating our promptFunc which asks the user what item and quantity they would like to buy
promptFunc = function() {

    //Use inquirer to ask what item they want to purchase and the amount
    inquirer.prompt([{
        name: "item",
        message: "Would item would you like to purchase? Please enter the item ID.",
        //Validate that the id they enter is a number
        validate: function(value) {
                    if (isNaN(value) == false && parseInt(value) > 0 && parseInt(value) <= 10) {
                        return true;
                    } else {
                        return false;
                    }
        }
    }, {
        name: "amount",
        message: "How many would you like to purchase?",
        //Validate that the quantity they enter is positive
        validate: function(value) {
            if (isNaN(value) == false && parseInt(value) > 0) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answers) {
            
            //After the then, we connect to the server again
            connection.query('SELECT * FROM products', function(err, res) {
                if (err) throw err;

                //Grab the stock remaining value from database
                var stockRemaining = res[answers.item - 1].StockQuantity;

                    //If the stock remaining is greater than or equal to the amount requested for purchase, proceed
                    if (stockRemaining >= answers.amount) {

                        //Calculate the new stockRemaining
                        var stockRemaining = stockRemaining - answers.amount;

                        //Calculate the cost of the items purchased and then set to CurrentTotal
                        currentTotal = parseFloat(currentTotal + answers.amount*res[answers.item - 1].Price).toFixed(2);

                        //Update the values in database from what the user picked
                        connection.query("UPDATE products SET ? WHERE ?", [{
                            StockQuantity: stockRemaining
                        }, {
                            ItemID: answers.item
                        }], function(err, res) {

                            //Log the total cost of the order so far
                            console.log("Total cost of your order: $" + currentTotal + "\n");

                            //Call the mainFunc again to go back to beginning, with updated values
                            mainFunc(currentTotal);
                        })                        

                    //Let the user know if they cannot purchase that many items, then call mainFunc again to start over
                    } else {
                        console.log("You can't buy that many. Insufficient Quantity!\n");
                        mainFunc(currentTotal);
                    }
            })
    })
};

//Call the function, making the previous balance of 0 since this is the customer's first start
mainFunc(0);

//connection.end();
