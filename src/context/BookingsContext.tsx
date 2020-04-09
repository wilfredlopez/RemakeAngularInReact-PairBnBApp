import React, { createContext, useContext, useState } from "react"
import { Booking } from "./booking.model"
import axios from "axios"
import { User } from "./user.model"
import { FIREBASE_REALTIME_DATABASE_URL } from "../config/constants"
// const TestBookings: Booking[] = [
//   {
//     guestNumber: 21,
//     id: "b1",
//     placeId: "ca",
//     placeTitle: "First Booking",
//     userId: "Wilfred",
//     placeImage: "/favicon.ico",
//     dateFrom: new Date(),
//     dateTo: new Date(),
//     fistName: "Wifred",
//     lastName: "Lopez",
//   },
//   {
//     guestNumber: 10,
//     id: "b2",
//     placeId: "dom",
//     placeTitle: "Second Booking",
//     userId: "Wilfred",
//     placeImage: "/favicon.ico",
//     dateFrom: new Date(),
//     dateTo: new Date(),
//     fistName: "Wifred",
//     lastName: "Lopez",
//   },
//   {
//     guestNumber: 3,
//     id: "p1",
//     placeId: "home",
//     placeTitle: "3rd Booking",
//     userId: "Austria",
//     placeImage: "/favicon.ico",
//     dateFrom: new Date(),
//     dateTo: new Date(),
//     fistName: "Wifred",
//     lastName: "Lopez",
//   },
// ]

type BookingBackendObject = Omit<Booking, "id">

export interface BookingsContextInterface {
  bookings: Booking[]
  addBooking: (token: string, booking: Omit<Booking, "id">) => Promise<void>
  deleteBooking: (id: string, token: string) => Promise<void>
  fetchBookings: (user: User) => Promise<void>
}

const initialContext: BookingsContextInterface = {
  bookings: [] as Booking[],
  addBooking: {} as any,
  deleteBooking: {} as any,
  fetchBookings: {} as any,
}

const BookingsContext = createContext(initialContext)

const BookingsContextProvider: React.FC = React.memo((props) => {
  const [bookings, setBookings] = useState<Booking[]>([])

  async function addBooking(
    token: string,
    partialBooking: Omit<Booking, "id">,
  ) {
    const newBooking: Booking = {
      ...partialBooking,
      id: bookings.length + 1 + "-booking",
    }

    return axios
      .post<{ name: string }>(
        `${FIREBASE_REALTIME_DATABASE_URL}/bookings.json?auth=${token}`,
        {
          ...newBooking,
          id: null,
        },
      )
      .then((response) => {
        newBooking.id = response.data.name
        setBookings((existing) => existing.concat(newBooking))
      })
      .catch((e) => console.log(e))
  }

  async function fetchBookings(user: User) {
    return axios
      .get<{ [key: string]: BookingBackendObject }>(
        `${FIREBASE_REALTIME_DATABASE_URL}/bookings.json?auth=${user.token}&orderBy="userId"&equalTo="${user.userId}"`,
      )
      .then((response) => {
        let bookingsInServer: Booking[] = []
        const resData = response.data
        for (let key in resData) {
          if (resData.hasOwnProperty(key)) {
            //turning string dates into date objects
            resData[key].dateFrom = new Date(resData[key].dateFrom)
            resData[key].dateTo = new Date(resData[key].dateTo)
            bookingsInServer.push({
              ...resData[key],
              id: key,
            })
          }
        }
        setBookings(bookingsInServer)
      })
  }

  async function deleteBooking(id: string, token: string) {
    return axios
      .delete(
        `${FIREBASE_REALTIME_DATABASE_URL}/bookings/${id}.json?auth=${token}`,
      )
      .then(() => {
        setBookings((currentBookings) =>
          currentBookings.filter((b) => b.id !== id),
        )
      })
  }

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        deleteBooking,
        fetchBookings,
      }}
    >
      {props.children}
    </BookingsContext.Provider>
  )
})

const useBookingsContext = () => {
  const { bookings, addBooking, deleteBooking, fetchBookings } = useContext(
    BookingsContext,
  )

  function getBooking(id: string) {
    let booking = bookings.find((p) => p.id === id)
    return booking
  }
  return {
    bookings,
    deleteBooking,
    addBooking,
    getBooking,
    fetchBookings,
  }
}

export { BookingsContext, BookingsContextProvider, useBookingsContext }
