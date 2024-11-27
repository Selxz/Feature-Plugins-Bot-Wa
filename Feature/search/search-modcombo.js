import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Tolong masukkan nama aplikasi untuk dicari mod-nya.");
  }

  try {
    const results = await modCombo(text);

    if (results.length === 0) {
      return m.reply("Tidak ditemukan mod combo untuk aplikasi yang Anda cari.");
    }

    let caption = `Hasil pencarian modcombo untuk *${text}*:\n\n`;

    results.forEach((result, index) => {
      caption += `
${index + 1}. *Title:* ${result.title}
*Link:* ${result.link}
*Date:* ${result.date}
*Image:* ${result.image}
\n`;
    });

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
  } catch (error) {
    console.error("Error in search modcombo:", error);
    m.reply("Terjadi kesalahan saat mencari mod combo.");
  }
};

async function modCombo(apk) {
  try {
    const ress = await axios.get(`https://modcombo.com/id/?s=${apk}`);
    const $ = cheerio.load(ress.data);

    const results = [];

    $('ul.blogs.w3 > li').each((index, element) => {
      const link = $(element).find('a.blog.search').attr('href');
      const title = $(element).find('div.title').text().trim();
      const image = $(element).find('img.thumb').attr('data-src') || $(element).find('img.thumb').attr('src');
      const time = $(element).find('time').attr('datetime');

      if (link && title && image && time) {
        const date = new Date(time);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        results.push({ title, link, image, date: formattedDate });
      }
    });

    return results;
  } catch (error) {
    console.error('Error In Modcombo Is Error Message:', error.message);
    return [`error: ${error.message}`];
  }
}

handler.help = ['modcombo'];
handler.tags = ['search'];
handler.command = /^(modcombo)$/i;
handler.group = false;

export default handler;
