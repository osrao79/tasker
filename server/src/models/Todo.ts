import mongoose, { Schema } from "mongoose";


const TodoSchema = new Schema({
  task:{
    type:Schema,
    require:true
  },
  status:{
    type:String,
    require:true
  },
  order:{
    type:Number,
    require:true
  }
})

export const TodoModel = mongoose.model('Todo', TodoSchema)