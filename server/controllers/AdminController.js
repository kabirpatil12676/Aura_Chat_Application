import User from "../model/UserModel.js";
import Message from "../model/MessagesModel.js";
import Channel from "../model/ChannelModel.js";
import Feedback from "../model/FeedbackModel.js";

export const getAdminStats = async (request, response, next) => {
    try {
        const userCount = await User.countDocuments();
        const messageCount = await Message.countDocuments();
        const channelCount = await Channel.countDocuments();

        return response.status(200).json({
            stats: {
                users: userCount,
                messages: messageCount,
                channels: channelCount,
            },
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getAdminUsers = async (request, response, next) => {
    try {
        const users = await User.find({}, "email firstName lastName profileSetup image");
        return response.status(200).json({ users });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getAdminChannels = async (request, response, next) => {
    try {
        const channels = await Channel.find({})
            .populate("admin", "firstName lastName email")
            .populate("members", "firstName lastName email");
        return response.status(200).json({ channels });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getAdminFeedbacks = async (request, response, next) => {
    try {
        const feedbacks = await Feedback.find({}).sort({ timestamp: -1 });
        return response.status(200).json({ feedbacks });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};
