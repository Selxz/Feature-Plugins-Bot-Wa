import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Tolong masukkan judul film yang ingin dicari.");
  }

  try {
    const response = await axios.get(`https://nontonfilmgratis.club/?s=${text}`);
    const $ = cheerio.load(response.data);
    let results = [];

    $('article.item').each((i, element) => {
      const title = $(element).find('.entry-title a').text().trim();
      const link = $(element).find('.entry-title a').attr('href');
      const image = $(element).find('.content-thumbnail img').attr('src');
      const rating = $(element).find('.gmr-rating-item').text().trim();
      const duration = $(element).find('.gmr-duration-item').text().trim();
      const quality = $(element).find('.gmr-quality-item a').text().trim();
      const categories = [];
      
      $(element).find('.gmr-movie-on a[rel="category tag"]').each((j, cat) => {
        categories.push($(cat).text().trim());
      });

      const country = $(element).find('.gmr-movie-on span[itemprop="contentLocation"] a').text().trim();
      const director = $(element).find('.screen-reader-text [itemprop="director"] [itemprop="name"]').text().trim();
      const trailer = $(element).find('.gmr-popup-button a').attr('href');

      results.push({ title, link, image, rating, duration, quality, categories, country, director, trailer });
    });

    if (results.length === 0) {
      return m.reply("Tidak ada film yang ditemukan.");
    }

    const result = results[0];
    let caption = `
*Title:* ${result.title}
*Link:* ${result.link}
*Rating:* ${result.rating}
*Durasi:* ${result.duration}
*Quality:* ${result.quality}
*Kategori:* ${result.categories.join(", ")}
*Negara:* ${result.country}
*Director:* ${result.director}
*Trailer:* ${result.trailer}
    `;

    await conn.sendMessage(m.chat, { image: { url: result.image }, caption }, { quoted: m });
  } catch (error) {
    console.error("Error fetching movie data:", error);
    m.reply("Terjadi kesalahan saat mengambil data film.");
  }
};

handler.help = ['bioskop'];
handler.tags = ['search'];
handler.command = /^(bioskop)$/i;
handler.group = false;

export default handler;
