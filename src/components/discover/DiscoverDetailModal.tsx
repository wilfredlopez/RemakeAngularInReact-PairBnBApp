import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
} from "@ionic/react"
import { Form, Formik } from "formik"
import React from "react"
import * as yup from "yup"
import { Place } from "../../sharedTypes"
import { DateInputFieldGenerator } from "../shared/DateInputFieldGenerator"
import { TextInputFieldGenerator } from "../shared/TextInputFieldGenerator"
import { close } from "ionicons/icons"
import { useBookingsContext } from "../../context/BookingsContext"
import { Booking } from "../../context/booking.model"
import { useAuthContext } from "../../context/AuthContext"
import { Redirect, useHistory } from "react-router"

interface FormValues {
  firstname: string
  lastname: string
  numberOfGuests: number
  dateFrom: string | Date
  dateTo: string | Date
}

const schema = yup.object<FormValues>({
  firstname: yup
    .string()
    .required("First Name is required.")
    .min(2, "First Name should have at least 2 characters."),
  lastname: yup
    .string()
    .required("Last Name is required.")
    .min(2, "Last Name should have at least 2 characters."),
  numberOfGuests: yup.number().required(),
  dateFrom: yup.date().required("Date from is required"),
  dateTo: yup
    .date()
    .test("dateTo", "Should be greater than Date from", function (value: Date) {
      const parent = this.parent as FormValues
      if (!parent.dateFrom || !value) {
        return false
      }
      const from = new Date(parent.dateFrom).valueOf()
      const to = new Date(value).valueOf()
      if (from > to || from === to) {
        return false
      } else {
        return true
      }
    }),
})

interface Props {
  open: boolean
  mode: "select" | "random"
  close: () => void
  place: Place
}

const DiscoverDetailModal = ({ open, close: CloseModal, place }: Props) => {
  const { addBooking } = useBookingsContext()
  const history = useHistory()
  const { user } = useAuthContext()
  if (!user) {
    return <Redirect to="/auth" />
  }
  return (
    <div>
      <IonModal isOpen={open}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{place.title}</IonTitle>
            <IonButtons slot="primary">
              <IonButton onClick={CloseModal}>
                <IonIcon icon={close} slot="icon-only"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-text-center ion-padding">
          <h1>Book this place!</h1>
          <p>{place.description}</p>
          <Formik<FormValues>
            initialValues={{
              firstname: "",
              lastname: "",
              dateFrom: "",
              dateTo: "",
              numberOfGuests: 2,
            }}
            validationSchema={schema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (
              { dateFrom, dateTo, firstname, lastname, numberOfGuests },
              helpers,
            ) => {
              console.log(
                "Submitting FOrm",
                dateFrom,
                dateTo,
                firstname,
                lastname,
                numberOfGuests,
              )

              const booking: Booking = {
                dateFrom: new Date(dateFrom),
                dateTo: new Date(dateTo),
                fistName: firstname,
                lastName: lastname,
                guestNumber: numberOfGuests,
                id: "",
                placeId: place.id,
                placeImage: place.imageUrl,
                placeTitle: place.title,
                userId: user.userId,
              }
              addBooking(user.token!, booking)
              CloseModal()
              history.push("/bookings")
            }}
          >
            {(props) => (
              <Form>
                <IonGrid>
                  <IonRow>
                    <IonCol sizeSm="6" offsetSm="3">
                      <IonList>
                        <IonItem>
                          <TextInputFieldGenerator
                            name="firstname"
                            placeholder="First Name"
                            type="text"
                            autoFocus={true}
                          />
                        </IonItem>
                        <IonItem>
                          <TextInputFieldGenerator
                            name="lastname"
                            placeholder="Last Name"
                            type="text"
                          />
                        </IonItem>
                        <IonItem>
                          <TextInputFieldGenerator
                            name="numberOfGuests"
                            placeholder="Number of Guests"
                            type="number"
                          />
                        </IonItem>
                        <IonItem>
                          <DateInputFieldGenerator
                            name="dateFrom"
                            placeholder="Date From"
                          />
                        </IonItem>
                        <IonItem>
                          <DateInputFieldGenerator
                            name="dateTo"
                            placeholder="Date To"
                          />
                        </IonItem>
                      </IonList>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol
                      sizeSm="6"
                      offsetSm="3"
                      className="ion-padding ion-text-center"
                    >
                      <IonButton type="submit" color="secondary" expand="block">
                        Book
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </Form>
            )}
          </Formik>
        </IonContent>
        <IonButton onClick={CloseModal} color="primary">
          Close Modal
        </IonButton>
      </IonModal>
      {/* <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton> */}
    </div>
  )
}

export default DiscoverDetailModal
