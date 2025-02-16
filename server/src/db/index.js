import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  try {
 const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
 
 console.log('\n connected '+ connectionInstance.connection.host);
     
  } catch (error) {
    console.log("mongodb Error", error);
    process.exit(1)
  }
};
 
export default connectDB