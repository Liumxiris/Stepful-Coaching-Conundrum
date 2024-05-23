import React, { useState, useEffect } from 'react';
import SlotView from '../components/SlotView';
import History from '../components/History';

function Scheduler(props) {
    const {user} = props
    return (
        <div style={{margin: '20px'}}>
            <SlotView user={user}/>
            {user && user.userType === 'coach' ? <History /> : null}
        </div>
    )
}

export default Scheduler