import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import RoomCalendar from "../components/RoomCalendar";

function RoomDashboard() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [refreshCalendar, setRefreshCalendar] = useState(0);

  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find(
          (r) => r.id == id
        );
        setRoom(selected);
      });
  }, [id]);

  if (!room) return <p>Loading...</p>;

  return (
  <div
    style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px",
    }}
  >
    {/* ROOM HEADER */}
    <div
      style={{
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        border: "1px solid #ddd",
      }}
    >
      <h1>{room.name}</h1>

      <p>
        <strong>Location:</strong> {room.location}
      </p>

      <p>
        <strong>Capacity:</strong> {room.capacity} People
      </p>
    </div>

    {/* AMENITIES */}
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <p>
        <strong>Amenities:</strong>
      </p>

      <ul>
        {room.amenities
          ?.split(",")
          .map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
      </ul>
    </div>

    {/* CALENDAR + FORM SECTION (IMPORTANT - DO NOT REMOVE) */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
        alignItems: "start",
      }}
    >
      {/* LEFT: Calendar */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <RoomCalendar
          roomId={room.id}
          onSelect={setSelectedSlot}
        />
      </div>

      {/* RIGHT: Booking Form */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          position: "sticky",
          top: "20px",
        }}
      >
        <BookingForm
          roomId={room.id}
          selectedSlot={selectedSlot}
          onBookingSuccess={() =>
            setRefreshCalendar((prev) => prev + 1)
          }
        />
      </div>
    </div>
  </div>
);

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    alignItems: "start",
  }}
>
        {/* LEFT: Calendar */}
       <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  }}
>
          <RoomCalendar
            roomId={room.id}
            onSelect={setSelectedSlot}
            refreshCalendar={refreshCalendar}
          />
        </div>

        {/* RIGHT: Booking Form */}
        <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  }}
>
            <BookingForm
              roomId={room.id}
              selectedSlot={selectedSlot}
              onBookingSuccess={() =>
                setRefreshCalendar((prev) => prev + 1)
              }
            />
        </div>
      </div>
  ;
}

export default RoomDashboard;