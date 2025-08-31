const express=require('express');
const router=express.Router();
const {accessChat,fetchChats, createGroupChat,addToGroup, renameGroup, removeFromGroup}=require("../controllers/chat.controller")
const Protect=require('../middleware/auth.middleware')


router.route("/").post(Protect,accessChat)
router.route("/").get(Protect,fetchChats)
router.route("/group").post(Protect,createGroupChat)
router.route("/rename").put(Protect,renameGroup)
router.route("/groupadd").put(Protect,addToGroup)
router.route("/groupremove").put(Protect,removeFromGroup)
module.exports=router;