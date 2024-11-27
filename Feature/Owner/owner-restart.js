let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return m.reply("Fitur ini hanya untuk owner.");
  }

  try {
    await m.reply("🔄 *Menyiapkan restart...* Bot akan kembali lebih cepat dari sebelumnya...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await conn.sendMessage(m.chat, {
      text: "🚨 *Proses restart bot dimulai...*\n⚡ Bot akan kembali dalam hitungan detik!",
      mentions: [m.sender],
    }, { quoted: m });

    await new Promise(resolve => setTimeout(resolve, 3000));

    await m.reply("💥 *Bot akan restart dalam 5 detik...* Siapkan diri Anda!");
    await new Promise(resolve => setTimeout(resolve, 5000));

    process.exit(0);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mencoba merestart bot.");
  }
};

handler.help = ['restartbot'];
handler.tags = ['owner'];
handler.command = /^(restartbot)$/i;
handler.owner = true;

export default handler;
