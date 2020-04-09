import { CameraResultType, CameraSource } from "@capacitor/core"
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  IonButtons,
} from "@ionic/react"
import { useCamera } from "@ionic/react-hooks/camera"
import {
  useCurrentPosition,
  useWatchPosition,
} from "@ionic/react-hooks/geolocation"
import React, { useCallback } from "react"
import { useStatus } from "@ionic/react-hooks/network"
import { usePlatform } from "@ionic/react-hooks/platform"
interface Props {}

const Tests = (props: Props) => {
  const { photo, getPhoto, isAvailable } = useCamera()

  const { platform } = usePlatform()
  const { getPosition } = useCurrentPosition()
  const { currentPosition, startWatch, clearWatch } = useWatchPosition()
  const handleRefreshPosition = () => {
    getPosition()
  }

  const { networkStatus } = useStatus()

  useIonViewDidEnter(() => {
    startWatch()
  })

  React.useEffect(() => {
    startWatch()
    return () => {
      clearWatch()
    }
  }, [clearWatch, startWatch])

  useIonViewDidLeave(() => {
    clearWatch()
  })

  const triggerCamera = useCallback(async () => {
    getPhoto({
      quality: 500,
      correctOrientation: true,
      source: CameraSource.Prompt,
      saveToGallery: true,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    })
  }, [getPhoto])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle slot="start">Test Components</IonTitle>
          <IonButtons slot="end">
            <span>{platform}</span>{" "}
            <span>[{networkStatus?.connectionType}]</span>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeSm="6" offsetSm="3">
              <IonLabel className="ion-text-center">
                <h2>Take a Picture</h2>
              </IonLabel>
              <div
                style={{
                  height: 300,
                  minHeight: 300,
                  display: "grid",
                  justifyContent: "center",
                  margin: "auto",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    border: "1px solid var(--ion-color-primary,blue)",
                    width: 300,
                    height: 290,
                  }}
                >
                  {photo && (
                    <img
                      alt="user"
                      src={photo.dataUrl}
                      height={290}
                      width={300}
                    />
                  )}
                </div>
                <IonButton disabled={!isAvailable} onClick={triggerCamera}>
                  Take Picture
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-padding ion-margin">
            <IonCol size="6" offset="3" sizeSm="6" offsetSm="3">
              <IonLabel className="ion-text-center">
                <h2>Current Position</h2>
                {currentPosition && (
                  <span>
                    <p>Latitude: {currentPosition.coords.latitude}</p>
                    <p>Longitude: {currentPosition.coords.longitude}</p>
                  </span>
                )}
              </IonLabel>
            </IonCol>
            <IonCol size="6" offset="3" sizeSm="4" offsetSm="4">
              <IonButton
                className="ion-text-center"
                color="secondary"
                expand="block"
                size="small"
                onClick={handleRefreshPosition}
              >
                Reload Position
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Tests
