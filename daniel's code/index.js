/* ----------------------- STRUCTURING THE DATA WE ARE DEALING WITH -----------------------

ENTITIES WE ARE DEALING WITH:
- MEETINGS (time, description)
- DAYS (currently a day is identified by its 'day number'... maybe in the future we will expand that to also consider month and year)
- CALENDAR (will contain all existing days)

HOW THEY ARE CONNECTED TO EACH OTHER (what are the RELATIONSHIPS between them)
- We have 0 to MANY different MEETINGS for each DAY
-> Every DAY will have a COLLECTION of several MEETINGS
- We have 0 to MANY different DAYS in our CALENDAR

HOW DO WE MODEL THEM:
- MEETING: we can use an OBJECT -> { time: "09:00", description: "Live lecture" }
- DAY: we can use an ARRAY -> [ { time: "09:00", description: "Live lecture" }, { time: "14:30", description: "Recap session" } ]
- CALENDAR: we could use an ARRAY, but the most versatile alternative would be using an OBJECT -> {
    "2021-12-02": [ { time: "09:00", description: "Live lecture" }, { time: "14:30", description: "Recap session" } ],
    "2021-12-15": [ { time: "09:00", description: "Live lecture" } ],
    "2021-12-25": [ ],
    "2022-01-03": [ { time: "17:00", description: "Debrief" } ],
}

*/

// TODO: we first work on a TEMPLATE, some BLUEPRINTS for HOW we want to structure our data
// This is some FAKE data

// We still need to properly organize the user input so that we can shape it into our structured data
// For doing so, we need to:
// 1. we should show only the actual meeting data for the selected day in the meetings list
// 2. when we collect user input to create a new meeting, we should update this calendarData accordingly


let calendarData = { }


window.onload = function() {
    readDataFromDisk()
    createDays()
}

const createDays = function() {

    // Find the parent for the days (= month container)
    let monthContainerNode = document.getElementById("month-container")

    // TODO: Get the current month, so we can know how many days we need
    // (just for now, we assume we are in December and we have 31 days)
    let daysInTheMonth = 31

    // Within a loop, we create as many days as we need
    for (let dayNumber = 1; dayNumber <= daysInTheMonth; dayNumber++) {

        // We create a new DIV element...
        let newDayNode = document.createElement("div") // <div></div>
        newDayNode.innerText = dayNumber // <div>1</div>
        newDayNode.classList.add("day") // <div class="day">1</div>

        // Set the 'selectDay' function as a LISTENER for the CLICK event
        // on the newly created HTML node
        newDayNode.onclick = selectDay
        // (this is another, almost equivalent alternative)
        // newDayNode.addEventListener("click", selectDay)

        // ...and we attach it as the last child of the month container
        monthContainerNode.appendChild(newDayNode)
    }
}

const getCurrentlySelectedDay = function() {
    return document.querySelector(".selected")

    //return document.getElementsByClassName("selected")[0]
}

const selectDay = function(e) {

    // Let's find the currently selected day...
    const currentlySelectedDay = getCurrentlySelectedDay()

    // ...if there's one, DE-SELECT it
    if (currentlySelectedDay !== null) {
        // ...by removing the 'selected' class
        currentlySelectedDay.classList.remove("selected")
    }

    // Find the element that has been click
    const clickedDayNode = e.target

    // Set its class to be 'selected'
    clickedDayNode.classList.add("selected")

    // Display the meetings for the newly selected day
    displayMeetingsForTheSelectedDay()
}

const createNewMeeting = function() {

    // Make sure that we actually selected a day
    if (getCurrentlySelectedDay() === null) {
        alert("You have to select a day first!")
        return
    }

    // Read the user input (so the values of time, description)
    const meetingTime = document.getElementById("meeting-time").value
    const meetingDescription = document.getElementById("meeting-description").value

    // We link our newly created meeting with the selected day
    // -- We create a new object to represent the new meeting
    const meeting = {
        time: meetingTime,
        description: meetingDescription
    }

    // -- We add the newly created meeting object to the array for that day
    const meetingsForTheDay = getMeetingsForTheCurrentlySelectedDay()
    meetingsForTheDay.push(meeting)

    // We save the updated data to the DISK (local storage)
    saveDataToTheDisk()

    // Display the updated meetings for the selected day
    displayMeetingsForTheSelectedDay()
}

const getMeetingsForTheCurrentlySelectedDay = function() {

    const currentlySelectedDayNode = getCurrentlySelectedDay()

    const selectedDayNumber = currentlySelectedDayNode.innerText
    let meetingsForTheSelectedDay = calendarData[selectedDayNumber]

    if (meetingsForTheSelectedDay === undefined) {
        meetingsForTheSelectedDay = []
        calendarData[selectedDayNumber] = meetingsForTheSelectedDay
    }

    return meetingsForTheSelectedDay;
}

const displayMeetingsForTheSelectedDay = function() {

    // Get the meetings for the currently selected day
    const meetingsForTheDay = getMeetingsForTheCurrentlySelectedDay()

    // Find the UL container for the meetings LI
    const meetingsContainerNode = document.getElementById("meetings-for-the-day")

    // We clear out any existing content inside of the UL
    meetingsContainerNode.innerHTML = ""

    // Create a LI for every meeting associated with the selected day
    for (let meeting of meetingsForTheDay) {

        // We create a new meeting LI based on that data
        const newMeetingListItemNode = document.createElement("li")
        newMeetingListItemNode.innerText = meeting.time + "] " + meeting.description

        // We display the newly created meeting by appending it to the UL
        meetingsContainerNode.appendChild(newMeetingListItemNode)
    }
}

const saveDataToTheDisk = function() {

    // We have to convert our 'calendarData' OBJECT into a STRING
    const json = JSON.stringify(calendarData)

    // We save our serialized JSON string to the LOCAL STORAGE
    localStorage.setItem("strive-calendar-data", json)
}

const readDataFromDisk = function() {

    // Read saved data from the local storage
    const json = localStorage.getItem("strive-calendar-data")

    if (json === null){
        // The very first time we load the application, there would be no saved data for our calendar
        calendarData = { }
    } else {
        // We parse the JSON string back to a real OBJECT
        calendarData = JSON.parse(json)
    }
}
