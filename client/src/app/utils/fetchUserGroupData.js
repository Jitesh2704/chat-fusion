import ChatService from "../services/chat-service/chat.service";

export const fetchUserGroupData = async (userId) => {
  try {
    const response = await ChatService.getAllChats(1, 1000000000000000, [], {});

    console.log(response.data, "fetched all chats");

    // groups i created
    const createdGroups = response.data.filter(
      (e) => e.chat_type === "Group" && e.requested_by === userId
    );

    // Groups I am a member of
    const memberGroups = response.data.filter(
      (e) =>
        e.chat_type === "Group" &&
        e.requested_to.some((request) => request.user_id === userId)
    );

    const finalList = [...createdGroups, ...memberGroups];

    return finalList;
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    return [];
  }
};
