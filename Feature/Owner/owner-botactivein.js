let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return m.reply("Fitur ini hanya untuk owner.");
  }

  try {
    const groups = await conn.chats.all();
    const groupCount = groups.filter(chat => chat.jid.endsWith('@g.us')).length;
    const totalMessages = groups.reduce((acc, chat) => acc + chat.messages.length, 0);
    const userMessages = {};

    for (let chat of groups) {
      for (let message of chat.messages) {
        const sender = message.key.fromMe ? "Bot" : message.key.participant;
        userMessages[sender] = (userMessages[sender] || 0) + 1;
      }
    }

    const topUsers = Object.entries(userMessages).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const stats = `
Statistik Penggunaan Bot:
- Jumlah Grup: ${groupCount}
- Total Pesan Terkirim: ${totalMessages}
- Pengguna Teraktif: 
${topUsers.map(([user, count]) => `  ${user}: ${count} pesan`).join('\n')}
    `.trim();

    await m.reply(stats);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mencoba mengambil statistik bot.");
  }
};

handler.help = ['botactivein'];
handler.tags = ['owner'];
handler.command = /^(botactivein)$/i;
handler.owner = true;

export default handler;
