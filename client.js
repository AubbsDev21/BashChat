const axios = require('axios')
const util = require('util')
const prompt = require('prompt')
const { JSDOM }= require('jsdom')
const { ChatManager, TokenProvider } = require('@pusher/chatkit')
const readline = require('readline')

const makeChatkitNodeCompatible = () => {
    const { window } = new JSDOM()
    global.window = window
    global.navigator = {}
}

const createUser = async username => {
    makeChatkitNodeCompatible()
    try{
        
        await axios.post('http://localhost:3001/users', {
            username
        })

    } catch (error) {
        console.error(error)
    }
}


const main = async () => {

    try {
   
        prompt.start()
        prompt.message = " "
         const get = util.promisify(prompt.get)
     
         const usernameSchema = [
             {
                 description: 'Enter your username' ,
                 name: 'username' , 
                 require: true
             }
         ]
         const {username} = await get(usernameSchema)
         await createUser(username)

         const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:f40ef635-3256-40f0-9124-7a554253bf3d',
            userId: username,
            tokenProvider: new TokenProvider({ url: 'http://localhost:3001/authenticate' })
          })
          const currentUser = await chatManager.connect()
          const joinableRooms = await currentUser.getJoinableRooms();
          const availableRooms = [...currentUser.rooms, ...joinableRooms];

          availableRooms.forEach((room, index) => {
            console.log(`${index} - ${room.name}`);
          });

          const roomSchema = [{
            description: "Select a room",
            name: "chosenRoom",
            require: true
           
          }];

          const { chosenRoom } = await get(roomSchema)
          const room = availableRooms[chosenRoom]

          await currentUser.subscribeToRoom({
            roomId: room.id,
            hooks: {
              onNewMessage: message => {
                const { senderId, text } = message;
                if (senderId === username) return;
                console.log(`${senderId}: ${text}`);
              }
            },
            messageLimit: 0
          });

          const input = readline.createInterface({
              input: process.stdin
          })

          input.on('line', async text => {
              await currentUser.sendMessage({
                  roomId: room.id,
                  text
              })
          })
        } 
       
    catch (error) {
        console.error(error)
        process.exit(1)
    }

   
}


main()