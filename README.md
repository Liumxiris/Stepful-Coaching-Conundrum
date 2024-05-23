# Stepful-Coaching-Conundrum
## Completed Functions

- [x] Coaches can add slots of availability to their calendars. These slots are always 2 hours long and each slot can be booked by exactly 1 student.
- [x] Coaches can view their own upcoming slots.
- [x] Students can book upcoming, available slots for any coach.
- [x] When a slot is booked, both the student and coach can view each other’s phone-number.
- [] After they complete a call with a student, coaches will record the student’s satisfaction (an integer 1-5) and write some free-form notes.
- [] Coaches should be able to review their past scores and notes for all of their calls.
## Assumptions
- Coaches will only add slot with start time from 8am to 5pm
- Coach will not added a slot that overlaps with another slot
- Student will not cancel the meeting

## To Run
- Backend-server `node index.js`
- Frontend `npm start`