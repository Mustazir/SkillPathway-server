// require('dotenv').config()
// const express = require('express');
// const cors = require('cors');
// // const jwt = require('jsonwebtoken');
// // const cookieParser = require('cookie-parser')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const app = express();
// // const stripe=require('stripe')(process.env.STRIPE_KEY)
// const port = process.env.PORt || 5000;


// app.use(cors())
// app.use(express.json())

// // mongodb connection 


// // const verifyToken=(req,res,next)=>{
// //   const token=req?.cookies?.token
// //   if(!token){
// //     return res.send({massage:'unothoris'})
// //   }
// //   jwt.verify(token,'AD42AEEC73759E8F49FD2B96FF936B0C1D920B5B3D3E6E769281928EB538D1C2',(err,decode)=>{
// //     if(err){
// //       return res.send({massage:'again login'})
// //     }
// //     req.user=decode
// //     next()
// //   }) LearnBridge

// // }


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w81iv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     const database = client.db("LearnBridge");
//     const usersCollections = database.collection("users");
//     const sessionsCollections = database.collection("sessions");
//     const materialsCollections = database.collection("materials");
//     const rejectCollections = database.collection("rejectReason");
//     const notesCollections = database.collection("notes");
//     const reviewCollections = database.collection("review");
//     const student_sessionCollections = database.collection("studentsessions");



//     // app.post('/jwt',async(req,res)=>{
//     //   const user =req.body

//     //   const token =jwt.sign(user,'AD42AEEC73759E8F49FD2B96FF936B0C1D920B5B3D3E6E769281928EB538D1C2',{expiresIn:'1h'})
//     //   res
//     //   .cookie('token',token,{
//     //     httpOnly:true,
//     //     secure:false
//     //   })
//     //   .send({success:true})
//     // })

//     app.get('/users', async (req, res) => {
//       const result = await usersCollections.find().toArray()
//       res.send(result)
//     })
//     app.post('/users', async (req, res) => {
//       const user = req.body
//       const query = { email: user.email }
//       const exgestingUser = await usersCollections.findOne(query)
//       if (exgestingUser) {
//         return res.send({ message: 'user already here' })
//       }
//       const result = await usersCollections.insertOne(user)
//       res.send(result)
//     })
//     app.post('/sessions', async (req, res) => {
//       const data = req.body
//       console.log(data)
//       const result = await sessionsCollections.insertOne(data)
//       res.send(result)
//     })
//     app.get('/sessions', async (req, res) => {
//       const result = await sessionsCollections.find().toArray()
//       res.send(result)
//     })


//     app.get('/sessions/approve', async (req, res) => {
//       const query = { status: "Approved" };
//       const result = await sessionsCollections.find(query).toArray()
//       res.send(result)
//     })

//     app.post('/materials', async (req, res) => {
//       const data = req.body
//       const result = await materialsCollections.insertOne(data)
//       res.send(result)
//     })

//     app.get('/materials', async (req, res) => {
//       try {
//         const result = await materialsCollections.find().toArray();

//         // Promise.all resolve the asynchronous operations inside map *****
//         const newResult = await Promise.all(
//           result.map(async (item) => {
//             const id = item.sessionId;
//             const query = { _id: new ObjectId(id) };
//             const sessionData = await sessionsCollections.findOne(query);
//             item.sessionTitle = sessionData ? sessionData.title : "Unknown";
//             return item;
//           })
//         );
//         console.log(newResult);
//         res.send(newResult);
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: "An error occurred while fetching materials." });
//       }
//     });
//     app.get('/rejected_reason', async (req, res) => {
//       const id = req.params.id
//       const query = { sessionId: id }
//       const result = await rejectCollections.find().toArray()
//       res.send(result)
//     })

