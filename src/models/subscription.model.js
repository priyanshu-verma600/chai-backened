import mongoose , {Schema} from "mongoose"
import { User } from "./user.model.js"


const subscriptionSchema = new Schema({
    subscriber: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    
    channel:{
        types:Schema.Types.ObjectId,
        ref:"User"
    },
    
}, {timestamps:true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)