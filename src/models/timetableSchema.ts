import mongoose ,{Schema,Document}from "mongoose";

export interface Timetable extends Document{
    classroomId: mongoose.Schema.Types.ObjectId;
    subject: string;
 startTime: string;
  endTime: string; 
  day: string;

}


const TimetableSchema: Schema<Timetable> = new mongoose.Schema({
    classroomId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Classroom", 
      required: true 
    },
    subject: { type: String, required: true },
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true },  
    day: { type: String, required: true } 
  }, { timestamps: true });

  const timetableModel=(mongoose.models.Timetable as mongoose.Model<Timetable>) ||
  mongoose.model<Timetable>('TimeTable', TimetableSchema);

  export default timetableModel