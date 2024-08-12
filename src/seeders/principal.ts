import { dbConnect } from "@/lib/dbConnect";
import userModel from "@/models/userSchema";

 async function createPrincipal():Promise<void>{
    try {

        await dbConnect();

        const principalExist=await userModel.findOne({role:'principal'});

        if(principalExist){
            
            throw new Error("already exist principal")
            return;
        }

        const createPrincipal=await userModel.create({
            data:{
              
                role:"principal",
                email:"principal@gmail.com",
                password:"12"
            }

        })

        await createPrincipal.save();
        return 
        
        
    } catch (error) {
        console.log("error in the create principal",error)
        return;
        
    }
}


createPrincipal();