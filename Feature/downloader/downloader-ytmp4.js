/*
Thanks Shannz For Scraper
*/
import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Harap masukkan URL video YouTube.");

  try {
    m.reply("⏳ Sedang memproses unduhan...");

    const ytdl = async (query) => {
      const form = new FormData();
      form.append('query', query);

      const response = await axios.post('https://yttomp4.pro/', form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const $ = cheerio.load(response.data);

      const results = {
        success: true,
        title: $('.vtitle').text().trim(),
        duration: $('.res_left p').text().replace('Duration: ', '').trim(),
        image: $('.ac img').attr('src'),
        video: [],
        audio: [],
      };

      $('.tab-item-data').each((index, tab) => {
        const tabTitle = $(tab).attr('id');
        $(tab)
          .find('tbody tr')
          .each((i, element) => {
            const fileType = $(element).find('td').eq(0).text().trim();
            const fileSize = $(element).find('td').eq(1).text().trim();
            const downloadLink = $(element).find('a.dbtn').attr('href');

            if (tabTitle === 'tab-item-1') {
              results.video.push({
                fileType,
                fileSize,
                downloadLink,
              });
            } else if (tabTitle === 'tab-item-2') {
              results.audio.push({
                fileType,
                fileSize,
                downloadLink,
              });
            }
          });
      });

      return results;
    };

    const data = await ytdl(text);

    if (!data.success) return m.reply("Gagal memproses video. Coba lagi.");

    const { title, duration, image, video } = data;
    const videoInfo = video.map((v) => `🔹 ${v.fileType} - ${v.fileSize}`).join('\n');

    const message = `
🎥 *Judul:* ${title}
🕒 *Durasi:* ${duration}

📥 *Video Tersedia:*
${videoInfo || 'Tidak ada video tersedia'}
`;

    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption: message,
      footer: "Mengunduh video dengan kualitas terbaik...",
    });

    if (video.length > 0) {
      const bestVideo = video[0]; // Pilih video kualitas terbaik
      await conn.sendMessage(m.chat, {
        video: { url: bestVideo.downloadLink },
        caption: `🎥 *Judul:* ${title}\n📦 *Ukuran:* ${bestVideo.fileSize}\n⚡ *Format:* ${bestVideo.fileType}`,
      });
    } else {
      m.reply("Video tidak tersedia untuk diunduh.");
    }
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kesalahan saat memproses unduhan.");
  }
};

handler.help = ['ytdl'];
handler.tags = ['downloader'];
handler.command = /^(ytdl|youtubedl|ytmp4)$/i;

export default handler;
