
const form = document.getElementById("bookingForm");
const message = document.getElementById("message");
const bookingList = document.getElementById("bookingList");
const dateInput = document.getElementById("date");

const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

dateInput.min = localToday;

let bookings = [];

try {
    bookings = JSON.parse(localStorage.getItem("foodBookings")) || [];
    if (!Array.isArray(bookings)) {
        bookings = [];
    }
} catch {
    bookings = [];
}

function saveBookings() {
    localStorage.setItem("foodBookings", JSON.stringify(bookings));
}

function displayBookings() {
    bookingList.replaceChildren();

    if (bookings.length === 0) {
        bookingList.textContent = "No bookings yet. Book your table today!";
        return;
    }

    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i];

        const card = document.createElement("div");
        card.className = "booking-card";

        const title = document.createElement("h3");
        title.textContent = booking.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + booking.email;

        const date = document.createElement("p");
        date.textContent = "Date: " + booking.date;

        const time = document.createElement("p");
        time.textContent = "Time: " + booking.time;

        const guests = document.createElement("p");
        guests.textContent = "Guests: " + booking.guests;

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Booking";
        cancelButton.className = "cancel-btn";

        cancelButton.addEventListener("click", function () {
            cancelBooking(booking.id);
        });

        card.append(title, email, date, time, guests, cancelButton);
        bookingList.appendChild(card);
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = dateInput.value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;

    if (name === "" || email === "" || date === "" || time === "") {
        message.textContent = "Please fill in all required fields.";
        return;
    }

    if (date < localToday) {
        message.textContent = "Please select today or a future date.";
        return;
    }

    const booking = {
        id: Date.now() + Math.random(),
        name: name,
        email: email,
        date: date,
        time: time,
        guests: guests
    };

    bookings.push(booking);
    saveBookings();
    displayBookings();

    message.textContent = "Your table has been booked successfully!";
    form.reset();
    dateInput.min = localToday;
});

function cancelBooking(id) {
    bookings = bookings.filter(function (booking) {
        return booking.id !== id;
    });

    saveBookings();
    displayBookings();
    message.textContent = "Booking cancelled successfully.";
}

displayBookings();
