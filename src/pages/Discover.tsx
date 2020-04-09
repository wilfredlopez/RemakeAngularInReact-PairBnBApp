import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
} from "@ionic/react"
import React from "react"
// import DiscoverContainer from "../components/discover/DiscoverContainer"

const DiscoverContainer = React.lazy(() =>
  import("../components/discover/DiscoverContainer"),
)

const Discover: React.FC = () => {
  return (
    <>
      <IonPage>
        <IonHeader collapse="condense">
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Discover Places</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <React.Suspense fallback={<IonLoading isOpen={true} />}>
            <DiscoverContainer />
          </React.Suspense>
        </IonContent>
      </IonPage>
    </>
  )
}

export default Discover
