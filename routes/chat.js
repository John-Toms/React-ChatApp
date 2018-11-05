module.exports = (app,db,server) =>{
    
    const UserModel = require('../models/user');
    const ChatModel = require('../models/chat');
    const { ObjectId } = require('mongodb');
    const socket = require('socket.io');
    const moment = require('moment');
    var userModel = new UserModel(db, ObjectId);
    var chatModel = new ChatModel(db, ObjectId);

    const io = socket(server);
    const allClients = [];

    io.on('connection', (socket) => {
        console.log("socket=",socket.id);
        io.emit('sendinfo',socket.id)
        allClients.push(socket.id);

        socket.on('SEND_MESSAGE', function(data){ console.log(data)
            io.emit('RECEIVE_MESSAGE', data);
            chatModel.saveMessage(data);
        })
        socket.on('disconnect', function() {
            console.log('Got disconnect!');
      
            var i = allClients.indexOf(socket.id);
            allClients.splice(i, 1);
         });
    });

    app.post('/getUserContact', (req,res)=>{
        userModel.getUserlist("useremail",req.body.useremail).then(user=>{
            var user = user[0];
            if(user){
                userModel.getUserContact(user.contact).then(users=>{
                    res.send({status:"success",user:user,users:users});
                });
            }else{
                res.send({status:"Empty",user:user,users:[]});                
            }
        });
    });

    app.post('/addNewContact', (req,res)=>{
        userModel.getValue("useremail",req.body.useremail,"contact").then(contact=>{
            var contactArray=[];
            if(contact[0].contact){
                var contactString = contact[0].contact;
                contactArray = contactString.split(",");
            }
            userModel.getValue("useremail",req.body.newemail,"_id").then(newId=>{
                if(newId[0]){
                    contactArray.push(newId[0]._id);
                    userModel.updateValue("useremail",req.body.useremail,"contact",contactArray.toString()).then(status=>{
                        res.send({status:"success"})
                    })
                }else{
                    res.send({status:"Non exist Email address!"})
                }
            })
        })
    })

    app.post('/getMessages',(req,res)=>{
        console.log(req.body)
        const current=moment().unix();
        const beforeSevenDays = moment().subtract(7, 'day').unix();
        chatModel.getMessages(req.body.sender,req.body.receiver,beforeSevenDays,current).then(data=>{console.log(data)
            res.send({status:"success",data:data});
        });
    })
}