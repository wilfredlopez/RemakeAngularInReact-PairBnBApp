import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react"
import { card, search } from "ionicons/icons"
import React from "react"
import { Redirect } from "react-router"
import AuthRoute from "../AuthRoute"
import { useAuthContext } from "../context/AuthContext"
import Discover from "./Discover"
import DiscoverDetailPage from "./DiscoverDetailPage"
import EditOffer from "./EditOffer"
import NewOffer from "./NewOffer"
import Offers from "./Offers"

const PlacesTabs = () => {
  const { user } = useAuthContext()

  if (!user) {
    return <Redirect to="/auth" />
  }
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <AuthRoute path="/places/tabs/discover" Component={Discover} exact />
        <AuthRoute
          path="/places/tabs/discover/:id"
          Component={DiscoverDetailPage}
          exact={true}
        />
        <AuthRoute
          path="/places/tabs/offers/edit/:id"
          Component={EditOffer}
          exact={true}
        />
        <AuthRoute path="/places/tabs/offers" Component={Offers} exact />
        <AuthRoute path="/places/tabs/offers/new" Component={NewOffer} exact />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton href="/places/tabs/discover" tab="/places/tabs/discover">
          <IonLabel>Discover</IonLabel>
          <IonIcon icon={search}></IonIcon>
        </IonTabButton>
        <IonTabButton href="/places/tabs/offers" tab="/places/tabs/offers">
          <IonLabel>Offers</IonLabel>
          <IonIcon icon={card}></IonIcon>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

export default PlacesTabs