//     app.put('/session_approves_request/:id', async (req, res) => {
//       const id = req.params.id
//       const filter = { _id: new ObjectId(id) }
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: {
//           status: "Pending",
//         },
//       };
//       const result = await sessionsCollections.updateOne(filter, updateDoc, options)
//       res.send(result)
//     })



//     // delete 
//     app.delete('/materials/:id', async (req, res) => {
//       const { id } = req.params
//       const query = { _id: new ObjectId(id) }
//       const result = await materialsCollections.deleteOne(query)
//       res.send(result)
//     })
//     app.delete('/session/:id', async (req, res) => {
//       const { id } = req.params
//       const query = { _id: new ObjectId(id) }
//       const result = await sessionsCollections.deleteOne(query)
//       res.send(result)
//     })

//     app.get('/session/apprrove/:id', async (req, res) => {
//       const { id } = req.params
//       const query = { _id: new ObjectId(id) }
//       const result = await sessionsCollections.findOne(query)
//       res.send(result)
//     })


//     // admin 




//     app.get('/admin_sessions_count', async (req, res) => {
//       const result = await sessionsCollections.estimatedDocumentCount()
//       res.send({ count: result })
//     })
//     app.get('/admin_allsessons', async (req, res) => {

//       const skip = parseInt(req.query.skip)
//       const result = await sessionsCollections.find().skip(skip * 6).limit(6).toArray()
//       res.send(result)
//     })

//     app.put('/admin_rejected/:id', async (req, res) => {
//       const id = req.params.id

//       const reason = req.body[0]
//       const feedback = req.body[1]
//       const data = { sessionId: id, reason, feedback }
//       const result2 = await rejectCollections.insertOne(data)  // insert reject reason

//       const filter = { _id: new ObjectId(id) }
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: {
//           status: "Rejected",
//         },
//       };
//       const result = await sessionsCollections.updateOne(filter, updateDoc, options) // update session status
//       res.send(result)

//     })

//     app.put('/admin_approves/:id', async (req, res) => {
//       const id = req.params.id
//       const fee = req.body.fee

//       const filter = { _id: new ObjectId(id) }
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: {
//           status: "Approved",
//           fee: req.body.fee
//         },
//       };
//       const result = await sessionsCollections.updateOne(filter, updateDoc, options)
//       res.send(result)
//     })

//     app.put('/admin_users/:id', async (req, res) => {
//       const id = req.params.id
//       const filter = { _id: new ObjectId(id) }
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: {
//           role: "Admin",
//         },
//       };
//       const result = await usersCollections.updateOne(filter, updateDoc, options)
//       res.send(result)
//     })
    
//     app.get('/admin_private', async (req, res) => {
//       const email = req.query.email
//       var trimmedEmail = '';
//       if ((email.startsWith('"') && email.endsWith('"'))
//         || (email.startsWith("'") && email.endsWith("'"))) {
//         trimmedEmail = email.slice(1, -1); // Remove the surrounding quotes
//       }
//       const query = { email: trimmedEmail }

//       const result = await usersCollections.findOne(query)

//       res.send(result)
//     })





//     //  student 
//     app.post('/student_session', async (req, res) => {
//       const data = req.body
//       const result = await student_sessionCollections.insertOne(data)
//       res.send(result)
//     })
//     app.get('/student_session', async (req, res) => {


//       const email = req.query.StudentUser
//       var trimmedEmail = '';
//       if ((email.startsWith('"') && email.endsWith('"'))
//         || (email.startsWith("'") && email.endsWith("'"))) {
//         trimmedEmail = email.slice(1, -1); // Remove the surrounding quotes
//       }
//       const query = { StudentUser: trimmedEmail }

//       const result = await student_sessionCollections.find(query).toArray()

//       res.send(result)
//     })

//     app.post('/students_notes', async (req, res) => {
//       const data = req.body
//       const result = await notesCollections.insertOne(data)
//       res.send(result)
//     })
//     app.get('/students_notes', async (req, res) => {
//       const data = req.body

//       const email = req.query.email
//       var trimmedEmail = '';
//       if ((email.startsWith('"') && email.endsWith('"'))
//         || (email.startsWith("'") && email.endsWith("'"))) {
//         trimmedEmail = email.slice(1, -1); // Remove the surrounding quotes
//       }
//       const query = { studentEmail: trimmedEmail }
//       console.log(query)
//       const result = await notesCollections.find(query).toArray()
//       res.send(result)
//     })
//     app.delete('/student_notes/:id', async (req, res) => {
//       const { id } = req.params
//       const query = { _id: new ObjectId(id) }
//       const result = await notesCollections.deleteOne(query)
//       res.send(result)
//     })
//     app.put('/student_notes/:id', async (req, res) => {
//       const { id } = req.params
//       const description = req.body.description

//       const filter = { _id: new ObjectId(id) }
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: {
//           description: description,

//         },
//       };
//       const result = await notesCollections.updateOne(filter, updateDoc, options)
//       res.send(result)
//     })
//     app.post('/addreview/tostudent', async (req, res) => {
//       const data = req.body

//       const result = await reviewCollections.insertOne(data)
//       res.send(result)
//     })
//     app.get('/student_sessions/materials', async (req, res) => {
//       const email = req.query.StudentUser

//       var trimmedEmail = '';
//       if ((email.startsWith('"') && email.endsWith('"'))
//         || (email.startsWith("'") && email.endsWith("'"))) {
//         trimmedEmail = email.slice(1, -1); // Remove the surrounding quotes
//       }
//       const query = { StudentUser: trimmedEmail }
//       const studentSessions = await student_sessionCollections.find(query).toArray()

//       if (!studentSessions || studentSessions.length === 0) {
//         return res.status(404).send({ error: 'No sessions found for the given StudentUser' });
//       }

     
//       const materialsPromises = studentSessions.map(async (session) => {
//         const sessionId = session._id; // Use session ID
        
//         const materialsQuery = { sessionId: sessionId }; // Assume sessionId in materialsCollection matches
//         const materials = await materialsCollections.find(materialsQuery).toArray();
//         return materials; // Return materials for this session
//       });

//       // Wait for all material queries to complete
//       const allMaterials = await Promise.all(materialsPromises);

//       // Flatten the array of arrays into a single array
//       const flattenedMaterials = allMaterials.flat();
//       console.log(flattenedMaterials)
//       // Send the combined materials array
//       res.status(200).send(flattenedMaterials);
//     })

//     // payment intent 
//     // app.post('/create-payment-intent',async(req,res)=>{
//     //   const {price}=req.body;
//     //   const amount=parseInt(price*100)
//     //   const paymentIntent=await stripe.paymentIntents.create({
//     //     amount:amount,
//     //     currency:'usd',
//     //     payment_method_types:['card']
//     //   });
//     //   res.send({
//     //     clientSecret:paymentIntent.client_secret
//     //   })
//     // })





















//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);



// app.get('/', (req, res) => {
//   res.send("This is Skill Path Server")
// })

// app.listen(port, () => {
//   console.log(`surver is running ${port}`)
// })
