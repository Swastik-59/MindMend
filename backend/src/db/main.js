// Save a new chat message for a user, or create their chat doc if it doesn't exist
export async function saveChat(db, { uid, userMessage, aiResponse }) {
  const chat = {
    userMessage,
    aiResponse,
    timestamp: new Date(),
  };

  await db.collection("chats").updateOne(
    { uid },
    {
      $push: { chats: chat },
      $setOnInsert: { uid }, // ensures UID is set if doc is created
    },
    { upsert: true }
  );
}

// Get all chats for a given UID (or return empty array)
export async function getChatsByUid(db, uid) {
  const userDoc = await db.collection("chats").findOne({ uid });
  return userDoc?.chats || [];
}
