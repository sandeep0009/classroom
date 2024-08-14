import mongoose, { Schema, Document, Model } from "mongoose";

export interface Timetable extends Document {
    classroomId: mongoose.Schema.Types.ObjectId;
    subject: string;
    startTime: string;
    endTime: string;
    day: string;
}

const TimetableSchema: Schema<Timetable> = new Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        
    },
    subject: { type: String },
    startTime: { type: String},
    endTime: { type: String },
    day: { type: String },
}, { timestamps: true });

const TimetableModel: Model<Timetable> = mongoose.models.Timetable || mongoose.model<Timetable>('Timetable', TimetableSchema);

export default TimetableModel;
