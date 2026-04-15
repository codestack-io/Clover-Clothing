"use server";
import collapse from "daisyui/components/collapse";
import { Collection } from "../../app/lib/dbConnect";
import { dbConnect } from "../../app/lib/dbConnect";
import bcrypt from "bcryptjs";

export const postuser = async (payload) => {
  const { email, password, name } = payload;

  // Validate payload
  if (!email || !password || !name) {
    return { success: false, message: "Name, email, and password are required" };
  }

  try {
    // Get MongoDB collection
    const collection = await dbConnect(Collection.USERS);
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const isExist = await collection.findOne({  email: normalizedEmail  });
    if (isExist) {
      return { success: false, message: "User already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 14);

    // Create new user object
    const newUser = {
      provider: "credentials",
      name,
      email : normalizedEmail,
      password: hashedPassword,
    };

    // Insert the user
    const result = await collection.insertOne(newUser);

    if (result.acknowledged) {
      return {
        success: true,
        insertedId: result.insertedId.toString(),
        message: "User registered successfully",
      };
    } else {
      return { success: false, message: "Failed to insert user" };
    }
  } catch (error) {
    console.error("Error in postuser:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const loginUser = async(payload)=>{
  const { email, password } = payload;
  if(!email || !password ) return null;

   const collection = await dbConnect(Collection.USERS);
    const normalizedEmail = email.toLowerCase();
  const user = await dbConnect(Collection.USERS).findOne({ email: normalizedEmail  });
  if(!user) return null;

  const isMatched = await bcrypt.compare(password,user.password);
  if(isMatched){
    return user;
  } else{
    return null;
  }
}