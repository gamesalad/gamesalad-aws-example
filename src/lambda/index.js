console.log("Loading Game State API");
var doc = require("dynamodb-doc");
var dynamo = new doc.DynamoDB();

exports.handler = function(event, context) {

  // Debugging code to see what gets passed in as part of the event.
  console.log(event.GameID);
  console.log(event.params);

  // The AWS API Gateway parameters include an "operation" to describe what API endpoint was hit.
  // We want to take note of this, but delete it from the event object since we don't need it later.
  var operation = event.operation;
  delete event.operation;

  // The operation decides what we do with event payload.
  switch(operation) {
    // Update the database with the new game state.
    case 'update':
      var params = {
        TableName: "GameState",
        Item: {
          GameID: event.GameID,
          StateTable: event.params
        }
      };

      // Update the database with our game state. GameID is the DynamoDB key, so if it exist it will overwrite.
      dynamo.putItem(params, function(err, data) {
        if (err) {
          context.done(null, {"Status":"Fail", "Reason": err, "Event": event});
        } else {
          context.done(null, {"Status":"Success"});
        }
      });

      break;

    // Read the new game state from the database.
    case 'read':
      var params = {
        TableName: "GameState",
        Key: {
          GameID: event.GameID
        }
      };

      dynamo.getItem(params, function(err, data) {
        if (err) {
          context.done(null, {"Status":"Fail", "Reason": err, "Event": event});
        } else {
          context.done(err, JSON.parse(data.Item.StateTable));
        }
      });
      break;

    default:
      context.fail(new Error("Unrecognized operation '" + operation + "'" ));
  }
};