import { MongoClient, ServerApiVersion} from 'mongodb';

// Datasbase setup
const dbUsername = encodeURIComponent("ml2485")
const dbPass = encodeURIComponent("t9glUNUbjIx46woT")
const uri = `mongodb+srv://${dbUsername}:${dbPass}@schedule.944eknm.mongodb.net/?retryWrites=true&w=majority&appName=Schedule`
const dbClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
let db;
const dbName = "Call-Scheduler"
async function connectDB() {
    await dbClient.connect();
    console.log("DB connected");
    db = dbClient.db(dbName);
}

connectDB().catch(console.error);

export const getUser = async(username) => {
    const users = db.collection('User');
    try {
        const user = await users.findOne({username});
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (e) {
        console.log("Databse: Error in fetching user");
        return null;
    }
}

export const addSlot = async (userID, date, startTime) => {
    const users = db.collection('User');
    try {
        const user = await users.findOne({"_id": userID})
        if (user) {
            users.updateOne(
                { _id: userID},
                { $push: {slots: {user: user.username, date: date, startTime: startTime, booked:false}}}
            );
            return user
        } else {
            console.log("Database: Cannot find the user in addSlot")
            return null;
        }
    } catch (e) {
        console.log("Database: Error in adding slot: ", e);
        return null;
    }
}

export const fetchingSlot = async(userID) => {
    const users = db.collection('User');
    try {
        const user = await users.findOne({"_id": userID})
        if (user) {
            if (user.slots) {
                return user.slots
            }
            return []
        } else {
            console.log("Database: Cannot find the user")
            return null;
        }
    } catch (e) {
        console.log("Database: Error fetching slots from a coach: ", e);
        return null;
    }
}

export const fetchingAllSlot = async() => {
    const users = db.collection('User');
    try {
        const pipeline = [
            {
                $match: { slots: { $exists: true } }
            },
            {
                $group: {
                    _id: null, 
                    allslots: { $push: "$slots" } 
                }
            }
        ];
        const result = await users.aggregate(pipeline).toArray();
        // console.log("Database: Fetched all slots", result[0].allslots)
        return result[0].allslots
    } catch (e) {
        console.log("Database: Error fetching All slots: ", e);
        return null;
    }
}

export const bookSlot = async(studentID, slotInfo) => {
    const users = db.collection('User');
    const {date, startTime, user} = slotInfo
    // Create the call for both student and coach
    try {
        const student = await users.findOne({"_id": studentID})
        const coach = await users.findOne({"username":user})
        if (student && coach) {
            // Mark the slot as booked
            const slotIdx = coach.slots.findIndex(slot => slot.startTime === startTime && slot.date === date)
            if (slotIdx != -1) {
                if (coach.slots[slotIdx].booked) {
                    console.log("Database: The slot has been booked")
                    return null
                }
                coach.slots[slotIdx].booked = true
                users.updateOne(
                    { _id: coach._id},
                    { $set: {slots: coach.slots}}
                );
            } else {
                console.log("Database: Cannot find the slot and marked as booked")
                return null
            }
            // Create a Call for both coach and student
            let callInfo = {student: student.username, coach: coach.username, date:date, startTime:startTime, studentPhone:student.phone, coachPhone:coach.phone}
            users.updateOne(
                { _id: studentID},
                { $push: {calls: callInfo}}
            );
            users.updateOne(
                { _id: coach._id},
                { $push: {calls: callInfo}}
            );
            console.log("Database: Successfully Booked the slot")
            return callInfo
        } else {
            console.log("Database: Cannot find the user in BookSlot")
            return null;
        }
    } catch (e) {
        console.log("Database: Error in adding slot: ", e);
        return null;
    }
}

export const fetchAllCalls = async(userID) => {
    const users = db.collection('User');
    try {
        const user = await users.findOne({"_id": userID})
        console.log("Database: Fetched all future calls")
        if (user.calls){
            return user.calls
        }
        return []
    } catch (e) {
        console.log("Database: Error fetching All slots: ", e);
        return null;
    }
}
