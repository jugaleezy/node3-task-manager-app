const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})



// const me = new User({
//     name: 'Mike',
//     email: 'abc@abc.com',
//     password: 'Password123'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!',error)
// })


// const task = new Tasks({
//     description: '     Eat dinner  '
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log('Error:',error)
// })