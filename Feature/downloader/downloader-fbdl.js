let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("Tidak ada URL yang terdeteksi.")
  }
  try {
    let api = await fetch(`https://btch.us.kg/download/fbdown?url=${text}`)
    let data = await api.json()

    if (!data.result || (!data.result.hd && !data.result.sd)) {
      return m.reply("Gagal mengambil video. URL mungkin tidak valid.")
    }

    let videoUrl = data.result.hd || data.result.sd
    await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: "Video berhasil didownload." }, { quoted: m })
  } catch (e) {
    console.error(e.message)
    m.reply("Gagal mendownload video. Silakan coba lagi.")
  }
}

handler.help = ["fbdl <url FB>"]
handler.tags = ["downloader"]
handler.command = /^(fbdl)$/i
handler.limit = true

export default handler
