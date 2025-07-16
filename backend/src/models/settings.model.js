import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  
  preferredTimeSlots: {
    type: [String]
  },
  
  availableDays: {
    type: [String]
  },
  
  timeBlocksToAvoid: {
    type: String
  },
  
  bufferTime: {
    type: Number
  },
  
  workingHours: {
    start: {
      type: String
    },
    end: {
      type: String
    }
  },
  
  breakPreferences: {
    type: Number
  },
  
  productivityHours: {
    type: [String]
  },
  
  recurringPatterns: {
    type: String
  },
  
  deadlineFlexibility: {
    type: String,
    enum: ['firm', 'flexible']
  },
  
  minTimeBlock: {
    type: Number
  }
}, {
  timestamps: true
});

export const Settings = mongoose.model('Settings', settingsSchema);