import React from "react"
import {
  IonSpinner,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonActionSheet,
  IonAlert,
} from "@ionic/react"
import { map } from "ionicons/icons"
import { Capacitor, Plugins } from "@capacitor/core"
import { PlaceCoordinates, PlaceLocation } from "../../sharedTypes"
import Axios from "axios"
import { GOOGLE_MAP_API_KEY } from "../../config/constants"
import { MapModal, OverlayEventDetail, SelectedCoors } from "./MapModal"

interface Props {
  getLocationData: (location: PlaceLocation) => void
}

const LocationPicker = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedLocationImage, setSelectedLocationImage] = React.useState("")
  const [showPreview] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [showActionSheet, setShowActionSheet] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  function showErrorAlert() {
    console.log("There was an error")
    setShowAlert(true)
  }

  function openMap() {
    setShowModal(true)
  }

  function onModalDismiss(
    event: CustomEvent<OverlayEventDetail<SelectedCoors>>,
  ) {
    setShowModal(false)
    if (event.detail.data) {
      const { lat, lng } = event.detail.data
      setIsLoading(false)
      createPlace(lat, lng)
    }
  }

  function locateUser() {
    if (!Capacitor.isPluginAvailable("Geolocation")) {
      showErrorAlert()
      return
    }
    setIsLoading(true)

    Plugins.Geolocation.getCurrentPosition()
      .then((geoLocation) => {
        const coords: PlaceCoordinates = {
          lat: geoLocation.coords.latitude,
          lng: geoLocation.coords.longitude,
        }
        createPlace(coords.lat, coords.lng)
      })
      .catch((err) => {
        setIsLoading(false)
        showErrorAlert()
      })
  }

  function getAddressFromGoogleMaps(lat: number, lng: number) {
    return Axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`,
    )
      .then((response) => {
        const geoData = response.data
        console.log(response)
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return ""
        } else {
          return geoData.results[0].formatted_address as string
        }
      })
      .catch((e) => {
        showErrorAlert()
        console.log(e)
      })
  }
  function getMapImageString(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${GOOGLE_MAP_API_KEY}`
  }

  function createPlace(lat: number, lng: number) {
    const location: PlaceLocation = {
      address: "",
      lat: lat,
      lng: lng,
      staticMapImageUrl: "",
    }
    getAddressFromGoogleMaps(lat, lng)
      .then((formatedAddress) => {
        if (formatedAddress) {
          location.address = formatedAddress
          const staticImageUrl = getMapImageString(
            location.lat,
            location.lng,
            15,
          )
          location.staticMapImageUrl = staticImageUrl
          setSelectedLocationImage(staticImageUrl)
          setIsLoading(false)
          props.getLocationData(location)
        } else {
          //There was an error in requesst
          setIsLoading(false)
          showErrorAlert()
        }
      })
      .catch((e) => {
        console.log(e)
        showErrorAlert()
      })
  }

  function onPickLocation() {
    setShowActionSheet(true)
  }

  return (
    <div>
      <MapModal
        title="Pick Location"
        show={showModal}
        closeModal={() => setShowModal(false)}
        showModal={() => setShowModal(true)}
        onDismiss={onModalDismiss}
      />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Sorry. Couldnt get your location."}
        message={"Please try again."}
        buttons={["OK"]}
      />
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header="Please Chooose"
        buttons={[
          {
            text: "Auto-Locate",
            handler: () => {
              locateUser()
            },
          },
          {
            text: "Pick on Map",
            handler: () => {
              openMap()
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ]}
      ></IonActionSheet>
      <div className="picker">
        {isLoading && <IonSpinner color="primary"></IonSpinner>}

        {selectedLocationImage && !isLoading && showPreview && (
          <IonImg
            role="ion-button"
            onClick={onPickLocation}
            src={selectedLocationImage}
            class="location-image"
          ></IonImg>
        )}
        {(!selectedLocationImage || !showPreview) && !isLoading && (
          <IonButton color="primary" onClick={onPickLocation}>
            <IonIcon icon={map} slot="start"></IonIcon>
            <IonLabel>Select Location</IonLabel>
          </IonButton>
        )}
      </div>
    </div>
  )
}

export default LocationPicker
