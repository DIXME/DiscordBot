require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, Embed } = require('discord.js');
const Rcon = require("rcon");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

global.rcon = false;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const obama = `https://cdn.discordapp.com/attachments/1263063474515214338/1382540701052436552/637602483109545572.png?ex=684b86dd&is=684a355d&hm=41323b40a15a7f66b831b97e5a6c93950453dc0d60b9a3c1be6f7f70f7a339ed&`
const based = ``
const tuff = ``

const welcome = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Welcome to the server!')
    .setURL('https://4chan.com')
    .setAuthor({name: 'Dominic (robot)', iconURL: obama})
    .setDescription('This is a welcome message to help you gain full accsess to the server! your are going to need to head over to the reaction roles chanel and react to gain the member role so you can interact with everybody')
    .setThumbnail(based)
    .addFields(
        {
            name: 'Be aware of!',
            value: 'Somthing'
        }
    )
    .setImage(tuff)

    
const static_commands = { // we wrap this so they cant just call javascript functions *(security)
    ping(message, parsed){
        message.channel.send({
            embeds: [welcome]
        })
    },
    pong(message, parsed){
        message.reply('your not supposed to say that dumbass');
    },
    ban(message, parsed){
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('You do not have permission to ban members!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('You have to @ them dumbass <:1746132870303k:1382196945761599568>');
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.reply('This is not a real person dingus <:1740667182968b:1382202355495207073>');
        }

        try {
            member.ban()
                .then(() => message.reply(`Successfully banned ${user.tag}`))
                .catch(err => message.reply('I cannot ban this user!'));
        } catch (error) {
            message.reply('There was an error trying to ban this user 🥀🥀');
        }
    },
    init_mc(message, parsed){
        const host = process.env.MINECRAFT_HOST;
        const port = process.env.MINECRAFT_RCON_PORT;
        const password = process.env.MINECRAFT_RCON_PASSWORD;
        global.rcon = new Rcon(host, port, password, { tcp: true, challenge: false });
        
        global.rcon.on('auth', () => {
            global.rcon.send('/say Connected From Discord Bot!');
        });

        global.rcon.on('error', (err) => {
             message.channel.send('Error:'+ err);
        });

        global.rcon.on('server', (msg) => {
            message.channel.send('[+] '+msg)
        })

        global.rcon.on('response', (msg) => {
            message.channel.send('[-] '+msg)
        })

        global.rcon.connect()
    },
    mc(message, parsed){
        parsed = parsed.splice(1,parsed.length)
        command = ''
        console.log(parsed)
        parsed.forEach(element => {
            command+=element
            if(parsed.indexOf(element)!=parsed.length-1){command+=' '}
        })
        message.reply(`message => minecraft command: ${command}`) 
        if(global.rcon){
            global.rcon.send(command)
        } else {
            message.reply(`you first have to use !init_mc to establist the connection buddY! <:1740667182968b:1382202355495207073>`)
        }
    }
    
}

client.on('messageCreate', message => {
    //if (message.author.bot) return;
    if(message.author.username=='penguin7075') return

    // static commands with no args
    const parsed = message.content.split(' ');
    command = parsed[0]
    command_ = command.replace('!','')
    
    // debug console.log(`command: ${command} parsed: ${parsed} raw: ${message.content}`);

    if(command[0]!='!'){
        // debug console.log("not a command");
        return;
    }

    eval(`static_commands.`+command_+`(message, parsed)`);
});

const vc_ban = false

client.on('voiceStateUpdate', (oldState, newState) => {
    // Check if user joined a voice channel
    if(vc_ban){
        const channel = newState.channel;
        
        // Check if the channel is named "Banned"
        if (channel && channel.name === 'Banned') {
            // Do something when someone joins the "Banned" channel
            const member = newState.member;
            console.log(`${member.user.tag} joined the Banned channel`);
            
            // Example: Send a message to a specific text channel
            const textChannel = newState.guild.channels.cache.find(ch => ch.name === 'general');
            if (textChannel) {
                textChannel.send(`${member.user.tag} joined lmao there fucking gone`);
                textChannel.send(`/rape <@${member.id}>`)
            }
        }
    }
});

client.on('shardDisconnect', (envent, id) => {
    if(global.rcon){
        global.rcon.end()
    }
})

client.login(process.env.DISCORD_TOKEN);