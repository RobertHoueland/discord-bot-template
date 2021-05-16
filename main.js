require("dotenv").config()
const Twit = require("twit")
const Discord = require("discord.js")
const client = new Discord.Client()
const { prefix } = require("./config.json")
console.log("BOT IS STARTING")
console.log('USING PREFIX: "' + prefix + '"\n')

var commandsArr = [
   "**help** (or commands) - shows this menu",
   "**command1** - links gif",
   "**command2** - links mp4 video",
   "**command3** - links image\n",
   "**voice** - joins voice channel and plays sound effect",
   "**leave** - leaves voice channel",
   "**ping** - checks bot ping",
]

// Combine all commands into array to be printed
function printArr(arr) {
   var stringArr = ""
   for (i = 0; i < arr.length; i++) {
      stringArr += "\n" + prefix + arr[i]
   }
   return stringArr
}

function commandSuccess(msg) {
   setTimeout(() => msg.delete(), 3000) // Delete user's message 3 seconds after using command
   msg.react("✅")
   console.log(msg.content + " was used by " + msg.member.user.tag)
}

client.on("message", (msg) => {
   if (msg.author == client.user || msg.author.bot) {
      return // Prevent bot from replying to itself or other bot
   }
   if (msg.content.startsWith(prefix)) {
      doCommand(msg)
   }
})

function doCommand(msg) {
   let command = msg.content.substr(1).toLowerCase()

   if (command == "help" || command == "commands") {
      commandSuccess(msg)
      const embed = new Discord.MessageEmbed()
         .setColor("#3b3e42")
         .setTitle("Ovie Bot")
         .setAuthor("Created by Robdog#6848", "https://i.imgur.com/qfsnOig.jpg")
         .setDescription("**Current Commands:**\n" + printArr(commandsArr))
         .setThumbnail(
            "INSERT IMAGE"
         )
         .setTimestamp()
         .setImage(
            "INSERT IMAGE"
         )
      msg.author.send(embed)
   } else if (command == "command1") {
      commandSuccess(msg)
      msg.channel.send(
         "INSERT GIF"
      )
   } else if (command == "command2") {
      commandSuccess(msg)
      msg.channel.send(
         "INSERT MP4"
      )
   } else if (command == "command3") {
      commandSuccess(msg)
      msg.channel.send(
         "INSERT IMAGE"
      )
   } else if (command == "ping") {
      commandSuccess(msg)
      msg.channel.send("Pinging...").then((sent) => {
         sent.edit(`Ping: ${sent.createdTimestamp - msg.createdTimestamp}ms`)
      })
   }
}

client.on("message", async (msg) => {
   if (!msg.guild) {
      console.log(
         "Voice command was not run, not in server, used by " +
            msg.member.user.tag
      )
      return
   } // Voice commands can only be run in servers

   if (msg.content.toLowerCase() === prefix + "voice") {
      commandSuccess(msg)
      if (msg.member.voice.channel) {
         const connection = await msg.member.voice.channel.join()
         const dispatcher = connection.play("INSERT MP3")
      } else {
         console.log("Voice command was not run, user not in voice channel")
         msg.channel.send("You need to join a voice channel!")
      }
   }
   if (msg.content.toLowerCase() === prefix + "leave") {
      commandSuccess(msg)
      msg.member.voice.channel.leave()
   }
})

client.on("voiceStateUpdate", (oldState, newState) => {
   if (
      oldState.channelID !== oldState.guild.me.voice.channelID ||
      newState.channel
   ) {
      return
   }
   if (!oldState.channel.members.size - 1)
      setTimeout(() => {
         if (!oldState.channel.members.size - 1) {
            oldState.channel.leave()
            console.log("Leaving voice channel after timeout")
         }
      }, 30000)
})

var twitterVar = new Twit({
   consumer_key: process.env.TWITTER_CONSUMER_KEY,
   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
   access_token: process.env.TWITTER_ACCESS_TOKEN,
   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,

   strictSSL: true,
})

function isReply(tweet) {
   // No tweet alerts for replies
   if (
      tweet.retweeted_status ||
      tweet.in_reply_to_status_id ||
      tweet.in_reply_to_status_id_str ||
      tweet.in_reply_to_user_id ||
      tweet.in_reply_to_user_id_str ||
      tweet.in_reply_to_screen_name
   ) {
      return true
   }
   return false
}

client.once("ready", () => {
   console.log("BOT READY")
   client.user.setActivity(prefix + "help")

   var stream = twitterVar.stream("statuses/filter", {
      follow: [process.env.TWITTER_USER_ID],
   })

   stream.on("tweet", function (tweet) {
      var url =
         "https://twitter.com/" +
         tweet.user.screen_name +
         "/status/" +
         tweet.id_str
      console.log("New tweet, URL: " + url)
      if (isReply(tweet) == true) {
         console.log("Did not post reply to tweet")
         return
      }
      try {
         let channel = client.channels
            .fetch(process.env.DISCORD_CHANNEL_ID)
            .then((channel) => {
               console.log("Alerting new tweet")
               channel.send("**New Tweet:**\n\n" + url)
            })
            .catch((err) => {
               console.log(err)
            })
      } catch (error) {
         console.error(error)
      }
   })
})

var streamUserCD = ""

client.on("presenceUpdate", (oldPresence, newPresence) => {
   if (!newPresence.activities || `${newPresence.user.tag}` == streamUserCD) {
      return
   }
   newPresence.activities.forEach((activity) => {
      if (activity.type == "STREAMING") {
         console.log(
            `${newPresence.user.tag} has started streaming at ${activity.url}`
         )
         let channel = client.channels
            .fetch(process.env.TWITCH_CHANNEL_ID)
            .then((channel) => {
               channel.send(
                  `**${newPresence.user.username} has started streaming!**\n\nCheck them out at ${activity.url}`
               )
            })
         streamUserCD = `${newPresence.user.tag}`
      }
   })
})

client.login(process.env.DISCORD_TOKEN)