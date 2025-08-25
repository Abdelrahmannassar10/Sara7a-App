import express from 'express';
import { bootstrap } from './app.controller.js';
import dotenv from "dotenv";
import schedule from 'node-schedule';
import { User } from './DB/models/user.model.js';
import { deleteFile } from './utilies/cloud/cloudinary.config.js';
import Message from './DB/models/message.model.js';
dotenv.config({path:"./config/local.env"});
schedule.scheduleJob('0 0 7 * *', async() => {
  const users = await User.find({deletedAt:{$lte:Date.now() - 30*24*60*60*1000}});
  for(const user of users) {
    if(user.profilePicture.public_id) {
      await deleteFile(`saraha_App/users/${user._id}`);
    }
  }
  await User.deleteMany({deletedAt:{$lte:Date.now() - 30*24*60*60*1000}});
  await Message.deleteMany({
    receiver:{$in:users.map(user => user._id)},
  });
  console.log(`Deleted ${users.length} users and their messages`);

});
const app = express();
const PORT = process.env.PORT;
bootstrap(express, app);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});