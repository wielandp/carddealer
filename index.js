const Discord = require("discord.js");
const { config } = require("dotenv");

const Client = new Discord.Client({
    disableEveryone: true
});

config({
    path: __dirname + "/.env"
});

var users = [];
var solve;

Client.on("ready", () => {
    console.log(`I'm online. My name is ${Client.user.username}`);
});

Client.on("message", async message => {
    // console.log(`${message.author.username} said ${message.content}`)
    const prefix = "!";

    if (message.author.bot) return;
    if (!message.guild) {
        console.log("direct message");
        message.reply("Testbox sending any/random args to random players. Send \""+prefix+"help\" in channel with Testbot");
        return;
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/[ \n]+/g);
    const cmd = args.shift().toLowerCase();
    console.log("cmd="+cmd);
    // if (cmd === "ping") {
    //     const msg = await message.channel.send(`🏓 pong`);
    // } else 
    if (cmd === "list") {
        console.log("list:\n", users.map(u => u.username).join("\n"));            
        message.reply("Playing: "+users.length+"\n"+users.map(u => u.username).join("\n"));
    } else if (cmd === "publish") {
        message.reply("Solution: "+users.length+"\n"+solve);
    } else if (cmd === "init") {
        console.log("init: ");
        users = [];
        solve = "";            
    } else if (cmd === "remove") {
        console.log("remove: ", args[0]);
        var patt = new RegExp(args[0]);
        users = users.filter( e => patt.exec(e.username) === null);
    } else if (cmd === "send") {
        solve = "";            
        var uc = users.slice(); // make a copy of users
        while (uc.length > 0) { // while any users left
            ux = Math.floor(Math.random() * uc.length); // pic a random user
            console.log("username: "+uc[ux].username);
            var msg = "Nothing";
            if (args.length > 0) {
                msg = args[0];
                args.splice(0, 1);
            }
            uc[ux].send("Message from bot:\n"+msg);
            solve = solve + "@"+uc[ux].username+": " + msg+"\n";            
            uc.splice(ux, 1);
        }
    } else if (cmd === "sendrand") {
        solve = "";            
        var uc = users.slice(); // make a copy of users
        while (uc.length > 0) { // while any users left
            ux = Math.floor(Math.random() * uc.length); // pic a random user
            console.log("username: "+uc[ux].username);
            var msg = "Nothing";
            if (args.length > 0) {
                ax = Math.floor(Math.random() * args.length); // pic a random arg
                msg = args[ax];
                args.splice(ax, 1);
            }
            uc[ux].send("Message from bot:\n"+msg);
            solve = solve + "@"+uc[ux].username+": " + msg;            
            uc.splice(ux, 1);
        }
    } else if (cmd === "scan") {
        console.log("scan:");
        solve = "";            
        // if (message.member.permissions.missing("ADMINISTRATOR")) return;
        console.log("channel id "+message.channel.id+" "+message.channel.name);
        // console.log("guild "+message.guild.id+" "+message.guild.name);

        message.guild.members.fetch()
            .then(gmembers => {
                // console.log("gmembers", gmembers);
                gmembers.filter(gm => !gm.user.bot && gm.presence.status === 'online')
                    .map(gm => {
                        console.log(gm.user.username);
                        if (users.findIndex(u => u.username === gm.user.username) < 0) {
                            users.push(gm.user);
                        }
                    });
                message.reply("Playing: "+users.length+"\n"+users.map(u => u.username).join("\n"));
            })
            .catch(console.error);

        // console.log("channels "+message.guild.channels);
        // const channels = message.guild.channels.cache; //.filter(c => c.type === "voice");
        // for (const [channelID, channel] in channels) {
        //      console.log("channel id "+channelId+" "+channel.name);
        // };
    } else if (cmd === "help") {
        message.author.send("Testbot commands:\n"+
         "init: reset data\n"+
         "scan: find online users for playing (can run multiple times)\n"+
         "list: show all accepted users\n"+
         "remove: remove users from list (regexp)\n"+
         "send: send args to random users\n"+
         "sendrand: send randomly args to random users\n"+
         "publish: show list of users:args"
        );
    } else {
        message.author.send("Testbot: Unkown command: "+cmd+"\nSend \""+prefix+"\"help for list of commands");
    }
});

Client.login(process.env.TOKEN);