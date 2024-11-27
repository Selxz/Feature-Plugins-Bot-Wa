let handler = async (m, { conn }) => {
  if (!global.owner.includes(m.sender)) {
    return m.reply("Fitur ini hanya untuk owner.");
  }

  try {
    let allChats = await conn.chats.all();
    let groupChats = allChats.filter(chat => chat.jid.endsWith('@g.us'));

    if (groupChats.length === 0) {
      return m.reply("Bot tidak tergabung dalam grup mana pun.");
    }

    for (let group of groupChats) {
      await conn.groupLeave(group.jid);
      await m.reply(`Keluar dari grup: ${group.subject || group.jid}`);
    }

    await m.reply("Bot telah keluar dari semua grup.");
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
