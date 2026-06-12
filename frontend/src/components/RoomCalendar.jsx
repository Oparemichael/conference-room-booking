import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";

function RoomCalendar({
  roomId,
  onSelect,
  refreshCalendar,
}) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] =
  useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [slot, setSlot] = useState({start: null,end: null,});
  // 🔄 This forces calendar to reload bookings when updated
  const [refreshKey, setRefreshKey] = useState(0);
  // 🔄 Call this whenever a booking is created
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  

  useEffect(() => {
  fetch("http://localhost:5000/api/bookings")
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter(
        (b) => b.room_id === Number(roomId)
      );

      const formatted = filtered.map((b) => ({
        id: b.id,
        title: b.meeting_title,
        start: b.start_time,
        end: b.end_time,
        
        backgroundColor: "#4285F4",
        borderColor: "#4285F4",

        extendedProps: {
          full_name: b.full_name,
          email: b.email,
          purpose: b.purpose,
        },
      }));

      setEvents(formatted);
    });
}, [roomId, refreshKey, refreshCalendar]); // 🔄 RELOAD WHEN ROOM CHANGES OR EXTERNAL TRIGGER

const getColor = (roomId) => {
  const colors = {
    1: "#4285F4", // blue
    2: "#34A853", // green
    3: "#FBBC05", // yellow
    4: "#EA4335", // red
  };

  return colors[roomId] || "#6366F1";
};  

  return (
    <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
      <h2>Room Schedule</h2>

        <FullCalendar
            height="700px"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"

            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}

            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            hiddenDays={[0, 6]}
            nowIndicator={true}
            allDaySlot={false}

            events={events}

            selectable={true}
            selectMirror={true}

            // ✅ SINGLE CLEAN VALIDATION (FIXED)
            selectAllow={(selectInfo) => {
              const day = selectInfo.start.getDay();
              const startHour = selectInfo.start.getHours();
              const endHour = selectInfo.end.getHours();

              const isWeekday = day >= 1 && day <= 5;
              const isWorkingHours =
                startHour >= 6 && endHour <= 18;

              return isWeekday && isWorkingHours;
            }}

              select={(info) => {
                setSlot({
                  start: info.startStr,
                  end: info.endStr,
                });

                setShowBookingModal(true);
              }}

            eventClick={(info) => {
              setSelectedEvent({
                title: info.event.title,
                full_name: info.event.extendedProps.full_name,
                email: info.event.extendedProps.email,
                purpose: info.event.extendedProps.purpose,
                start: info.event.start?.toLocaleString(),
                end: info.event.end?.toLocaleString(),
              });
            }}

            eventMouseEnter={(info) => {
              info.el.title =
                `${info.event.title}\n` +
                `${info.event.extendedProps.full_name}`;
            }}

            // 🎨 GOOGLE CALENDAR STYLE IMPROVEMENT
            eventDidMount={(info) => {
              info.el.style.borderRadius = "6px";
              info.el.style.padding = "2px";
              info.el.style.fontSize = "12px";
            }}
        />

{showBookingModal && slot && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
  >
    <div className="bg-white p-5 rounded-lg w-[420px] mx-auto justify-center">
      {/* <h2>Book Room</h2> */}

      {/* ✅ REAL FORM (NOT STATIC ANYMORE) */}
      <BookingForm
          roomId={roomId}
          selectedSlot={slot}

          // ✅ FIXED: correct prop name
          onBookingSuccess={() => {
            // 🟢 Close modal after successful booking
            setShowBookingModal(false);

            // 🟢 Clear selected time slot
            setSlot(null);

            // 🔄 Refresh calendar data
            setRefreshKey((prev) => prev + 1);
          }}
        />

      <button
        className="w-3/4 my-2 block mx-auto py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-[0.99] transition"
        onClick={() => {
          setShowBookingModal(false);
          setSlot(null);
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

            {selectedEvent && (
            <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h2>{selectedEvent.title}</h2>

            <p>
              <strong>Booked By:</strong>{" "}
              {selectedEvent.full_name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedEvent.email}
            </p>

            <p>
              <strong>Purpose:</strong>{" "}
              {selectedEvent.purpose}
            </p>

            <p>
              <strong>Start:</strong>{" "}
              {selectedEvent.start}
            </p>

            <p>
              <strong>End:</strong>{" "}
              {selectedEvent.end}
            </p>

            <button
              onClick={() =>
                setSelectedEvent(null)
              }
            >
              Close
            </button>
          </div>
        </div>
)}
    </div>
  );
}

export default RoomCalendar;