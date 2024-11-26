let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Masukkan teks untuk notifikasi.");

  let groupMetadata = await conn.groupMetadata(m.chat);
  let participants = groupMetadata.participants;

  let mentions = participants.map(p => p.id);

  let notifMessage = {
    text: `📢 *Notifikasi Penting* 📢\n\n${text}`,
    mentions: mentions
  };

  await conn.sendMessage(m.chat, notifMessage);
};

handler.help = ['notif <text>'];
handler.tags = ['group'];
handler.command = /^(notif|notifikasi)$/i;
handler.group = true;
handler.admin = true;

export default handler;
