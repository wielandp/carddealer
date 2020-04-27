# carddealer
Simple Discord bot example to run yourself

# Setup
- install node.js (from nodejs.org)
- clone this project: git clone https://github.com/wielandp/carddealer.git
- cd carddealer
- run npm init (in mybot dir)
- npm install discord.js
- get bot-token from https://discordapp.com/developers/applications
- get OAuth2-URL (scope bot) from same site and open it in browser to invite bot
- rename .env-sample to .env and insert your bot-token
- run: node index.js

# Usage
- send "!scan" in any channel of your invited guild. Returns list of users
- run again !scan to get online users on the list
- run !list to show the current list of users
- run "!remove username" in case any user should not play
- run "!send A B C ..." to send the cards seperated by space or newline
    each user gets one card (in this order) as direct message
- run "!sendrand A B C ..." to mix the card before sending.
     Important when there are more cards than users.
- run !publish to show the cards of all users in the channel
- run !init to reset the userlist for the channel