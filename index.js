var AWS = require('aws-sdk');
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());
require('dotenv');

AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
});

var dynamodb = new AWS.DynamoDB();
app.get('/read', (req, res) => {
    let params = {
        TableName: '<Table-Name>',
    }
    dynamodb.scan(params, (err, data) => {
        if (err) console.log("error is : ", err.stack); // an error occurred
        else {
            console.log("data is : ", data);
            res.json(data)
        }
    });
})

app.post('/create', (req, res) => {
    var params1 = {
        TableName: '<Table-Name>',
        Item: {
            phone_number: {
                S: req.body.phone_number
            },
            first_name: {
                S: req.body.first_name
            },
            last_name: {
                S: req.body.last_name
            }
        }
    }
    dynamodb.putItem((params1), (err, data) => {
        if (err) console.log("err is : ", err.stack);
        else {
            console.log("Created data is :", data);
            res.json(data)
        }
    })
})

app.put('/update', (req, res) => {
    var params = {
        ExpressionAttributeNames: {
            "#LN": "last_name"
        },
        ExpressionAttributeValues: {
            ":l": {
                S: req.body.last_name
            }
        },
        Key: {
            phone_number: {
                S: req.body.phone_number
            }
        },
        ReturnValues: "ALL_NEW",
        TableName: '<Table-Name>',
        UpdateExpression: "SET #LN = :l"
    };
    dynamodb.updateItem(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data)
            res.json(data)
        }
    });
})

app.delete('/delete', (req, res) => {
    // for delete a resource we just need a primary key
    var params = {
        TableName: '<Table-Name>',
        Key: {
            phone_number: {
                S: req.body.phone_number
            }
        }
    }
    dynamodb.deleteItem(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.json(data)
        }
    })
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})


//                                                      One bonus Operation
////////////////
/// Writing into more than one table


// var params = {
//     RequestItems: {
//         "<1st-Table-Name>": [
//             {
//                 PutRequest: {
//                     Item: {
//                         phone_number: {
//                             S: '+9231122334'
//                         },
//                         first_name: {
//                             S: 'George'
//                         },
//                         last_name: {
//                             S: 'Empty'
//                         }
//                     }
//                 }
//             }
//         ],
//         "<2nd-Table-Name>": [
//             {
//                 PutRequest: {
//                     Item: {
//                         phone_number: {
//                             S: '+9231122334'
//                         },
//                         first_name: {
//                             S: 'George'
//                         },
//                         last_name: {
//                             S: 'Empty'
//                         },
//                     }
//                 }
//             }
//         ]

//     }
// };
// dynamodb.batchWriteItem(params, function (err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else console.log(data)
// })
