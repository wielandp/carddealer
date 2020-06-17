const Discord = require("discord.js");
const { config } = require("dotenv");

const Client = new Discord.Client({
    disableEveryone: true
});

config({
    path: __dirname + "/.env"
});

var channels = [];  // map channel => { users: [], solve: string }
var users;
var solve;

Client.on("ready", () => {
    console.log(`I'm online. My name is ${Client.user.username}`);
});

Client.on("message", async message => {
    // console.log(`${message.author.username} said ${message.content}`)
    const prefix = "!";

    if (message.author.bot) return;

    console.log("content="+message.content);
    const args = message.content.slice(prefix.length).trim().split(/[ \n]+/g);
    const cmd = args.shift().toLowerCase();
    console.log("cmd="+cmd);

    if (!message.guild) {   // not to channel? so direct
        console.log("direct message");
        if (!message.content.startsWith(prefix)) {
            message.reply("Testbox sending any/random args to random players. Send \""+prefix+"help\" in channel with Testbot");
            return;
        }

        if (cmd === "hide") {
            console.log("hide: ", args.join(" "));
            message.reply("Got: "+args.join(" "));

            for (const [channel, ci] of Object.entries(channels)) {
                console.log(channel, ci);
                ci.users.forEach(user => {
                    console.log("user: ", user);
                    console.log("userid: ", user.id);
                    if (user.id == message.author.id) {
                        ci.solve = ci.solve + "@"+user.username+": " +args.join(" ")+"\n";
                    }
                });
            }
        }
        return;
    }

    // channel message
    if (!message.content.startsWith(prefix)) return;       // ignore if not cmd

    var ci = channels[""+message.channel.id];
    if (!ci) {     // force string for map
        ci = channels[""+message.channel.id] = { users: [], solve: "" };    // create if new
    }
    // users = ci.users;    // copy by reference
    // solve = ci.solve;    // copy by reference

    if (cmd === "list") {
        console.log("list:\n", ci.users.map(u => u.username).join("\n"));
        message.reply("Playing: "+ci.users.length+"\n"+ci.users.map(u => u.username).join("\n"));
    } else if (cmd === "publish") {
        message.reply("Solution: "+ci.users.length+"\n"+ci.solve);
    } else if (cmd === "init") {
        console.log("init: ");
        ci.users = [];
        ci.solve = "";
    } else if (cmd === "remove") {
        console.log("remove: ", args[0]);
        var patt = new RegExp(args[0]);
        ci.users = ci.users.filter( e => patt.exec(e.username) === null);
    } else if (cmd === "send") {
        ci.solve = "";
        var uc = ci.users.slice(); // make a copy of users
        while (uc.length > 0) { // while any users left
            ux = Math.floor(Math.random() * uc.length); // pic a random user
            console.log("username: "+uc[ux].username);
            var msg = "Nothing";
            if (args.length > 0) {
                msg = args[0];
                args.splice(0, 1);
            }
            uc[ux].send("Message from bot:\n"+msg);
            ci.solve = ci.solve + "@"+uc[ux].username+": " + msg+"\n";
            uc.splice(ux, 1);
        }
    } else if (cmd === "sendrand") {
        ci.solve = "";
        var uc = ci.users.slice(); // make a copy of users
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
            ci.solve = ci.solve + "@"+uc[ux].username+": " + msg;
            uc.splice(ux, 1);
        }
    } else if (cmd === "scan") {
        console.log("scan:");
        ci.solve = "";
        
        console.log("channel id "+message.channel.id+" "+message.channel.name);
        console.log("guild "+message.guild.id+" "+message.guild.name);

        message.guild.members.fetch()
            .then(gmembers => {
                // console.log("gmembers", gmembers);
                gmembers.filter(gm => !gm.user.bot && gm.presence.status === 'online')
                    .map(gm => {
                        console.log(gm.user.username);
                        if (ci.users.findIndex(u => u.username === gm.user.username) < 0) {
                            ci.users.push(gm.user);
                        }
                    });
                message.reply("Playing: "+ci.users.length+"\n"+ci.users.map(u => u.username).join("\n"));
            })
            .catch(console.error);
    } else if (cmd === "help") {
        message.author.send("Testbot channel commands:\n"+
         "init: reset data\n"+
         "scan: find online users for playing (can run multiple times)\n"+
         "list: show all accepted users\n"+
         "remove: remove users from list (regexp)\n"+
         "send: send args to random users\n"+
         "sendrand: send randomly args to random users\n"+
         "publish: show list of users:args"+
         "\n\nTestbot direct commands:\n"+
         "hide: send secret to bot"
        );
    } else {
        message.author.send("Testbot: Unkown command: "+cmd+"\nSend \""+prefix+"\"help for list of commands");
    }
});

Client.login(process.env.TOKEN);