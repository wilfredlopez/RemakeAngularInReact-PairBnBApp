import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import React, { useState } from "react"
import { RouteComponentProps } from "react-router"
import { usePlacesContext } from "../context/PlacesContext"
import { Place } from "../sharedTypes"
import { useAuthContext } from "../context/AuthContext"
// import DiscoverDetailActionSheet from "../components/discover/DiscoverDetailActionSheet"

const DiscoverDetailActionSheet = React.lazy(() =>
  import("../components/discover/DiscoverDetailActionSheet"),
)
const DiscoverDetailPage: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const { getPlace } = usePlacesContext()
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
    undefined,
  )

  const { user } = useAuthContext()

  React.useEffect(() => {
    if (user?.token) {
      getPlace(match.params.id, user.token).then((place) => {
        setSelectedPlace(place)
      })
    }
    //eslint-disable-next-line
  }, [match.params.id, user])

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/places/tabs/discover" />
          </IonButtons>
          <IonTitle>{selectedPlace?.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {selectedPlace ? (
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-no-padding">
              <IonCol sizeSm="6" offsetSm="3" className="ion-no-padding">
                <IonImg
                  src={selectedPlace?.imageUrl}
                  style={{
                    height: 300,
                    width: "100%",
                    objectFit: "cover",
                  }}
                ></IonImg>
              </IonCol>
            </IonRow>
            <IonRow className="ion-text-center">
              <IonCol sizeSm="6" offsetSm="3">
                <h3>{selectedPlace.description}</h3>
              </IonCol>
            </IonRow>
            <IonRow className="ion-text-center">
              <IonCol sizeSm="6" offsetSm="3">
                <React.Suspense fallback={<IonSpinner />}>
                  <DiscoverDetailActionSheet place={selectedPlace} />
                </React.Suspense>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonSpinner></IonSpinner>
        )}
      </IonContent>
    </IonPage>
  )
}

export default DiscoverDetailPage
