const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  username: {
    type: String,
    unique: true
  },

  theme: {
    type: String
  },

  content: {
    type: Object
  },

  profilePictureUrl: {
    type: String
  },

  socialLinks: {
    type: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String },
      other: [
        {
          label: { type: String },
          url: { type: String }
        }
      ]
    },
    default: {}
  },

  projects: [
    {
      title: { type: String },
      description: { type: String },
      techStack: [{ type: String }],
      githubUrl: { type: String },
      liveUrl: { type: String },
      screenshotUrl: { type: String }
    }
  ],

  experience: [
    {
      company: { type: String },
      role: { type: String },
      duration: { type: String },
      description: { type: String }
    }
  ],

  education: [
    {
      institution: { type: String },
      degree: { type: String },
      year: { type: String }
    }
  ],

  isPublished: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Portfolio", portfolioSchema);