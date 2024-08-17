import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: "principal" | "teacher" | "student";
    classroomId?: mongoose.Schema.Types.ObjectId;
}


const UserSchema: Schema<User> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["principal", "student", "teacher"],
            required: true,
        },
        classroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Classroom",
        },
    },
    { timestamps: true }
);


const userModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default userModel;
