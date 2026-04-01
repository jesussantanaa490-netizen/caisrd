const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// Evento cuando el bot se conecta
client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Sistema de comandos básicos
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const prefix = "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // !ping → prueba de conexión
    if (command === "ping") {
        message.reply("🏓 Pong!");
    }

    // !help → lista de comandos
    else if (command === "help") {
        message.reply(`
📖 **Lista de comandos disponibles:**
- !ping → prueba de conexión
- !help → muestra esta ayuda
- !reglas → muestra reglas del servidor
- !clear <número> → borra mensajes (moderación)
        `);
    }

    // !reglas → muestra reglas básicas
    else if (command === "reglas") {
        message.reply(`
📜 **Reglas principales de Desorden RP:**
1. Respeta a todos los miembros.
2. No uses cheats ni exploits.
3. Mantén el rol coherente y realista.
4. Sigue las indicaciones de la administración.
        `);
    }

    // !clear → borrar mensajes (solo admins)
    else if (command === "clear") {
        if (!message.member.permissions.has("ManageMessages")) {
            return message.reply("❌ No tienes permisos para usar este comando.");
        }
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply("⚠️ Debes indicar un número válido.");
        }
        message.channel.bulkDelete(amount, true)
            .then(() => {
                message.channel.send(`🧹 Se borraron ${amount} mensajes.`)
                    .then(msg => setTimeout(() => msg.delete(), 3000));
            })
            .catch(err => {
                console.error(err);
                message.reply("❌ Error al borrar mensajes.");
            });
    }
});

client.login(process.env.DISCORD_TOKEN);