import mongoose, { Schema ,Document} from "mongoose";



export interface User extends Document{
    email:string;
   
    password:string;
    role: "principal" | "teacher" | "student";
    classroomId?: mongoose.Schema.Types.ObjectId;

}

const UserSchema:Schema<User>=new mongoose.Schema({
    email:{
        type:String,
       
        unique:true,
        match:[/.+\@.+\..+/,'please enter valid email address']
    },
   
    password:{
        type:String,
        
    },
    role:{
        type:String,
        enum:["principal","student","teacher"]
    },
    classroomId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Classroom"
    }

},{timestamps:true})

const userModel=  (mongoose.models.User as mongoose.Model<User>) ||
mongoose.model<User>('User', UserSchema);

export default userModel;