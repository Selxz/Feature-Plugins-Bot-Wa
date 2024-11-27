// sticker brat [ cjs ]
//[ https://whatsapp.com/channel/0029VamzFetC6ZvcD1qde90Z ]
const axios = require('axios');
const { Sticker } = require('wa-sticker-formatter');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}brat <teks>`;
    
    try {
        conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://btch.us.kg/brat?text=${encodeURIComponent(text)}`;

        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By',
            author: 'Mahiru - MultiDevice',
            type: 'image/png',
        });

        const stikerBuffer = await sticker.toBuffer();
        await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti.', m);
    }
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^brat$/i;

module.exports = handler;

// sticker brat [ case ]
//[ https://whatsapp.com/channel/0029VamzFetC6ZvcD1qde90Z ]
case 'brat': {
    if (!q) return reply(`Gunakan perintah ini dengan format: ${prefix + command} <teks>`);

    try {
        reply('_Sedang memproses..._');

        const url = `https://btch.us.kg/brat?text=${encodeURIComponent(q)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By',
            author: 'Mahiru - MultiDevice',
            type: 'image/png',
        });

        const stikerBuffer = await sticker.toBuffer();
        await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        reply('Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti.');
    }
    break;
}


// sticker brat [ esm ]
// [ https://whatsapp.com/channel/0029VamzFetC6ZvcD1qde90Z ]
import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}brat <teks>`;
    
    try {
        conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://btch.us.kg/brat?text=${encodeURIComponent(text)}`;

        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By',
            author: 'Mahiru - MultiDevice',
            type: 'image/png',
        });

        const stikerBuffer = await sticker.toBuffer();
        await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti.', m);
    }
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^brat$/i;

export default handler;
