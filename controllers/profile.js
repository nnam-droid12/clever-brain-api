
const handleprofileGet =(req, res)=>{
    const { id } = req.params;
     db.select("*").from("users").where({id})
     .then(user =>{
         if(user.length){
          res.json(user[0])
         } else{
             res.status(400).json('User not found in database.')
         }
     }).catch(err => res.status(400).json('user already exist, try with a new user!'))
  
  }

module.exports={
    handleprofileGet:handleprofileGet
}  