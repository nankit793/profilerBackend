const express = require("express");
const app = express();
const userData = require("../models/BasicUserInfo");

app.get("", async(req, res)=>{
    try {
        // if(res.headers.search === "")
        // {
        //     return res.status(400).json({message: "no userid or username provided"})
        // }
        const users = await userData.find({"userid" : {$regex : req.headers.search}});
        const userList = []
        users.map((user)=>{
            userList.push({ id: user.userid, name: user.name })
        })
        res.status(200).json(userList)
    } catch (error) {
        res.status(400).json({message: error})   
    }
})

module.exports = app