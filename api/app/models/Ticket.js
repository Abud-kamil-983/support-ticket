var mongoose = require('mongoose');
var  Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var TicketSchema = new Schema({
  title:{type:String, required:true},
  description:{type:String, required:true},
  askedBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },

  file:String,

  answers: [
    { body: String, 
      answerBy:String, 
      date: {
      type: Date,
      default: Date.now
      } 
    }
  ],

  status:{
    type:String,
    default:'O'
  },

  created: {
    type: Date,
    default: Date.now
  },
  
});

mongoose.model('Ticket', TicketSchema);