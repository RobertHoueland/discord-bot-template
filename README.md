# Robdog Bot - Discord Template

This is a template for a highly customizable discord bot that you can use yourself. Features include sound files being played in voice channels, image/gifs/mp4 files being linked, tweet notifications to channels, and alerts when people in your server go live. Mainly for use in a single, smaller server. 

The bot will give a checkmark reaction to the message, and delete the command after 3 seconds. 

Setup:
You will need to install [Node.js](https://nodejs.org/en/), and clone this repo to somewhere on your device to edit. In node.js, run:

`npm install dotenv`
`npm install twit` - allows twitter functionality
`npm install discord.js`
`npm install ffmpeg-static` - allows sound files to be played in voice channels
`npm install opusscript` - allows sound files to be played in voice channels

Now you will have the correct npm packages installed. To run the bot on your computer:

`npm start` OR `node main.js`

Understanding the files:

**config.json**

This file allows you to customize the prefix of the bot command. The default is `;`

**.env**

Your environment variables for each of the features.

DISCORD_TOKEN - You need to setup this bot in the [Discord developer portal](https://discord.com/developers/applications) as a bot. The token will be on this page to copy. The bot also needs to permissions for "Presence Intent" to see when users start streaming, so make sure to enable this. From the OAuth2 page, make sure to click bot, and give permissions to get the link to invite the bot to the server. 

DISCORD_CHANNEL_ID - This is the channel in your server that new tweets will be posted in. To get this, open your discord settings, go to "advanced" and toggle on "developer settings. Now you can right click a channel to grab it's ID.

TWITCH_CHANNEL_ID - This is the channel in your server that new twitch streaming notifications will be posted in. To get this, open your discord settings, go to "advanced" and toggle on "developer settings. Now you can right click a channel to grab it's ID.

TWITTER_CONSUMER_KEY and TWITTER_ACCESS_TOKEN (and secret) - For the twitter functionality to work, you will need a twitter developer API account. Go to their [page](https://developer.twitter.com/en/portal/dashboard) and sign up for use with a bot. Once you have an app created, you will be able to find each of these tokens on the page. 

**package.json**

Shows required versions for each of your dependencies and packages. You don't need to edit anything in here. Also has a script that allows `npm start` to function as `node main.js`

**Procfile**

This file allows the bot to be run on [heroku](https://dashboard.heroku.com/), which I have used to host the bot so that it isn't always running on my computer. You can create an account and create a new app, but don't worry about the pipeline. In the "resources" tab, make sure to disable "web" and enable "worker" because this isn't a web app. There are instructions in the "deploy" tab to link your bot with the heroku. In the top right is "More" which allows you to "view logs."

**main.js**

This is where the action happens. You will want to customize `commandsArr` with what you want them to do. In the function `doCommand` you can add more commands, rename them, and remove them. There is a built in help command that will DM users an embed, so make sure to customize this. You can change any of the console.log() messages as you like, and change what the bot says when it prints to a channel at any time. Other than that, the only things you need to change are put in all capitals, like ADD IMAGE where you need add a link to your own image.
