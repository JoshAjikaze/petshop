import { useCallback, useEffect, useState } from "react";
import { BiCalendar, BiTrash } from "react-icons/bi";
import { GiSittingDog } from "react-icons/gi";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import Search from "./components/Search";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  // filter method for rendering the search functionality
  // borrows from the data from the appointmentList array,
  // and the query prop passed down from the appointments component
  // sort method added to the mix
  // sorts by petname, and asc or desc order

  const filteredAppointments = appointmentList.filter((item) => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    );
  }).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1; 
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order
    )
  })

  // povides the data on the customers in a Json file
  // passed over from an external server

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((promise) => promise.json())
      .then((data) => {
        setAppointmentList(data);
      });
  }, []);

  // used to integrate the data fetchde from the external server into the application.

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto mt-3 font-thin">
      <h1 className="text-3xl mb-3 align-top">
        <GiSittingDog className="inline-block text-red-400" /> Joshua's Pet Shop
        Clients
      </h1>

      <AddAppointment onSendAppointment={(myAppointment) => setAppointmentList([...appointmentList, myAppointment])} lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)} />

      <Search
        query={query}
        onQueryChange={(newQuery) => setQuery(newQuery)}
        orderBy={orderBy}
        //method for changing the order
        onOrderByChange={(mySort) => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) =>
              setAppointmentList(
                appointmentList.filter(
                  (appointment) => appointment.id !== appointmentId
                )
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
