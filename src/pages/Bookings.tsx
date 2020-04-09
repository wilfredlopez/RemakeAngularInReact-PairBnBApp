import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonLoading,
} from "@ionic/react"
import React from "react"
// import BookingItem from "../components/bookings/BookingItem"
import { useBookingsContext } from "../context/BookingsContext"
import { trash } from "ionicons/icons"
import { useAuthContext } from "../context/AuthContext"

const BookingItem = React.lazy(() =>
  import("../components/bookings/BookingItem"),
)

const Bookings: React.FC = () => {
  const { bookings, deleteBooking, fetchBookings } = useBookingsContext()
  const { user } = useAuthContext()
  function handleCancelBooking(id: string) {
    console.log(id)
    if (user && user.userId) {
      deleteBooking(id, user.userId)
    }
  }

  React.useEffect(() => {
    if (user) {
      fetchBookings(user)
    }
    //eslint-disable-next-line
  }, [user])
  return (
    <>
      <IonPage>
        <IonHeader collapse="condense">
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Your Bookings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              {bookings.length < -0 && (
                <IonCol size-sm="6" offset-sm="3" class="ion-text-center">
                  <IonText>You have no bookings</IonText>
                </IonCol>
              )}
              <IonCol size-sm="6" offset-sm="3" class="ion-text-center">
                <IonList>
                  {bookings.map((booking) => {
                    return (
                      <IonItemSliding key={booking.id}>
                        <React.Suspense
                          fallback={
                            <IonLoading isOpen={true} message="Loading" />
                          }
                        >
                          <BookingItem booking={booking} />
                        </React.Suspense>
                        <IonItemOptions>
                          <IonItemOption
                            type="button"
                            color="danger"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <IonIcon icon={trash} slot="icon-only"></IonIcon>
                          </IonItemOption>
                        </IonItemOptions>
                      </IonItemSliding>
                    )
                  })}
                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  )
}

export default Bookings
