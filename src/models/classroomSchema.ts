import mongoose,{Document, Schema} from "mongoose";

export interface Classroom extends Document{
    name:string;
    startTime:string;
    endTime:string;
    daysInSession:string[];
    teacherId?:mongoose.Schema.Types.ObjectId;
    studentIds?: mongoose.Schema.Types.ObjectId[];
}


const classroomSchema:Schema<Classroom>=new mongoose.Schema({
    name: { type: String, required: true },
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true },   
    daysInSession: { type: [String], required: true },
    teacherId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    studentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
    }],
  }, { timestamps: true }
)


const classroomModel= (mongoose.models.Classroom as mongoose.Model<Classroom>) ||
mongoose.model<Classroom>('Classroom', classroomSchema);

export default classroomModel