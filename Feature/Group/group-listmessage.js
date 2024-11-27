let loadMessages = async (conn, chatId, count = 50) => {
  try {
    const lastMessage = await conn.messageRetryQueue.get(chatId);
    const lastMessageId = lastMessage?.key?.id || null;

    const messages = await conn.store.loadMessages(chatId, count, lastMessageId);

    if (!messages || messages.length === 0) {
      throw new Error("Tidak ada pesan yang dapat dimuat.");
    }

    return messages;
  } catch (e) {
    console.error("Error memuat pesan:", e.message);
    throw new Error("Gagal memuat pesan.");
  }
};

let handler = async (m, { conn, isGroup }) => {
  if (!isGroup) return m.reply("Fitur ini hanya dapat digunakan di grup.");

  try {
    let groupMeta = await conn.groupMetadata(m.chat);
    let participants = groupMeta.participants;
    let messages = {};

    let chats = await loadMessages(conn, m.chat, 100);

    for (let chat of chats) {
      let sender = chat.key.participant || chat.key.remoteJid || chat.key.fromMe && conn.user.id;

      if (!sender || sender.endsWith('@broadcast')) continue;

      sender = sender.split('@')[0];
      messages[sender] = (messages[sender] || 0) + 1;
    }

    let sortedMessages = Object.entries(messages).sort((a, b) => b[1] - a[1]);
    let userDetails = sortedMessages.map(([number, count], index) => {
      let user = participants.find(p => p.id.split('@')[0] === number);
      let name = user?.notify || user?.name || `+${number}`;
      return `${index + 1}. ${name} (${number}) - ${count} pesan`;
    });

    if (userDetails.length === 0) {
      return m.reply("Tidak ada data pesan yang dapat ditampilkan.");
    }

    let teks = `*Daftar Pesan Pengguna di Grup*\n\n${userDetails.join('\n')}`;
    m.reply(teks);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat memproses daftar pesan.");
  }
};

handler.help = ['listmessage'];
handler.tags = ['group'];
handler.command = /^(listmessage)$/i;
handler.group = true;
handler.admin = true;

export default handler;
