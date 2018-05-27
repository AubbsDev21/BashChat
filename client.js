const prompt = require('prompt')
const util = require('util')
try {
    const main = async () => {
        prompt.start();
       prompt.message = " "
        const get = util.promisify(prompt.get)
    
        const usernameSchema =  [
            {
            description: 'Enter your username',
            name: 'username',
            required: true
    
        }
    ]
    
    const { username} = await get(usernameSchema)
    console.log(username)
    
    }
} 
catch (error) {
    console.error(error)
    process.exit(1)
}


main()