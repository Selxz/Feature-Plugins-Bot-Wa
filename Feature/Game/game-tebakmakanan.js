import fs from 'fs';

const tebakMakananData = JSON.parse(fs.readFileSync('./tebakmakanan.json', 'utf-8'));
const activeGames = {};

let handler = async (m, { conn, command }) => {
  if (command === 'tebakmakanan') {
    if (activeGames[m.chat]) {
      return m.reply("Masih ada permainan yang berlangsung. Jawab dulu sebelum memulai permainan baru.");
    }

    const randomData = tebakMakananData[Math.floor(Math.random() * tebakMakananData.length)];
    const { img, deskripsi, jawaban } = randomData;

    activeGames[m.chat] = { jawaban, pemain: m.sender };

    await conn.sendMessage(m.chat, {
      caption: deskripsi,
      image: { url: img },
      footer: "Ketik jawabanmu di chat. Kamu punya waktu 30 detik!",
    });

    setTimeout(() => {
      if (activeGames[m.chat]) {
        delete activeGames[m.chat];
        m.reply(`Waktu habis! Jawaban yang benar adalah *${jawaban}*.`);
      }
    }, 30000); // 30 detik
  }

  if (command === 'jawab') {
    if (!activeGames[m.chat]) return m.reply("Tidak ada permainan yang sedang berlangsung.");
    if (activeGames[m.chat].pemain !== m.sender) return m.reply("Hanya pemain yang memulai permainan yang dapat menjawab.");

    const userAnswer = m.text.toLowerCase();
    const correctAnswer = activeGames[m.chat].jawaban.toLowerCase();

    if (userAnswer === correctAnswer) {
      m.reply(`🎉 Selamat! Jawaban kamu benar: *${activeGames[m.chat].jawaban}*`);
      delete activeGames[m.chat];
    } else {
      m.reply("Jawabanmu salah. Coba lagi!");
    }
  }
};

handler.help = ['tebakmakanan', 'jawab'];
handler.tags = ['game'];
handler.command = /^(tebakmakanan|jawab)$/i;

export default handler;
