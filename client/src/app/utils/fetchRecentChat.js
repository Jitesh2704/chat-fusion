import AuthService from "../services/auth-service/auth.service";
import ChatUserService from "../services/chat-service/chat-user.service";
import MessageService from "../services/chat-service/messages.service";

export const fetchRecentChats = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const chatUsersResponse = await ChatUserService.getAllChatUsers(
      1,
      10000,
      [],
      { user_id: userId }
    );

    const chatIds = chatUsersResponse.data.map((chatUser) => chatUser.chat_id);

    const messagesPromises = chatIds.map((chatId) =>
      MessageService.getAllMessages(1, 10000, [], { chat_id: chatId })
    );

    const messagesResponses = await Promise.all(messagesPromises);
    const allMessages = messagesResponses.flatMap((response) => response.data);

    // Filter messages to only include those received by the current user today
    const todayMessages = allMessages.filter((message) => {
      const messageDate = new Date(message.cdate_time);
      return messageDate >= today && message.sender !== userId; // Exclude messages sent by the current user
    });

    const senderIds = [...new Set(todayMessages.map((msg) => msg.sender))];

    // Fetch details for each sender
    const userDetailsPromises = senderIds.map((id) =>
      AuthService.getAuthUser({ user_id: id })
    );
    const userDetails = await Promise.all(userDetailsPromises);

    return userDetails.map((userDetail, index) => {
      const latestMessage = todayMessages
        .filter((message) => message.sender === userDetail.data.user_id)
        .sort((a, b) => new Date(b.cdate_time) - new Date(a.cdate_time))[0];
      const timeAgo = calculateTimeAgo(latestMessage.cdate_time);

      const chatId = latestMessage.chat_id;

      console.log("fetched chatId", chatId);
      return {
        chatId: chatId,
        name: `${userDetail.data.fname} ${userDetail.data.lname}`,
        username: userDetail.data.username,
        fname: userDetail.data.fame,
        lname: userDetail.data.lname,
        profile_image: userDetail.data.profile_image,
        time: timeAgo,
      };
    });
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    return [];
  }
};

const calculateTimeAgo = (dateTime) => {
  const messageDate = new Date(dateTime);
  const now = new Date();
  const difference = now - messageDate;
  const hoursAgo = Math.floor(difference / (1000 * 60 * 60));
  return `${hoursAgo}hr ago`;
};
