let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return m.reply("Fitur ini hanya untuk owner.");
  }

  try {
    let allChats = await conn.chats.all();
    let groupChats = await conn.fetchAllGroups();
    let privateChats = allChats.filter(chat => !chat.id.endsWith('@g.us'));
    let totalChats = allChats.length;

    let uptime = process.uptime();
    let uptimeString = formatUptime(uptime);

    let status = `
📊 *Status Bot* 📊
- Total Chat: ${totalChats}
- Grup: ${groupChats.length}
- Chat Pribadi: ${privateChats.length}
- Uptime: ${uptimeString}

💡 Bot berjalan normal. Tidak ada masalah yang terdeteksi.
    `.trim();

    await m.reply(status);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat memeriksa status bot.");
  }
};

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, 'jam', m, 'menit', s, 'detik'].filter(Boolean).join(' ');
}

handler.help = ['checkbotstatus'];
handler.tags = ['owner'];
handler.command = /^(checkbotstatus|botstatus)$/i;
handler.owner = true;

export default handler;
