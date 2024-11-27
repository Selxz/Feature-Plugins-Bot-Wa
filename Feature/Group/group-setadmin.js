let handler = async (m, { conn, text }) => {
  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid && m.mentionedJid.length > 0) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.split(" ")[0] + "@s.whatsapp.net";
  } else {
    return m.reply("Tolong tag atau balas pesan pengguna, atau masukkan nomor pengguna.");
  }

  const args = text.split(" ");
  const action = args[1]?.toLowerCase();
  const timeInput = args[2];

  if (!action || (action !== "admin" && action !== "remove")) {
    return m.reply("Perintah tidak valid. Gunakan format: *tag/reply admin/remove waktu*.");
  }

  if (!timeInput) {
    return m.reply("Masukkan waktu dalam format *jam:menit* atau *tanggal*.");
  }

  let targetTime = new Date();
  const [hours, minutes] = timeInput.split(":").map(Number);
  targetTime.setHours(hours, minutes, 0, 0);

  if (isNaN(targetTime.getTime())) {
    return m.reply("Format waktu salah. Gunakan format *jam:menit* (misal: 14:30).");
  }

  const delay = targetTime.getTime() - Date.now();
  if (delay < 0) {
    return m.reply("Waktu yang dimasukkan sudah lewat. Gunakan waktu yang akan datang.");
  }

  await m.reply(`Perintah akan dijalankan pada ${targetTime.toLocaleTimeString()} (${timeInput}).`);

  setTimeout(async () => {
    if (action === "admin") {
      await conn.groupParticipantsUpdate(m.chat, [target], "promote");
      await conn.sendMessage(m.chat, {
        text: `@${target.split("@")[0]} berhasil dipromosikan menjadi admin.`,
        mentions: [target]
      });
    } else if (action === "remove") {
      await conn.groupParticipantsUpdate(m.chat, [target], "demote");
      await conn.sendMessage(m.chat, {
        text: `@${target.split("@")[0]} berhasil diturunkan dari status admin.`,
        mentions: [target]
      });
    }
  }, delay);
};

handler.help = ['setadmin'];
handler.tags = ['admin'];
handler.command = /^(setadmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
