import { Sticker } from 'wa-sticker-formatter'; // Jangan Lupa Install Module Nya Dengan Instruksi Di Awal Ya
import quoteApi from '@neoxr/quote-api'; // Jangan Lupa Install Module Nya Juga

let handler = async (m, { conn, text, prefix, command, pushname }) => {
  if (!text) return m.reply(`Contoh penggunaan: ${prefix + command} halo`);

  let avatar = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg');

  const json = {
    "type": "quote",
    "format": "png",
    "backgroundColor": "#2E4053",
    "width": 512,
    "height": 768,
    "scale": 2,
    "messages": [
      {
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": pushname,
          "photo": {
            "url": avatar
          }
        },
        "text": text,
        "replyMessage": {}
      }
    ]
  };

  async function createSticker(buffer, packName, authorName) {
    let stickerMetadata = {
      type: 'full',
      pack: packName,
      author: authorName,
      quality: 'high'
    };
    return (new Sticker(buffer, stickerMetadata)).toBuffer();
  }

  try {
    const res = await quoteApi(json);
    const buffer = Buffer.from(res.image, 'base64');
    let stiker = await createSticker(buffer, "Hann Universe", "Liyaa - MD");
    
    await conn.sendMessage(m.chat, {
      sticker: stiker,
      mimeType: 'image/webp'
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    return m.reply("Terjadi kesalahan saat membuat stiker.");
  }
};

handler.help = ['qc <text>'];
handler.tags = ['fun'];
handler.command = /^(qc)$/i;
handler.group = true;

export default handler;
