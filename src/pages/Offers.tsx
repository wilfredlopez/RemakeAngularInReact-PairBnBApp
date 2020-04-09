import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonLoading,
} from "@ionic/react"
import React from "react"
import { add } from "ionicons/icons"
// import OffersContainer from "../components/offers/OffersContainer"
const OffersContainer = React.lazy(() =>
  import("../components/offers/OffersContainer"),
)
const Offers: React.FC = () => {
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Offers</IonTitle>
          <IonButtons slot="primary">
            <IonButton routerLink="/places/tabs/offers/new">
              <IonIcon icon={add} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <React.Suspense
          fallback={<IonLoading isOpen={true} message="loading" />}
        >
          <OffersContainer />
        </React.Suspense>
      </IonContent>
    </IonPage>
  )
}

export default Offers
