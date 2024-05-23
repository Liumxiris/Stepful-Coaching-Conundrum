import React, {useState, useEffect} from "react";

// Coach View - add slot and view upcoming slot
// Student View - view all upcoming slot
function SlotView(props) {
    const {user} = props
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [slots, setSlots] = useState([])
    const [calls, setCalls] = useState([])

    const fetchCalls = () => {
        fetch('/api/fetchAllCalls').then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setCalls([...data])
                })
            } else {
                window.alert("Error fetching all calls")
            }
        }).catch(error => {
            throw(error)
        })
    }
    const fetchSlot = () => {
        fetch('/api/fetchSlot').then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setSlots([...data])
                })
            } else {
                window.alert("Error fetching all slots")
            }
        }).catch(error => {
            throw(error)
        })
    }

    const fetchAllSlot = () => {
        fetch('/api/fetchAllSlot').then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setSlots([...data])
                })
            } else {
                window.alert("Error fetching all slots")
            }
        }).catch(error => {
            throw(error)
        })
    }

    const addSlot = () => {
        fetch('/api/addSlot', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({date:date, startTime:startTime})
        }).then(response => {
            if (response.ok) {
                console.log("Successfully added a slot")
                fetchSlot()
            } else {
                window.alert("Error adding new slot")
            }
        }).catch(error => {
            throw(error)
        })
    }

    const getButtonColor = (isBooked) => {
        return isBooked ? "red" : "green";
    }

    const handleBook = (slot) => {
        if (slot.booked) {
            window.alert("The slot cannot be booked")
            return
        }
        fetch('/api/bookSlot', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({slotInfo:slot})
        }).then(response => {
            if (response.ok) {
                window.alert("Successfully booked the slot!")
                fetchAllSlot()
                fetchCalls()
            } else {
                window.alert("Error booking the slot")
            }
        }).catch(error => {
            throw(error)
        })
    }

    useEffect(() => {
        if (user.userType === 'coach') {
            fetchSlot()
        } else {
            fetchAllSlot()
        }
        fetchCalls()
      }, []);

    return (
        <div>
            {user.userType === 'coach' ? <div>
                <div>
                    <h2>View All Upcoming Slots</h2>
                    {slots.map(slot => (
                        <button
                        style={{ backgroundColor: getButtonColor(slot.booked), color: 'white', margin: '10px' }}
                        > {slot.date + "  " + slot.startTime}
                        </button>
                    ))}
                </div>
                <h2> Add New Slot </h2>
                <form onSubmit={addSlot}>
                    <div>
                        <label>Date:</label>
                        <input type="date" id="date" value={date} onChange={e=>setDate(e.target.value)} required/>
                    </div>

                    <div>
                        <label>Start Time:</label>
                        <input type="time" id="startTime" value={startTime} onChange={e=>setStartTime(e.target.value)} 
                                min="08:00" max="17:00" required/>
                    </div>
                    <button>Add Slot</button>
                </form>
            </div> :
            <div>
                <h2> View All Slots</h2>
                <div>
                    {slots.map((slotsByCoach, index) => (
                        <div key={index}>
                            <h3>{slotsByCoach[0].user}</h3>
                            {slotsByCoach.map(slot => (
                                <button onClick={() => handleBook(slot)}
                                    style={{ backgroundColor: getButtonColor(slot.booked), color: 'white', margin: '10px'}}
                                >
                                    {slot.date + "  " + slot.startTime}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>}
            <div>
                <h2>Upcoming Calls</h2>
                {calls.map((call, index) => (
                    <div key={index} style={{margin: '20px', padding: '10px', border: '1px solid'}}>
                        <h2>Call on {call.date} at {call.startTime}</h2>
                        <h3>Participants:</h3>
                        <ul>
                            <li>Student: {call.student} Phone: {call.studentPhone}</li>
                            <li>Coach: {call.coach} Phone: {call.coachPhone}</li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default SlotView