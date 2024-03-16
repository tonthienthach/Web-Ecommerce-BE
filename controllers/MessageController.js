const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.messageHandler = async (io) => {
  io.on("connect", (socket) => {
    console.log("nguoi dung ket noi");
    socket.on("sendMessage", async (data) => {
      const conversation = await Conversation.findOne({ user: data.user });
      let newMessage = null;
      if (conversation) {
        newMessage = new Message({
          conversation: conversation._id,
          sender: data.admin || data.user,
          textMessage: data.textMessage,
          file: data.file,
        });
        conversation.lastMessage = newMessage._id;
        await newMessage.save();
        await conversation.save();
        console.log("luu thanh cong1");
      } else {
        const newConversation = new Conversation({
          user: data.user,
          lastSeen: [],
        });
        await newConversation.save();
        newMessage = new Message({
          conversation: newConversation._id,
          sender: data.admin || data.user,
          textMessage: data.textMessage,
          file: data.file,
        });

        newConversation.lastMessage = newMessage;

        await newMessage.save();
        await newConversation.save();
        console.log("luu thanh cong2");
      }
      console.log(newMessage);
      const allConversation = await Conversation.find()
        .populate(["user", "lastMessage"])
        .sort({
          updatedAt: -1,
        });

      io.emit(`CHAT_${data.user}`, newMessage);
      io.emit("get_conversation", allConversation);
      io.emit(`notify_${data.user}`, data.user);
    });
    socket.on("sendLastSeen", async (data) => {
      if (!data.conversationId) {
        return;
      }
      const conversation = await Conversation.findById(
        data.conversationId.conversation
      );
      let haveLastSeen = false;
      conversation.lastSeen.forEach((item) => {
        if (item.user == data.userId) {
          item.message = data.conversationId;
          haveLastSeen = true;
        }
      });
      if (!haveLastSeen) {
        conversation.lastSeen.push({
          user: data.userId,
          message: data.conversationId,
        });
      }
      await conversation.save();
    });
  });

  io.on("disconnect", (socket) => {
    console.log("nguoi dung ngat ket noi");
  });
};

exports.getMessageByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const conversation = await Conversation.findOne({ user: userId });
    const listMessage = await Message.find({ conversation: conversation._id });

    res.status(200).json({
      success: true,
      data: listMessage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "get message err",
    });
  }
};

exports.getAllConversation = async (req, res) => {
  const allConversation = await Conversation.find()
    .populate(["user", "lastMessage"])
    .sort({
      updatedAt: -1,
    });
  return res.status(200).json({
    success: true,
    data: allConversation,
  });
};

exports.updateLastSeen = async (req, res) => {
  const { messageId, user } = req.body;
  if (!messageId) {
    return;
  }
  try {
    const message = await Message.findById(messageId);
    const conversation = await Conversation.findById(message.conversation);
    let haveLastSeen = false;
    console.log(conversation);
    conversation.lastSeen.forEach((item) => {
      if (item.user == user) {
        item.message = message;
        haveLastSeen = true;
      }
    });
    if (!haveLastSeen) {
      conversation.lastSeen.push({
        user: user,
        message: message,
      });
    }
    await conversation.save();
    const allConversation = await Conversation.find()
      .populate(["user", "lastMessage"])
      .sort({
        updatedAt: -1,
      });
    res.status(200).json({
      success: true,
      data: allConversation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "cant update lastseen",
    });
  }
};

exports.getConversationByUser = async (req, res) => {
  const userId = req.userId;
  const conversation = await Conversation.findOne({ user: userId }).populate([
    "user",
    "lastMessage",
  ]);
  return res.status(200).json({
    success: true,
    data: conversation,
  });
};
