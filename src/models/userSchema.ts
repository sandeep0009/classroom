import mongoose, { Schema ,Document} from "mongoose";



export interface User extends Document{
    email:string;
    name:string;
    password:string;
    role: "principal" | "teacher" | "student";
    classroomId?: mongoose.Schema.Types.ObjectId;

}

const UserSchema:Schema<User>=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/.+\@.+\..+/,'please enter valid email address']
    },
    name:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["principal","student","teacher"],
        required:true
    },
    classroomId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Classroom"
    }

},{timestamps:true})

const userModel=  (mongoose.models.User as mongoose.Model<User>) ||
mongoose.model<User>('User', UserSchema);

export default userModel;