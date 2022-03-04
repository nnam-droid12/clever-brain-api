
const handleSignin = (req, res, db, bcrypt) =>{
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json('Please enter an item in the form');
    }
    db.select('email', 'hash').from('login')
    .where('email', '=',email)
    .then(data =>{
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
           return db.select('*').from('users')
            .where('email', '=', email)
            .then(user =>{
                console.log(user);
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to signin'))
        } else{
            res.status(400).json('wrong username or password')
        }
    })
    .catch(err => res.status(400).json('Wrong username or passowrd'))
}

module.exports = {
    handleSignin: handleSignin
}