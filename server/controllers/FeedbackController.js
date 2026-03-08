import Feedback from "../model/FeedbackModel.js";

export const submitFeedback = async (request, response, next) => {
    try {
        const { rating, feedback } = request.body;

        if (!rating || !feedback) {
            return response.status(400).send("Rating and feedback text are required.");
        }

        const newFeedback = await Feedback.create({
            user: request.userId,
            rating,
            feedback,
        });

        return response.status(201).json({
            message: "Feedback submitted successfully.",
            feedback: newFeedback,
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return response.status(500).send("Internal Server Error");
    }
};
