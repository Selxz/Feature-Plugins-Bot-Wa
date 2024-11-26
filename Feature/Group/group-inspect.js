let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Tolong masukkan link grup yang ingin diinspeksi.");

  const linkRegex = /https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]{20,25})/;
  const match = text.match(linkRegex);
  
  if (!match) return m.reply("Link grup tidak valid.");

  const groupId = match[1];

  try {
    const groupMetadata = await conn.groupMetadata(groupId);
    const participants = groupMetadata.participants;
    const groupInfo = {
      groupId: groupId,
      groupName: groupMetadata.subject,
      owner: groupMetadata.owner,
      creationDate: new Date(groupMetadata.creation * 1000).toLocaleString(),
      participantsCount: participants.length,
      participantsList: participants.map(participant => {
        return {
          id: participant.id,
          isAdmin: participant.admin,
          number: participant.id.split('@')[0],
        };
      }),
    };

    let infoText = `*Group Information*\n`;
    infoText += `Group ID: ${groupInfo.groupId}\n`;
    infoText += `Group Name: ${groupInfo.groupName}\n`;
    infoText += `Owner: ${groupInfo.owner.split('@')[0]}\n`;
    infoText += `Creation Date: ${groupInfo.creationDate}\n`;
    infoText += `Total Participants: ${groupInfo.participantsCount}\n`;

    infoText += `\n*Participants List:*\n`;
    groupInfo.participantsList.forEach(participant => {
      infoText += `- ${participant.number} ${participant.isAdmin ? '(Admin)' : ''}\n`;
    });

    await conn.sendMessage(m.chat, { text: infoText }, { quoted: m });
  } catch (error) {
    console.error("Error inspecting group:", error);
    m.reply("Terjadi kesalahan saat mengambil data grup.");
  }
};

handler.help = ['inspectgroup'];
handler.tags = ['group'];
handler.command = /^(inspectgroup)$/i;
handler.group = true;
handler.admin = true;

export default handler;
