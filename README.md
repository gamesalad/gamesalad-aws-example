# Example for using GameSalad Network Behaviors w/ AWS API Gateway +  Lambda + DynamoDB

This is an example project showing how to use the Amazon API Gateway, Lambda, and DynamoDB as a serverless solution
for storing GameSalad game state.

## Project
### gameproj
Contains the AWSLambda GameSalad Game Project.  This project is a simple "game" where a player clicks on the screen 
to move their avatar.  Once they have clicked, their move is complete and the move cooridinates are sent to the server.
Player 1 is then set to polling mode, occasionally polling the server for the next move.  

Player 2 meanwhile has been polling the server for a game update. Once it sees one, it will move Player 1's avatar on
Player 2's screen and then enable Player 2 to move. Player 2 clicks somewhere on the screen, completing their own turn. 
Player 2 sends the updated game state to the server.

And the cycle repetas.


### src/api-gateway
Each file is a Velocity Template File (https://velocity.apache.org/engine/releases/velocity-1.5/vtl-reference-guide.html)
These are ment to be uses as Mapping Templates for the Amazon API Gateway service. 
Mapping templates take the input to the API and transform the input
into a format friendly for the next layer, in this case a Amazon Lambda event handler.

The "get-mapping.vtl" file handles the mapping for the "GET" request.
The "post-mapping.vtl" file handles the mapping for the "POST" request.

### src/lambda
The index.js file is an Amazon lambda event handler. The API Gateway will send an "event" object to the 
lambda event handler (the one that resulting from the velocity template mapping).  In this case we made a single 
event handler for both storage and retrieval of game state. We're simply taking what GameSalad gives us and
storing it in the db.  A real game would likely do some processing based on the game state as well as some kind
of verification to make sure a user isn't cheating or taking a turn out of sync by mistake.
