import moment from 'moment';

let handler = async (m, { conn, text, command, prefix }) => {
  if (!text) return m.reply(`Contoh penggunaan: ${prefix + command} 10m Pemberitahuan penting`);

  const timeRegex = /(\d+)(m|h|d)/;
  const match = text.match(timeRegex);

  if (!match) {
    return m.reply("Format waktu tidak valid. Gunakan format seperti 10m, 1h, atau 1d.");
  }

  const timeValue = parseInt(match[1]);
  const timeUnit = match[2];
  let reminderText = text.replace(timeRegex, '').trim();

  if (!reminderText) {
    return m.reply("Tolong masukkan pesan pengingat setelah waktu.");
  }

  let ms = 0;
  if (timeUnit === 'm') ms = timeValue * 60 * 1000;
  if (timeUnit === 'h') ms = timeValue * 60 * 60 * 1000;
  if (timeUnit === 'd') ms = timeValue * 24 * 60 * 60 * 1000;

  const reminderTime = moment().add(ms, 'ms').toDate();

  await m.reply(`Pengingat untuk "${reminderText}" telah diatur dan akan dikirimkan pada ${moment(reminderTime).format('HH:mm:ss')} WIB.`);

  setTimeout(async () => {
    await conn.sendMessage(m.chat, {
      text: `⏰ Pengingat: ${reminderText}`,
    });
  }, ms);
};

handler.help = ['reminder <waktu> <pesan>'];
handler.tags = ['group'];
handler.command = /^(reminder)$/i;
handler.group = true;

export default handler;
