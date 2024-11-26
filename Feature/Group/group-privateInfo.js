let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Tolong masukkan pesan yang ingin dikirim ke anggota grup.");
  }

  try {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const participants = groupMetadata.participants;

    for (let participant of participants) {
      const participantId = participant.id;
      if (participantId !== conn.user.jid) {
        await conn.sendMessage(participantId, {
          text: text
        });
      }
    }

    await conn.sendMessage(m.chat, {
      text: `Pesan telah dikirim ke ${participants.length} anggota grup.`
    });

  } catch (error) {
    console.error("Error sending messages to group:", error);
    await conn.sendMessage(m.chat, {
      text: "Terjadi kesalahan saat mengirim pesan ke grup."
    });
  }
};

handler.help = ['privateInfo'];
handler.tags = ['group'];
handler.command = /^(privateInfo)$/i;
handler.group = true;
handler.admin = true;

export default handler;
