let handler = async (m, { conn }) => {
  let owner = '6282181938329@s.whatsapp.net'; // Nomor owner
  let participants = await conn.groupMetadata(m.chat).then(group => group.participants);
  let users = participants
    .map(participant => participant.id)
    .filter(user => !(user === owner || user === conn.user.jid));

  for (let user of users) {
    if (user.endsWith('@s.whatsapp.net')) {
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
    }
  }
};
handler.help = ['kickall'];
handler.tags = ['admin'];
handler.command = /^(kickall)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
