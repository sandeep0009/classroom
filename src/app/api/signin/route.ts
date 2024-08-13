import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

    
        const { email, password, role } = data;

        if (!email || !password || !role) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

   
        const userExist = await userModel.findOne({ email });

        if (userExist) {
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

     
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            role
        });

        return NextResponse.json({ message: "User successfully created", newUser }, { status: 201 });
        
    } catch (error) {
        console.error("Error in the POST route for signup", error);
        return NextResponse.json({ message: "Error in signup" }, { status: 500 });
    }
}
