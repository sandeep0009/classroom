import mongoose from "mongoose";



type ConnectionObject={
    isConnected?:number;
}

const connection:ConnectionObject={};


export async function dbConnect():Promise<void>{

    if(connection.isConnected){
        console.log("already connected to database");
        return;
    }
    try {

        const db=await mongoose.connect(process.env.DATABASE_URL || '',{});
        connection.isConnected=db.connections[0].readyState;
        console.log("database connected");
        
    } catch (error) {
        console.log("error in db connection",error);
        process.exit(1)
       
        
    }

}