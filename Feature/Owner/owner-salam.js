// Simpan status fitur dalam memori (bisa diganti dengan database jika diperlukan)
const salamStatus = {};

let handler = async (m, { conn, text, isOwner }) => {
  if (!isOwner) return m.reply("Perintah ini hanya dapat digunakan oleh owner.");

  if (!text || !['on', 'off'].includes(text.toLowerCase())) {
    return m.reply("Gunakan perintah:\n- `salam on` untuk mengaktifkan fitur.\n- `salam off` untuk menonaktifkan fitur.");
  }

  const chatId = m.chat;
  const currentStatus = salamStatus[chatId] || 'off';
  const newStatus = text.toLowerCase();

  if (currentStatus === newStatus) {
    return m.reply(`Fitur salam sudah dalam kondisi *${newStatus.toUpperCase()}*.`);
  }

  salamStatus[chatId] = newStatus;
  m.reply(`Fitur salam berhasil diubah ke *${newStatus.toUpperCase()}*.`);
};

// Event handler untuk merespon chat di pribadi
conn.on('chat-update', async (chatUpdate) => {
  if (!chatUpdate.messages) return;
  const message = chatUpdate.messages.all()[0];
  const m = conn.serializeM(message);

  // Abaikan jika bukan pesan pribadi atau bukan teks
  if (!m.isGroup && salamStatus[m.chat] === 'on' && m.text) {
    await conn.sendMessage(m.chat, {
      text: `Assalamu'alaikum! Ada yang bisa saya bantu? 😊`,
    });
  }
});

handler.help = ['salam'];
handler.tags = ['owner'];
handler.command = /^salam$/i;

export default handler;
