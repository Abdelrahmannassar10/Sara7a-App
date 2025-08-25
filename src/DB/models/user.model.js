import { model ,Schema} from "mongoose";
const schema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    email:{ 
        type:String,
        required:function() {
            if(this.phoneNumber){
                return false ;
            }
            return true ;
        },
        lowercase:true,
        trim :true 

    },
    password:{ 
        type:String,
        required:function(){
            if(this.userAgent=="google"){return false};
            return true ;
        },
    },
    phoneNumber:{ 
        type:String,
        required:function (){
            if(this.email){
                return false ;
            }
            return true ;
        },
    },
    dob:{
        type:Date,
    },
    otp:{
        type:String,
    },
    otpExpire:{
        type:Date,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    userAgent:{
        type:String,
        enum:["local","google"],
        default:"local"
    } ,
    profilePicture:{
        secure_url:String,
        public_id:String
    },
    credentialUpdatedAt:{
        type:Date,
        default:Date.now()
    },
    deletedAt:{
        type:Date,
    }
},{timestamps:true,toObject:{virtuals:true},toJSON:{virtuals:true}});
schema.virtual("age").get(function (){
    return new Date().getFullYear - new Date(this.dob).getFullYear ;
});
schema.virtual("fullName").get(function (){
    return `${this.firstName} ${this.lastName}`;
});
schema.virtual("fullName").set(function (value){
 const [firstName ,lastName] =value.split(" ");
 this.firstName =firstName ;
 this.lastName =lastName ;
});
schema.virtual("messages",{
    ref:"Message",
    localField:"_id",
    foreignField:"receiver"
});
export const User = model("User",schema);