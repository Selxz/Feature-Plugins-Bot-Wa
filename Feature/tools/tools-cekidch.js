//Jangan Lupa Masukkan Ke Package Ini "@Awafff/RerezOfficial": "github:Awafff/XyrezzNotSepuh"
//Ganti Baileys Kalau Mau Makai Ini Atau Gw Gk Tau Udh Support Di Whiskeysockets Atau Belum. 
let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`Kirim perintah ${prefix + command} _linkchannel_`);
  if (!isUrl(text) && !text.includes('whatsapp.com/channel')) return m.reply("Link tidak valid");
  
  await conn.sendMessage(m.chat, {
    react: {
      text: "⏱️",
      key: m.key,
    }
  });

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  try {
    let result = text.split('https://whatsapp.com/channel/')[1];
    let data = await cioBotz.newsletterMetadata("invite", result);
    let teks = `*乂 NEWSLETTER INFO*

*Name:* ${data.name}
*ID*: ${data.id}
*Status*: ${data.state}
*Dibuat Pada*: ${formatDate(data.creation_time)}
*Subscribers*: ${data.subscribers}
*Meta Verify*: ${data.verification}
*React Emoji:* ${data.reaction_codes}
*Description*:
${data.description}
    `;
    m.reply(teks);
  } catch (error) {
    m.reply("Link tidak valid");
  }
};

handler.help = ['inspect', 'getch', 'getinfochannel', 'getchid'];
handler.tags = ['info'];
handler.command = /^(inspect|getch|getinfochannel|getchid)$/i;

export default handler;
