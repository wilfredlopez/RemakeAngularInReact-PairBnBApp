import { IonItem, IonLabel } from "@ionic/react"
import React from "react"
import { Booking } from "../../context/booking.model"
import { formatDateToString } from "../../helpers/formatDate"

interface Props {
  booking: Booking
}

const BookingItem = ({
  booking: {
    placeTitle,
    guestNumber,
    lastName,
    fistName,
    dateFrom,
    dateTo,
    id,
  },
}: Props) => {
  return (
    <IonItem>
      <IonLabel>
        <h5>{placeTitle}</h5>
        <p>{guestNumber}</p>
      </IonLabel>
      <IonLabel>
        <h6>{fistName + " " + lastName}</h6>
        <p>
          {formatDateToString(dateFrom)} To {formatDateToString(dateTo)}
        </p>
      </IonLabel>
    </IonItem>
  )
}

export default BookingItem
