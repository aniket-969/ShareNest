import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { httpServer } from "./app.js";

dotenv.config({
  path: "./env",
}); 

const startServer =async ()=>{
  httpServer.listen(process.env.PORT || 3000, () => {
    
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
 
}; 
 
connectDB() 
  .then(() => {
   startServer()
  })
  .catch((err) => {
    console.log("Connection failed at port", err);
  });
