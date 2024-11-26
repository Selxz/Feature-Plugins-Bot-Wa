let handler = async (m, { conn }) => {
  let groupMetadata = await conn.groupMetadata(m.chat);
  let participants = groupMetadata.participants;

  let categorizedNumbers = {
    "Indonesia (+62)": [],
    "Malaysia (+60)": [],
    "USA/Canada (+1)": [],
    "India (+91)": [],
    "UK (+44)": [],
    "Others": []
  };

  for (let participant of participants) {
    let number = participant.id.split('@')[0]; // Ambil nomor tanpa domain
    if (number.startsWith("62")) {
      categorizedNumbers["Indonesia (+62)"].push(`+${number}`);
    } else if (number.startsWith("60")) {
      categorizedNumbers["Malaysia (+60)"].push(`+${number}`);
    } else if (number.startsWith("1")) {
      categorizedNumbers["USA/Canada (+1)"].push(`+${number}`);
    } else if (number.startsWith("91")) {
      categorizedNumbers["India (+91)"].push(`+${number}`);
    } else if (number.startsWith("44")) {
      categorizedNumbers["UK (+44)"].push(`+${number}`);
    } else {
      categorizedNumbers["Others"].push(`+${number}`);
    }
  }

  let result = `*Grup:* ${groupMetadata.subject}\n*Jumlah Anggota:* ${participants.length}\n\n`;
  for (const [prefix, numbers] of Object.entries(categorizedNumbers)) {
    result += `*${prefix}:*\n${numbers.length > 0 ? numbers.join('\n') : "Tidak ada"}\n\n`;
  }

  await conn.sendMessage(m.chat, { text: result });
};

handler.help = ['ceknegara'];
handler.tags = ['group'];
handler.command = /^(ceknegara)$/i;
handler.group = true;

export default handler;
