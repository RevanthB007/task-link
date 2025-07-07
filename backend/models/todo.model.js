import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const TodoSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:[true,"user id is required"],
    },
    id:{
        type:String,
        default:uuidv4,
        unique:true,
    },
    title:{
        type:String,
        required:[true,"todo text is reuired"],
        minlength:[2,"min length is 2"]
    },
    description:{
        type:String,
        required:false,
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
    assignedTo:{
        type:Schema.Types.Mixed,
        default:[],
    },
    assignedAt:{
        type:Date,
        default:null,
    },
    // assignedBy:{
    //     type:String,
    //     default:null,
    // },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium",
    },
    orgId:{
        type:String,
        default:null,
    },
    
},
{timestamps:true});

export const Todo = mongoose.model('Todo',TodoSchema);