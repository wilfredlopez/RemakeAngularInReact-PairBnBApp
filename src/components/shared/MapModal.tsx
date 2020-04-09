import React from "react"
import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from "@ionic/react"
import { GOOGLE_MAP_API_KEY } from "../../config/constants"
import "./mapModal.css"
export interface OverlayEventDetail<T = any> {
  data?: T
  role?: string
}
interface MapModalProps {
  title: string
  show: boolean
  closeModal: () => void
  showModal: () => void
  onDismiss?: (event: CustomEvent<OverlayEventDetail<SelectedCoors>>) => void
}

export interface SelectedCoors {
  lat: number
  lng: number
}

export const MapModal: React.FC<MapModalProps> = ({
  show,
  closeModal,
  showModal,
  onDismiss,
  title,
}) => {
  const center = { lat: 40.870052, lng: -74.10717 }
  const mapElement = React.useRef<HTMLDivElement>(null)
  const selectable = true
  const MyGoogleMaps = React.useRef<any>(null)
  const clickListenter = React.useRef<any>()
  const ModalElementRef = React.useRef<HTMLIonModalElement>(null)
  React.useLayoutEffect(() => {
    getGoogleMaps()
      .then((googleMaps) => {
        if (MyGoogleMaps.current === null || mapElement.current === null) {
          MyGoogleMaps.current = googleMaps
          return
        }
        MyGoogleMaps.current = googleMaps

        const map = new googleMaps.Map(mapElement.current, {
          center: center,
          zoom: 16,
        })
        MyGoogleMaps.current.event.addListenerOnce(map, "idle", () => {
          if (mapElement.current) {
            mapElement.current.classList.add("visible")
          }
        })

        if (selectable) {
          clickListenter.current = map.addListener("click", (event: any) => {
            const selectedCoords = {
              lat: event.latLng.lat(),

              lng: event.latLng.lng(),
            }

            ModalElementRef.current!.dismiss(selectedCoords)
          })
        } else {
          const marker = new googleMaps.Marker({
            position: center,
            map: map,
            title: title,
          })

          marker.setMap(map)
        }
      })
      .catch((e) => console.error(e))
    return () => {
      const listener = clickListenter
      const googleMapsEl = MyGoogleMaps
      if (listener.current && googleMapsEl.current) {
        googleMapsEl.current.event.removeListener(listener.current)
      }
    }
    //eslint-disable-next-line
  }, [center])

  function getGoogleMaps(): Promise<any> {
    const win = window as any
    const googleModule = win.google

    if (googleModule || MyGoogleMaps.current) {
      //google maps already loaded
      return Promise.resolve(googleModule.maps)
    } else {
      return new Promise((resolve, reject) => {
        const existingScriptEl = document.getElementById("googleMapsScript")
        if (existingScriptEl) {
          return
        }
        const script = document.createElement("script")
        const APIKEY = GOOGLE_MAP_API_KEY

        script.id = "googleMapsScript"
        script.src = `https://maps.googleapis.com/maps/api/js?key=${APIKEY}`
        script.async = true
        script.defer = true

        document.body.appendChild(script)
        script.onload = () => {
          const loadedGoogleModule = win.google
          if (loadedGoogleModule && loadedGoogleModule.maps) {
            resolve(loadedGoogleModule.maps)
          } else {
            reject("Google Maps SDK Not Available.")
          }
        }
      })
    }
  }

  return (
    <IonContent>
      <span className="mapModal">
        <IonModal ref={ModalElementRef} isOpen={show} onDidDismiss={onDismiss}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>{title}</IonTitle>
              <IonButtons>
                <IonButton onClick={closeModal}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <div className="map" ref={mapElement}></div>
          <IonButton onClick={closeModal}>Close Modal</IonButton>
        </IonModal>
        <IonButton onClick={showModal}>Show Modal</IonButton>
      </span>
    </IonContent>
  )
}
