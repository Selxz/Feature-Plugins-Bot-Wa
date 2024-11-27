let handler = async (m, { conn, text, isOwner }) => {
  if (!isOwner) {
    return m.reply("Fitur ini hanya untuk owner.");
  }

  if (!text) {
    return m.reply("Tolong masukkan pesan untuk disiarkan.");
  }

  try {
    let allChats = await conn.fetchAllGroups();
    let groupChats = allChats.filter(chat => chat.id.endsWith('@g.us'));

    if (groupChats.length === 0) {
      return m.reply("Bot tidak tergabung dalam grup mana pun.");
    }

    let message = {
      caption: text,
      title: '📢 Pesan Siaran 📢',
      body: 'Informasi baru dari bot untuk semua grup.',
      thumbnail: await conn.downloadContentFromUrl('https://example.com/thumbnail.jpg', 'image'), // Ganti dengan URL thumbnail
      document: {
        url: 'https://example.com/broadcast.pdf', // Ganti dengan URL dokumen
        mimetype: 'application/pdf',
        fileName: 'Broadcast From Owner ⚠.pdf'
      },
      ephemeralExpiration: 604800 // Pesan bertahan selama 7 hari
    };

    for (let group of groupChats) {
      await conn.sendMessage(
        group.id,
        {
          ...message,
          text: `*📢 Pesan Siaran 📢*\n\n${text}\n\n_Berlangsung selama 7 hari_`,
        },
        { quoted: m }
      );
    }

    await m.reply("Pesan berhasil disiarkan ke semua grup dengan format menarik.");
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mencoba menyiarkan pesan.");
  }
};

handler.help = ['broadcast <pesan>'];
handler.tags = ['owner'];
handler.command = /^(broadcast|bcgc)$/i;
handler.owner = true;

export default handler;
