const lastChats = new Map();

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply("Perintah ini hanya dapat digunakan oleh owner.");
  if (lastChats.size === 0) return m.reply("Belum ada pengguna yang mengirim pesan ke bot.");
  const users = Array.from(lastChats.values());
  let message = `📋 *Daftar Pengguna yang Terakhir Chat di Grup:*\n\n`;
  message += users.map((id, index) => `${index + 1}. @${id.split('@')[0]}`).join('\n');
  await conn.sendMessage(m.chat, {
    text: message,
    mentions: users,
  });
};

conn.on('chat-update', async (chatUpdate) => {
  if (!chatUpdate.messages) return;
  const message = chatUpdate.messages.all()[0];
  const m = conn.serializeM(message);
  if (m.isGroup && m.text) {
    lastChats.set(m.sender, m.sender);
  }
});

handler.help = ['list-online'];
handler.tags = ['owner'];
handler.command = /^list-online$/i;

export default handler;
