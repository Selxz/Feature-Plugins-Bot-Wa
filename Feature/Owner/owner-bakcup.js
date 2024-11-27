import fs from 'fs';
import archiver from 'archiver';

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply("Fitur ini hanya untuk owner.");

  const backupFileName = `backup-${new Date().toISOString().replace(/:/g, '-')}.zip`;

  try {
    const output = fs.createWriteStream(backupFileName);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      m.reply(`📦 Backup selesai. Ukuran file: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      conn.sendMessage(m.chat, {
        document: { url: `./${backupFileName}` },
        mimetype: 'application/zip',
        fileName: backupFileName,
        caption: 'Berikut adalah file backup bot Anda.',
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    archive.glob('**/*', {
      ignore: ['node_modules/**', '.npm/**', '.cache/**', 'session/**', `${backupFileName}`],
    });

    await archive.finalize();
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat membuat backup.");
  }
};

handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = /^(backup)$/i;
handler.owner = true;

export default handler;
