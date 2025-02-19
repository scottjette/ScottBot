//Discord bot
//The end goal of this project is to create a bot to moderate a server with useful features.
//Will be hosted on a VPS, but before deployed should have code to cache data on close/periodically if possible.

//random todos:
//wanna refactor out the whole cmd is the first word and args are the rest, just work with the whole word array rather than splitting it up
//command to lock help commands to a specific channel. if i do this, then will need to track for channel changes to the server.
//make bot accept all friend requests for users privacy reasons

//Bot/Library vars
const token = require("./token.json");
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({});



//
//Instantiate command relevant variables below
//

//All this is being obsoleted. Need to find a way to create config file for each server for each new feature added.
//Saving code to make it easier to reintroduce features

//Gaslight vars 
//var gaslit = null;
//var glTimeout = null;

//Secret Santa vars
//var isSSactive = false;
//var SSDesc = "";
//var SSPlayerList = [];
//var SSTargetList = [];
//var SSGiftList = [];


//troint stuff
//var oldHours = 0;
//var playersList = []
//var currentAnswer = ""
//var questionsList = [];

class CharacterSheet
{
    constructor(username)
    {
        this.name = username
        this.health = 10;
        this.attack = 1;
        this.attackBonus = 0;
        this.inventory = []
    }

    //will need a way to serialize this object

    getHealth()
    {
        return this.health;
    }

    getAttackPower()
    {
        return this.attack + this.attackBonus;
    }

}

function getCharSheetByName(charList, un)
{
    console.log(`looking for ${un}`);
    for(cs in charList)
    {
        console.log(charList[cs]);
        if(charList[cs].name == un)
        {
            console.log("found");
            return charList[cs];
        }
    }
    return null
}

function randomDrop(charSheet)
{
    var num = Math.random();
    if(num < .05)
    {
        return "Troint";
    }
    if(num < .20)
    {
        if(charSheet.health < 10)
        {
            charSheet.health += 1;
        }
        return "Health Pack (+1hp)";
    }
    if(num < .35)
    {
        if(charSheet.health < 9)
        {
            charSheet.health += 2;
        }
        else
        {
            charSheet.health = 10;
        }
        return "Health Pack (+2hp)";
    }
    if (num < .4375)
    {
        charSheet.attackBonus = 1;
        return "Knife (+1atk)";
    }
    if (num < .5250)
    {
        charSheet.attackBonus = 1;
        return "Saw (+1atk)";
    }
    if (num < .6125)
    {
        charSheet.attackBonus = 1;
        return "Dagger (+1atk)";
    }
    if (num < .70)
    {
        charSheet.attackBonus = 1;
        return "Shank (+1atk)";
    }
    if (num < .775)
    {
        charSheet.attackBonus = 2;
        return "Machete (+2atk)";
    }
    if (num < .85)
    {
        charSheet.attackBonus = 2;
        return "Iron Rod (+2atk)";
    }
    if (num < .925)
    {
        charSheet.attackBonus = 2;
        return "Sickle (+2atk)";
    }
    if (num < 1)
    {
        charSheet.attackBonus = 2;
        return "Bow and Arrow (+2atk)";
    }
}

//occurs when bot hits "ready" state
bot.on("ready", async () =>
{
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("The troints will matter");

    //need to generalize this action beyond just my server. Additionally, it should save this if it goes offline, rather than initialize it every startup.
    //var membersWithRole = bot.guilds.get("263039543048011778").members.filter(member => { return member.roles.find("name", "Trontestant")}).map(member =>
    //    {
    //        console.log(`Adding ${member.user.username}`);
    //        playersList.push(new CharacterSheet(member.user.username));
    //        console.log(playersList);
    //    });
});


//should make these commands send embeds
//when a user joins
bot.on("guildMemberAdd", member => {
    member.guild.channels.get(botconfig.botchannel).send(`Welcome, ${member}. Ohio!`);
});

//when a user leaves
bot.on("guildMemberRemove", member => {
    member.guild.channels.get(botconfig.botchannel).send(`${member} left. We'll come back for you!!`);
})

