const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicialización del cliente
const client = new Client({
    authStrategy: new LocalAuth()
});

// Generación del código QR para la autenticación
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea este código QR con tu teléfono para iniciar sesión en WhatsApp');
});

// Confirmación de que el cliente está listo
client.on('ready', () => {
    console.log('Cliente listo');
});

// Escucha de mensajes y ejecución de comandos
client.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.body.startsWith('.kick')) {
        if (chat.isGroup) {
            let mentions = await msg.getMentions();
            for (let contact of mentions) {
                await chat.removeParticipants([contact.id._serialized]);
                msg.reply(`Eliminado ${contact.pushname || contact.number}`);
            }
        } else {
            msg.reply('Este comando solo se puede usar en grupos.');
        }
    }

    if (msg.body.startsWith('.fotogrup')) {
        if (chat.isGroup) {
            const media = await msg.downloadMedia();
            await chat.setPicture(media);
            msg.reply('Foto de grupo cambiada.');
        } else {
            msg.reply('Este comando solo se puede usar en grupos.');
        }
    }

    if (msg.body.startsWith('.restalik')) {
        if (chat.isGroup) {
            const participants = await chat.participants;
            const nonAdmins = participants.filter(participant => !participant.isAdmin);
            await chat.addParticipants(nonAdmins.map(participant => participant.id._serialized));
            msg.reply('Lista de participantes restaurada.');
        } else {
            msg.reply('Este comando solo se puede usar en grupos.');
        }
    }
});

// Inicialización del cliente
client.initialize();
