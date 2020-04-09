import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonLoading,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { Form, Formik } from "formik"
import { checkmark } from "ionicons/icons"
import React, { useState } from "react"
import { Redirect, RouteComponentProps } from "react-router"
import * as yup from "yup"
import { useAuthContext } from "../../context/AuthContext"
import { usePlacesContext } from "../../context/PlacesContext"
import { Place } from "../../sharedTypes"
import { TextInputFieldGenerator } from "../shared/TextInputFieldGenerator"

interface EdifOfferSchema {
  title: string
  description: string
}

const schema = yup.object<EdifOfferSchema>({
  title: yup
    .string()
    .required("Title is required.")
    .min(2, "title should have at least 2 characters."),
  description: yup
    .string()
    .required("Description is required.")
    .min(5, "Description should have at least 5 characters."),
})

const EditOfferContent: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const { getPlace, updatePlace } = usePlacesContext()
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
    undefined,
  )

  const submitBtnRef = React.useRef<HTMLIonButtonElement>(null)

  const [showLoading, setShowLoading] = useState(false)
  const { user } = useAuthContext()
  React.useEffect(() => {
    if (user?.token) {
      getPlace(match.params.id, user.token!).then((place) => {
        setSelectedPlace(place)
      })
    }
    //eslint-disable-next-line
  }, [match.params.id, user])

  if (!user) {
    return <Redirect to="/auth" />
  }
  return (
    <React.Fragment>
      <IonHeader collapse="condense">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/places/tabs/offers" />
          </IonButtons>
          <IonTitle>Edit {selectedPlace?.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                if (submitBtnRef.current) {
                  submitBtnRef.current.click()
                }
              }}
            >
              <IonIcon icon={checkmark} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Loading..."}
          spinner="bubbles"
        />
        {selectedPlace && (
          <Formik<EdifOfferSchema>
            initialValues={{
              title: selectedPlace.title,
              description: selectedPlace.description,
            }}
            validationSchema={schema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async ({ title, description }, helpers) => {
              console.log("Submitting FOrm", title, description)
              setShowLoading(true)

              setTimeout(() => {
                updatePlace(user.token!, {
                  description,
                  title,
                  id: selectedPlace.id,
                })
                setShowLoading(false)
                history.push("/places/tabs/offers")
              }, 2000)
            }}
          >
            {() => (
              <Form>
                <IonGrid>
                  <IonRow>
                    <IonCol sizeSm="6" offsetSm="3">
                      <IonList>
                        <IonItem>
                          <TextInputFieldGenerator
                            name="title"
                            placeholder="Title"
                            autoFocus={true}
                          />
                        </IonItem>
                        <IonItem>
                          <TextInputFieldGenerator
                            name="description"
                            placeholder="Description"
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
                      <IonButton
                        ref={submitBtnRef}
                        type="submit"
                        color="primary"
                        expand="block"
                      >
                        Make Changes
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </Form>
            )}
          </Formik>
        )}
      </IonContent>
    </React.Fragment>
  )
}

export default EditOfferContent
