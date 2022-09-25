const router = require("express").Router();
require("dotenv").config();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: process.env.USETLS
});

const Vote = require("../models/Vote");

router.get("/", async (req, res) => {
    try {
        const votes = await Vote.find({});

        return res.status(200).json({
            success: true,
            message: "Get votes success",
            votes: votes
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "Get votes fail"
        })
    }
})

router.post("/", async (req, res) => {
    try {
        let newVote = new Vote({
            os: req.body.os,
            points: 1
        })

        newVote = await newVote.save();

        const votes = await Vote.find({});

        pusher.trigger("os-poll", "os-vote", {
            points: newVote.points,
            os: newVote.os,
            totalVotes: votes.length
        })
    
        return res.status(200).json({
            success: true,
            message: "Thank you for voting"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "Vote fail"
        })        
    }
})

module.exports = router;