bot.on("presenceUpdate", (oldMember, newMember) =>
{
    //this is a hacky way to check a random chance every so often. it assumes someone in the server will change presence at least once an hour.
    //that wakes this command up and it will check if its a new hour and a valid hour and will run the check
    //var h = new Date().getHours();
    //if(h != oldHours && h >= 12 && h < 22)
    //    {
    //        oldHours = h;
    //        if(Math.random() < .3)
    //        {
    //            if(questionsList.length > 0)
    //            {
    //                var curQuestion = Math.floor(Math.random() * questionsList.length);
    //                console.log(questionsList[curQuestion][0]);
    //                console.log(questionsList[curQuestion][1]);
    //               bot.guilds.get("263039543048011778").channels.get("697672130510192711").send(`An airtrop has appeared: ${questionsList[curQuestion][0]}`);
    //                currentAnswer = questionsList[curQuestion][1];
    //                questionsList.splice(curQuestion, 1);
    //            }
    //        }
    //   }

})

//when the bot gets a message notification
bot.on("message", async message => 
{
    //don't respond to bots
    if(message.author.bot) return;


    let tradPrefix = botconfig.tradPrefix;      //traditional command prefix
    let casPrefix = botconfig.casPrefix;        //casual command prefix
    let casQualifier = botconfig.casQualifier   //casual command prefix is 2 words, this will be a second check.
    let messageArray = message.content.split(" ");

    //split the message into words
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    
    //////////////////////
    //Put DM commands here
    //////////////////////
    if(message.channel.type === "dm")
    {
        //Need to generalize this process for multiple servers. May move it out of DMs and into a specific channel, bu i think dms is good
        //if(cmd == "addq")
        //{
        //    if(!messageArray.includes("|"))
        //    {
        //        message.channel.send("Invalid format");
        //        return;
        //    }
        //   var newQuestion = message.content.slice(5).split(" | ");
        //   console.log(`Adding ${newQuestion[0]}, ${newQuestion[1]}.`)
        //    questionsList.push(newQuestion);
        //    console.log(questionsList);
        //}


        //if(cmd == "listq")
        //{
        //    message.channel.send(`List of Questions: ${questionsList}`);
        //}

        //if(cmd == "setwp")
        //{
        //    console.log(getCharSheetByName(playersList, message.content.slice(6)));
        //    getCharSheetByName(playersList, message.content.slice(6)).attackBonus = 3;
            
        //}

        //if(cmd == "setwp2")
        //{
        //    console.log(getCharSheetByName(playersList, message.content.slice(7)));
        //    getCharSheetByName(playersList, message.content.slice(7)).attackBonus = 2;
            
        //}

        //if(cmd == "setwp1")
        //{
        //    console.log(getCharSheetByName(playersList, message.content.slice(7)));
        //    getCharSheetByName(playersList, message.content.slice(7)).attackBonus = 1;
            
        //}

        //if(cmd == "sethp")
        //{
        //    console.log(getCharSheetByName(playersList, message.content.slice(9)));
        //    console.log(messageArray[1]);
        //    getCharSheetByName(playersList, message.content.slice(9)).health = parseInt(messageArray[1]);
        //    console.log(getCharSheetByName(playersList, message.content.slice(9)).health = parseInt(messageArray[1]));
        //}

        //if(cmd == "forceq")
        //{
        //    if(questionsList.length > 0)
        //        {
        //            var curQuestion = Math.floor(Math.random() * questionsList.length);
        //            console.log(questionsList[curQuestion][0]);
        //            console.log(questionsList[curQuestion][1]);
        //            bot.guilds.get("263039543048011778").channels.get("697672130510192711").send(`An airtrop has appeared: ${questionsList[curQuestion][0]}`);
        //            currentAnswer = questionsList[curQuestion][1];
        //            questionsList.splice(curQuestion, 1);
        //        }
        //}

        //rvv The Resistance | Message
        //if(cmd == "rvv")
        //{
        //    console.log("Start revive");
        //    var trontestantRole = bot.guilds.get("263039543048011778").roles.get("701974929804886056");
        //    if(!messageArray.includes("|"))
        //    {
        //        message.channel.send("Invalid format");
        //        return;
        //    }
        //    var revUsername = message.content.slice(4).split(" | ")[0];
        //    var revMsg = message.content.slice(4).split(" | ")[1];
        //    var revCs = getCharSheetByName(revUsername);
        //    if(revCs == null)
        //    {
        //        console.log(`Adding ${revUsername}`);
        //        revCs = new CharacterSheet(revUsername);
        //        playersList.push(revCs);
        //        console.log(`New pl after rev: ${playersList}`);
        //    }
        //    revCs.health = 10;
        //    bot.guilds.get("263039543048011778").members.map(member =>
        //        {
        //            console.log(member.user.username);
        //            if(member.user.username == revUsername)
        //            {
        //                console.log(revUsername);
        //                member.addRole(trontestantRole);
        //                bot.guilds.get("263039543048011778").channels.get("697672130510192711").send(`${revUsername} has been revived: ${revMsg}`);
        //            }
        //        });
        //}

        //secretSanta
        //commenting out secret santa because it shares variables across guilds. need to isolate that
        //if(cmd === `${tradPrefix}secretSanta`)
        //{
            //secretSanta submit
        //    if(args[0] === "submit")
        //    {
                //make sure the player is in secret santa
        //        if(!message.author in SSPlayerList)
        //        {
        //            message.channel.send("You are not registered for the current Secret Santa session.");
        //            return;
        //        }
                //make sure there is a message
        //        if(args.length === 1)
        //        {
        //            message.channel.send("Please use !secretSanta submit [message that includes the gift code/link].");
        //            return;
        //        }
                //record the message in the appropriate spot of gifts list
        //        var PlayerIndex = SSPlayerList.indexOf(message.author);                 //Find the index in playerList of the person who sent this message
        //        var TargetIndex = SSPlayerList.indexOf(SSTargetList[PlayerIndex]);      //Find the index in playerList of the target of the person who sent this message
        //        SSGiftList[TargetIndex] = args.slice(1).join(" ");

        //        message.channel.send(`Your gift has been recieved and will be sent to ${targetPlayerIndex} when this ends.`);
        //        return;
        //    }
        //}
    }


    ///////////////////////////
    //Put TROINTS commands here
    ///////////////////////////
    //if(message.channel.id == "697672130510192711")
    //{
    //    if(currentAnswer != "" && message.content.toLowerCase().includes(currentAnswer.toLowerCase()))
    //    {
    //        var drop = randomDrop(getCharSheetByName(playersList, message.author.username));
    //        message.channel.send(`BING BONG. ${message.author.username} gets a ${drop}!`);
    //        console.log(`${message.author.username} gets the drop!`);
    //        currentAnswer = "";
    //    }

    //    if(cmd == "!health")
    //    {
    //        message.channel.send(`You have ${getCharSheetByName(playersList, message.author.username).health} health left.`);
    //    }

    //    if(cmd == "!attack")
    //    {
    //        console.log("Trying to attack");
    //        var trontestantRole = message.guild.roles.get("701974929804886056");
    //        if(message.mentions.members.size > 0 && !message.mentions.everyone)
    //        {
    //            var victim = message.mentions.members.first();
    //            var returnString = `You attempt to attack ${victim.displayName}. `;
    //            console.log("Found victim");
    //            console.log()
    //            if(Math.random() < .55)
    //            {
                    //hit
    //                console.log(getCharSheetByName(playersList, victim.user.username).name);
    //                getCharSheetByName(playersList, victim.user.username).health -= getCharSheetByName(playersList, message.author.username).getAttackPower();
    //                returnString += `You hit dealing ${getCharSheetByName(playersList, message.author.username).getAttackPower()} damage (${getCharSheetByName(playersList, victim.user.username).health}hp left). `
    //                if(getCharSheetByName(playersList, victim.user.username).health < 1)
    //                {
    //                    returnString += "Their soul descends into the darkness...";
    //                    victim.removeRole(trontestantRole, "Try again next time on Trivia Troints!");
    //                }
    //            }
    //            else
    //            {
                    //miss
    //                console.log(getCharSheetByName(playersList, victim.user.username).name);
    //                getCharSheetByName(playersList, message.author.username).health -= getCharSheetByName(playersList, victim.user.username).getAttackPower();
    //                returnString += `You miss, and get counterattacked taking ${getCharSheetByName(playersList, victim.user.username).getAttackPower()} damage (${getCharSheetByName(playersList, message.author.username).health}hp left). `
    //                if(getCharSheetByName(playersList, message.author.username).health < 1)
    //                {
    //                    returnString += "Your soul descends into the darkness...";
    //                    message.member.removeRole(trontestantRole, "Try again next time on Trivia Troints!");
    //                }
    //            }
    //            message.channel.send(returnString);
    //        }
    //    }

    //    return;
    //}


    ///////////////////////////
    //Put PASSIVE commands here
    ///////////////////////////

    //smultimash
    for(let word in messageArray) //why the hecc does word give an index and not a word javascript is dumb
    {
        if(/^sm.*u.*sh/i.test(messageArray[word]))
        {
            console.log("Fixing smush");
            message.channel.send("Looks like you made a typo. Lemme take care of that for you :)");
            message.delete().catch(O_o=>{console.log("Couldn't delete?")});

            //Todo: Send an embed saying "person x says: message but smush is replaced"
        }
    }

    //gaslight passive effect
    //if(message.author === gaslit)
    //{
    //    if(message.createdAt > glTimeout)
    //    {
    //        gaslit = null;
    //        glTimeout = null;
    //        console.log("Clearing gaslight data: Timeout");
    //    }

    //    else
    //    {
    //        if(Math.random() < 0.5)
    //        {
    //            message.delete();
    //            console.log(`Deleting message ${message.content} from ${message.author}`)
    //        }
    //        else
    //        {
    //            console.log("Gaslight check failed");
    //        }
    //    }
    //}

    


    ////////////////////////////////////////////////////////////
    //Place CASUAL commands that the bot can say no to down here
    ////////////////////////////////////////////////////////////
    //road map for these commands
    //allow the bot to randomly say yes or no
    //have them reply with :ok_hand: or an x emoji
    //don't allow one person to spam commands

    //verify that its a casual command
    if(cmd === `${casPrefix}`)
    {
        if(args[0] === `${casQualifier}`)
        {
            args = args.slice(1);

            for(var i = 0; i < args.length; i++)
            {
                //if(args[i] === "gaslight")
                //{
                    //gaslight
                    //ideal syntax: hey bot, [can you] gaslight @x [...]
                    //responses: none, agreement (gaslights those people), dissent (gaslights user instead)

                //    if(gaslit === null)
                //    {
                //        args = args.slice[i + 1];
                //        var user = message.mentions.users.first()
                //        var sender = message.author;

                //        var decision = Math.random() * 10;
                //        if(decision === 1)
                //        {
                //            gaslit = sender;
                //            glTimeout = new Date(message.createdAt.getTime() + 60*60000);   //timeout is 60 minutes
                //            message.react('😠');
                //            console.log(`Gaslighting ${gaslit.username}`);
                //            break;
                //        }
                //        if(decision <= 5)
                //        {
                //            gaslit = user;
                //            glTimeout = new Date(message.createdAt.getTime() + 60*60000);   //timeout is 60 minutes
                //            message.react('👌');
                //            console.log(`Gaslighting ${gaslit.username}`);
                //            break;
                //        }
                //        console.log(`Gaslighting no one`);
                //        break;
                //    }
                //    else
                //    {
                //        console.log("Someone is already gaslit");
                //    }

                //}
            }
        }
    }




    //////////////////////////////////////
    //Place TRADITIONAL commands down here
    //////////////////////////////////////

    //help
    if(cmd === `${tradPrefix}help`)
    {
        console.log("Displaying Help");
        /*if(message.channel.name != botconfig.botchannel)
        {
            return message.channel.send(`${cmd} must be sent in the ${botconfig.botchannel} channel`);
        }*/
        //help with specific command
        if(args.length === 1)
        {
            switch(args[0])
            {
                default:
                    return message.channel.send("Yeah its a pain to do a specific help dialog for each command I always get mad when things don't have this but deal.");
            }
        }
        //help general
        else
        {
            let helpembed = new Discord.RichEmbed()
            .setDescription("Available Commands:")
            .setColor("#CC7F3A")
            .addField("!help", "Show this message")
            .addField("!addRole [role name] [color]", "Creates a role. The role will have no special permissions, so this will just be for tagging yourself, creating groups, or for fun. Will default to a default color if the provided color is formatted wrong")
            .addField("!poll [question]", "Reacts to your question with a yes no and meh option for people to vote on.");

            return message.channel.send(helpembed)
        }
    }

    //addrole [name] [color]
    //fuuuuuuuck ok theres error handling but these trash methods don't seem to throw errors
    //so invalid colors will just default
    if(cmd === `${tradPrefix}addrole`)
    {
        var roleColor;
        //check how many args there are
        if(args.length === 0)
        {
            channel.message.send("I'm sorry old sport, I didn't understand that.");
            return;
        }

        //set color if necessary
        if(args.length > 1)
        {
            roleColor = args[1]; 
            message.guild.createRole({name: args[0], color: roleColor})
            .then(message.channel.send(`${args[0]} role created.`))
            .catch(error => {
                message.channel.send("There was an error creating the role.");
                console.log(error);
            });
            return;
        }
        
        //just the rolename
        message.guild.createRole({name: args[0]})
            .then(message.channel.send(`${args[0]} role created.`))
            .catch(error => {
                message.channel.send("There was an error creating the role.");
                console.log(error);
            });
        return;
    }

    //delrole [name]
    //Leaving this as a todo. need to make sure it only deletes ones its created. prolly gonna have to leave this til its ready to go live.

    //poll
    //Reacts to a command with a thumbs up and thumbs down
    if(cmd === `${tradPrefix}poll`)
    {
        message.react('👍').then(message.react('👎').then(message.react('🤷')));
    }

    //Secret Santa
    //secretSanta start [Description]: Starts the secret santa event. Can only be started by a Mod?.
    //secretSanta about: List the description of the secret santa event.
    //secretSanta join: Adds member to the secret santa game.
    //secretSanta assign: Once everyone has signed up, maps each player to another player and dms each player their target. Can only be started by a Mod?.
    //secretSanta submit [message]: Sent through DMs to the bot. Submits your gift, the message, to the bot.
    //secretSanta end: Can only be sent by a Mod?. Ends the game of secret santa and DMs each target their gift.
    //secretSanta help: Displays the above list of commands.
    
    //TODO: Permissionlock commands

    //if(cmd ===`${tradPrefix}secretSanta`)
    //{
        //secretSanta start
    //    if(args[0] === "start")
    //    {
            //check to see if there is already a secret santa going on
    //        if(isSSactive)
    //        {
    //            console.log("Unable to start Secret Santa, one already exists.");
    //            message.channel.send("Please end current game of Secret Santa before starting a new one.");
    //            return;
    //        }

            //no secret santa is currently ongoing, so we start a new one
    //        isSSactive = true;
    //        SSPlayerList = [];
    //        SSTargetList = [];
    //        SSGiftList = [];

            //fill in description if applicable, or give it default value
    //        SSDesc = "No description given."
    //        if(args.length > 1)
    //        {
    //            SSDesc = args.slice(1).join(" ");
    //        }

    //        console.log(`Starting secret santa: ${SSDesc}`);
    //        return;
    //    }

        //secretSanta about
    //    if(args[0] === "about")
    //    {
            //make sure there is currently a SS active
    //        if(!isSSactive)
    //        {
    //            message.channel.send("No Secret Santa is currently active.");
    //            return;
    //        }

            //send the Secret Santa Descripiton
    //        message.channel.send(SSDesc);
    //        return;
    //    }

        //secretSanta join
    //    if(args[0] === "join")
    //    {
            //make sure there is currently a SS active
    //        if(!isSSactive)
    //        {
    //            message.channel.send("No Secret Santa is currently active.");
    //            return;
    //        }

            //Check if the user is currently in the Secret Santa
    //        if(message.author in SSPlayerList)
    //        {
    //            message.channel.send("You are already registered for this Secret Santa.");
    //            return;
    //        }

            //register the user for secret santa
    //        SSPlayerList.push(message.author);
    //        message.channel.send(`${message.author} has been added to the Secret Santa`);
    //        return;
    //    }

        //secretSanta assign
    //    if(args[0] === "assign")
    //    {
            //make sure there is currently a SS active
    //        if(!isSSactive)
    //        {
    //            message.channel.send("No Secret Santa is currently active.");
    //            return;
    //        }

            //shuffle the members until none of them match the original list (i won't get myself as a secret santa)
    //        SSTargetList = SSPlayerList.slice();
    //        var currentIndex = SSPlayerList.length, temporaryValue, randomIndex;

            //i tried spacing this while statement out better and it was still unreadable so might as well make it look like good spaghetti
    //        while(() => {for(var i = 0; i < SSPlayerList.length; i++){if(SSPlayerList[i] == SSTargetList[i]){return true;}} return false;})
    //        {// While there remain elements to shuffle...
    //            while (0 !== currentIndex) 
    //            {

                    // Pick a remaining element...
    //                randomIndex = Math.floor(Math.random() * currentIndex);
    //                currentIndex -= 1;

                    // And swap it with the current element.
    //                temporaryValue = SSTargetList[currentIndex];
    //                SSTargetList[currentIndex] = SSTargetList[randomIndex];
    //                SSTargetList[randomIndex] = temporaryValue;
    //            }
    //        }
    //        console.log("Successfully shuffled the target list for Secret Santa.");
    //        console.log(`Player List: ${SSPlayerList}`);
    //        console.log(`Target List: ${SSTargetList}`);

    //        SSGiftList = [];
            //DM people their target, while instantiating the giftlist
    //        for(var i = 0; i < SSPlayerList.length; i++)
    //        {
    //            SSPlayerList[i].send(`Your Secret Santa target is ${SSTargetList[i].username}. Use !secretSanta submit [message] in this channel to submit your gift.`);
    //            SSGiftList.push("");
    //        }

    //        return;
    //    }


        //secretSanta submit
            //This command is written up in the DM commands section


        //secretSanta end
    //    if(args[0] === "end")
    //    {
            //make sure there is currently a SS active
    //        if(!isSSactive)
    //        {
    //            message.channel.send("No Secret Santa is currently active.");
    //            return;
    //        }

            //post that the secret santa is over
            //TODO: @ everyone who was in the secret santa
    //        message.channel.send("The Secret Santa is over! Please check your DMs from me to see your gift!");

            //dm everyone their message
    //        for(var i = 0; i < SSPlayerList.length; i++)
    //        {
    //            SSPlayerList[i].send(`Here is your Secret Santa gift!: ${SSGiftList[i]}`);
    //        }

            //clean up variables
    //        isSSactive = false;
    //    }

        //secretSanta help
    //    if(args[0] === "help")
    //    {
    //        let helpEmbed = new Discord.RichEmbed()
    //        .setDescription("Secret Santa Commands:")
    //        .setColor("#FF0000")
    //        .addField("!secretSanta start [description]", "Starts a Secret Santa event. Permissionlocked")
    //        .addField("!secretSanta about", "List the description of the ongoing Secret Santa event")
    //        .addField("!secretSanta join", "Add self to the Secret Santa event")
    //        .addField("!secretSanta assign", "Use once everyone has signed up. Maps each player to another player and DMs each player their target. Permissionlocked")
    //        .addField("!secretSanta submit [message]", "Can only be sent to my DMs, Submits your gift (the message), to me")
    //        .addField("!secretSanta end", "Ends the Secret Santa event and DMs each target their gift. Permissionlocked")
    //        .addField("!secretSanta help", "Lists available Secret Santa commands");
    //        message.channel.send(helpEmbed);
    //    }

    //}



});

bot.login(token.token);