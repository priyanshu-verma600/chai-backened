import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)



/*    // important points.
 Meaning:
avatar is a required field in your user profile.

It stores a URL string pointing to the profile picture of the user.

This image is usually uploaded to a cloud-based image hosting service, like Cloudinary, and the returned URL is saved in this field.

🧠 Real-World Example:
Imagine you are signing up for a platform like Twitter or Instagram:

The signup form asks you to upload a profile picture (your face or logo).

You upload the image.

Your backend uses Cloudinary (or similar service) to store the image online.

Cloudinary gives a URL like:

ruby
Copy
Edit
https://res.cloudinary.com/myapp/image/upload/v1687404739/profile_123.jpg
That URL gets saved in the avatar field of your User document.

So when someone views your profile, your app can show your profile picture using that URL.

🔹 What Is coverImage?
js
Copy
Edit
coverImage: {
  type: String // cloudinary url
}
✅ Meaning:
coverImage is optional.

It also stores a URL to an image, just like avatar.

This image is usually shown as a banner or background at the top of your profile — like in Facebook or Twitter.

🧠 Real-World Example:
You visit someone’s Twitter profile:

You see their profile photo (avatar) in a circle.

Behind that is a large banner image across the top — that’s the cover image.

When a user uploads this banner image:

It’s stored in Cloudinary.

Cloudinary gives a URL like:

ruby
Copy
Edit
https://res.cloudinary.com/myapp/image/upload/v1687404972/banner_456.jpg
This gets saved in the coverImage field.

If a user doesn’t upload one, the value remains undefined or null, and the app might use a default background.

📊 Summary
Field	Purpose	Required?	Stored As
avatar	User's profile picture	✅ Yes	String (URL to image)
coverImage	Optional profile banner/background	❌ No	String (URL to image)

🔧 Why Use Cloudinary or Other Services?
When a user uploads an image:

You don’t want to store it directly in your server's filesystem (unsafe and not scalable).

Instead, you upload it to services like:

Cloudinary

Firebase Storage

AWS S3*/