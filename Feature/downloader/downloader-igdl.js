let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Masukkan URL jika ingin melakukan download!")
  }
  try {
    let igdl = await fetch(`https://btch.us.kg/download/igdl?url=${text}`)
    const data = await igdl.json()

    if (!data || !data.result) {
      return m.reply("Gagal mendapatkan data. Periksa URL dan coba lagi.")
    }

    let result = data.result

    if (Array.isArray(result)) {
      let photos = result.filter(item => item.type === "image").map(item => item.url)
      let videos = result.filter(item => item.type === "video").map(item => item.url)

      if (photos.length > 0) {
        for (let photo of photos) {
          await conn.sendMessage(m.chat, { image: { url: photo }, caption: "Done." }, { quoted: m })
        }
      }

      if (videos.length > 0) {
        for (let video of videos) {
          await conn.sendMessage(m.chat, { video: { url: video }, caption: "Done." }, { quoted: m })
        }
      }

      if (photos.length === 0 && videos.length === 0) {
        return m.reply("Tidak ditemukan foto atau video di URL ini.")
      }
    } else {
      return m.reply("Format data yang diterima tidak valid.")
    }
  } catch (error) {
    console.error(error)
    m.reply("Terjadi kesalahan saat mencoba mendownload. Pastikan URL valid.")
  }
}

handler.help = ['igdl']
handler.tags = ['downloader']
handler.command = /^(igdl)$/i
handler.limit = true

export default handler
