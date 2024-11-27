/*
Gk Tau Worek Apa Kagak
*/

let onlineMembers = new Set();

conn.on('presence.update', (status) => {
  if (status && status.chat === m.chat) {
    if (status.presence === 'available') {
      onlineMembers.add(status.id);
    } else {
      onlineMembers.delete(status.id);
    }
  }
});

let getOnlineParticipants = async (chatId) => {
  return Array.from(onlineMembers);
};

let handler = async (m, { conn }) => {
  let groupMeta = await conn.groupMetadata(m.chat)
  let participants = groupMeta.participants

  let admins = participants.filter(p => p.isAdmin).map(p => p.id)
  let members = participants.filter(p => !p.isAdmin).map(p => p.id)

  let onlineParticipants = await getOnlineParticipants(m.chat)
  let online = participants.filter(p => onlineParticipants.includes(p.id)).map(p => p.id)
  let offline = members.filter(p => !online.includes(p))

  let status = `
Group Name: ${groupMeta.subject}
Group ID: ${m.chat}
Total Members: ${participants.length}
Admins: ${admins.length}
Members: ${members.length}
Online Members: ${online.length}
Offline Members: ${offline.length}
  `.trim()

  await conn.sendMessage(m.chat, { text: status }, { quoted: m })
}

handler.help = ['statusgc']
handler.tags = ['group']
handler.command = /^(statusgc)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
