const validator=require('validator');

const validate=(data)=>{
  const mandatoryField=['username','email','password'];
        const Isallowed=mandatoryField.every((k)=>Object.keys(data).includes(k));
        if(!Isallowed){
                throw new Error("some Field Missing");
        }
  if(!validator.isEmail(data.email))
          throw new Error("Invalid Email");
        if(!validator.isStrongPassword(data.password))
          throw new Error("wrong Password");
    
}
module.exports=validate;