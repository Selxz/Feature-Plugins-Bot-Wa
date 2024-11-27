let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return m.reply("Fitur ini hanya untuk owner.");
  }

  try {
    let allGroups = await conn.fetchAllGroups();

    if (allGroups.length === 0) {
      return m.reply("Bot tidak tergabung dalam grup mana pun.");
    }

    await m.reply(`Bot akan keluar dari ${allGroups.length} grup.`);

    for (let group of allGroups) {
      await conn.groupLeave(group.id);
      console.log(`Bot telah keluar dari grup: ${group.subject}`);
    }

    await m.reply("Proses selesai, bot telah keluar dari semua grup.");
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mencoba keluar dari grup.");
  }
};

handler.help = ['clearallgc'];
handler.tags = ['owner'];
handler.command = /^(clearallgc)$/i;
handler.owner = true;

export default handler;
