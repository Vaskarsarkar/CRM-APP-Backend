
//controller to create a comment

const Comment = require("../models/comment.model");

exports.createComment = async (req, res) => {
    const commentObj = {
        content: req.body.content,
        ticketId: req.params.ticketId,
        commenterId: req.userId
    };

    try {
        const comment = await Comment.create(commentObj);
        
        return res.status(201).send(comment);
         
    } catch (err) {
        console.log("Error while creating comment", err);
        return res.status(500).json({ message: "Internal server error while creating comment" });
    }
};


//controller to get all comments for a ticket
exports.fetchComments = async (req, res) => {
    try {
        const comments = await Comment.find({ ticketId: req.params.ticketId });
        return res.status(200).send(comments);
    }catch (err) {           
        console.log("Error while fetching comments", err);
        return res.status(500).json({ message: "Internal server error while fetching comments" });
    }

}