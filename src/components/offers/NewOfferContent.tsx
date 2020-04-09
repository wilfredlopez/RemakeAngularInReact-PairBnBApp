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
import { base64toBlob } from "../../helpers/fileTransform"
import { Place, PlaceLocation } from "../../sharedTypes"
import { DateInputFieldGenerator } from "../shared/DateInputFieldGenerator"
import ImagePicker from "../shared/ImagePicker"
import LocationPicker from "../shared/LocationPicker"
import { TextInputFieldGenerator } from "../shared/TextInputFieldGenerator"

interface EdifOfferSchema
  extends Omit<
    Place,
    "id" | "userId" | "location" | "imageUrl" | "availableFrom" | "availableTo"
  > {
  availableFrom: string
  availableTo: string
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
  price: yup.number().required(),
  availableFrom: yup.string().required(),
  availableTo: yup
    .string()
    .required()
    .test("availableTo", "Should be greater than available from", function (
      value: string,
    ) {
      if (!value) {
        return false
      }
      const schema = this.parent as EdifOfferSchema
      if (!schema.availableFrom) {
        return false
      }
      const from = new Date(schema.availableFrom)
      const to = new Date(value)
      const fromTime = from.getFullYear() + from.getMonth() + from.getDate()
      const toTime = to.getFullYear() + to.getMonth() + to.getDate()

      if (fromTime === toTime) {
        return false
      }
      if (
        //today 2020+4+8=2032
        fromTime < toTime
      ) {
        return true
      }

      return false
    }),
})

const NewOfferContent: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const { addPlace } = usePlacesContext()

  const submitBtnRef = React.useRef<HTMLIonButtonElement>(null)
  const { user } = useAuthContext()
  const [showLoading, setShowLoading] = useState(false)
  const imageFileData = React.useRef<Blob>()
  const [
    fetchedLocation,
    setFetchedLocation,
  ] = React.useState<PlaceLocation | null>(null)

  function onLocationData(location: PlaceLocation) {
    console.log(location)
    setFetchedLocation(location)
  }

  function onImagePicked(imageData: string | File) {
    let imageFile: Blob = new Blob()
    // console.log("Image Data is :", imageData, "new-offer.page.ts:108")
    if (typeof imageData === "string") {
      try {
        imageFile = base64toBlob(
          imageData.replace("data:image/png;base64,", ""),
          "image/jpeg",
        )
      } catch (error) {
        console.log(error)
      }
    } else {
      imageFile = imageData
    }
    imageFileData.current = imageFile
    return imageFile
  }

  if (!user) {
    return <Redirect to="/auth"></Redirect>
  }

  return (
    <React.Fragment>
      <IonHeader collapse="condense">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/places/tabs/offers" />
          </IonButtons>
          <IonTitle>New Offer</IonTitle>
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
        <Formik<EdifOfferSchema>
          initialValues={{
            title: "",
            description: "",
            availableFrom: new Date().toDateString(),
            availableTo: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            ).toDateString(),
            price: 0,
          }}
          validationSchema={schema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={async (data, helpers) => {
            setShowLoading(true)
            if (!imageFileData.current) {
              helpers.setErrors({
                title: "Please Select An Image File To continue",
              })
              return
            }

            if (!fetchedLocation) {
              helpers.setErrors({
                title: "Please Select An Location to continue.",
              })
              return
            }

            const place: Omit<Place, "id" | "imageUrl"> = {
              ...data,
              availableFrom: new Date(data.availableFrom),
              availableTo: new Date(data.availableTo),
              location: fetchedLocation,
              userId: user!.userId,
            }
            addPlace(place, imageFileData.current, user.token!).then(() => {
              setShowLoading(false)
              history.push("/places/tabs/offers")
            })
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
                      <IonItem>
                        <TextInputFieldGenerator
                          name="price"
                          placeholder="Price"
                          type="number"
                        />
                      </IonItem>
                      <IonItem>
                        <DateInputFieldGenerator
                          name="availableFrom"
                          placeholder="Available From"
                        />
                      </IonItem>
                      <IonItem>
                        <DateInputFieldGenerator
                          name="availableTo"
                          placeholder="To"
                        />
                      </IonItem>
                    </IonList>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol sizeSm="6" offsetSm="3">
                    <ImagePicker getFile={onImagePicked} />

                    <LocationPicker getLocationData={onLocationData} />
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
                      Add Place
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </Form>
          )}
        </Formik>
      </IonContent>
    </React.Fragment>
  )
}

export default NewOfferContent
