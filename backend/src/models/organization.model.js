import mongoose from "mongoose";
import { Schema } from 'mongoose';

const organizationSchema = new mongoose.Schema({
    orgName:{
        type:String,
        default:"New Organization",
    },
    members:[
        {
            type:Schema.Types.Mixed,
            default:[],
        }
    ]
},
{timestamps:true}
)

export const Organization = mongoose.model("Organization",organizationSchema);