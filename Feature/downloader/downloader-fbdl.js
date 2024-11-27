let handler = async (m, { conn, text }) => {
   if (!text) {
     return m.reply("Tidak Ada Url Yang Terdeteksi")
   } 
   try {
     let api = await fetch(`https://btch.us.kg/download/fbdown?url=${text}`)
     let data = await api.json()
     await conn.sendMessage(m.chat, { video: { url: data.result.hd }, caption: "Done." }, { quoted: m })
   } catch (e) {
     return m.reply("Gagal Mendownloas") 
     console.log(e.message)
   }
}

handler.help = ["fbdl < Url FB >"]
handler.tags = ["downloader"] 
handler.command = /^(fbdl)$/i;
handler.limit = true

export default handler