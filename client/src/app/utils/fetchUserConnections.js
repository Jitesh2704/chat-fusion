import AuthService from "../services/auth-service/auth.service";
import ChatService from "../services/chat-service/chat.service";

export const fetchUserConnections = async (userId) => {
  try {
    const response = await ChatService.getAllChats(1, 1000000000000000, [], {});

    console.log(response.data, "fetched all chats");

    // Peers whom I have requested
    const requestedPeers = response.data
      .filter(
        (e) =>
          e.chat_type === "Personal" &&
          e.requested_by === userId &&
          e.requested_to[0].chat_status === "Accepted"
      )
      .map((r) => ({
        chat_id: r.chat_id,
        user_id: r.requested_to[0].user_id,
      }));

    // Connects who requested to me
    const incomingPeers = response.data
      .filter(
        (e) =>
          e.chat_type === "Personal" &&
          e.requested_to[0].user_id === userId &&
          e.requested_to[0].chat_status === "Accepted"
      )
      .map((u) => ({
        chat_id: u.chat_id,
        user_id: u.requested_by,
      }));

    const finalList = [...requestedPeers, ...incomingPeers];

    // Fetch details for each user along with their chat_id
    const userDetailsPromises = finalList.map(async ({ chat_id, user_id }) => {
      const userDetails = await AuthService.getAuthUser({ user_id }, []);
      return { chat_id, userDetails };
    });
    const userDetails = await Promise.all(userDetailsPromises);

    return userDetails; // Returns an array of objects with chat_id and userDetails
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    return [];
  }
};
