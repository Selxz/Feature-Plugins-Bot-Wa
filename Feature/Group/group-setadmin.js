let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Tolong masukkan nomor anggota, perintah (admin atau remove), dan waktu (jam:menit atau tanggal).");
  }

  const args = text.split(" ");
  const userId = args[0] + "@s.whatsapp.net";
  const action = args[1].toLowerCase();
  const timeInput = args[2];

  if (!timeInput || !userId || !action) {
    return m.reply("Format salah. Gunakan: *nomor perintah waktu*.");
  }

  let targetTime = new Date();
  const [hours, minutes] = timeInput.split(":").map(Number);
  targetTime.setHours(hours, minutes, 0, 0);

  if (isNaN(targetTime.getTime())) {
    return m.reply("Format waktu salah. Gunakan format jam:menit (misal: 14:30).");
  }

  const delay = targetTime.getTime() - Date.now();
  if (delay < 0) {
    return m.reply("Waktu yang dimasukkan sudah lewat. Gunakan waktu yang akan datang.");
  }

  await m.reply(`Perintah akan dijalankan pada ${targetTime.toLocaleTimeString()} (${timeInput})`);

  setTimeout(async () => {
    if (action === "admin") {
      await conn.groupParticipantsUpdate(m.chat, [userId], "promote");
      await conn.sendMessage(m.chat, {
        text: `Anggota ${userId} berhasil dipromosikan menjadi admin.`
      });
    } else if (action === "remove") {
      await conn.groupParticipantsUpdate(m.chat, [userId], "demote");
      await conn.sendMessage(m.chat, {
        text: `Anggota ${userId} berhasil diturunkan dari status admin.`
      });
    } else {
      await m.reply("Perintah tidak valid. Gunakan 'admin' atau 'remove'.");
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
