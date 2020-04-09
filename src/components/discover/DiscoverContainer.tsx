import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonImg,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonVirtualScroll,
  IonItem,
  IonText,
  IonLabel,
} from "@ionic/react"
import React, { useState } from "react"
import { Place } from "../../sharedTypes"
import "./discover.css"
import DiscoverItem from "./DiscoverItem"
import { usePlacesContext } from "../../context/PlacesContext"
import { useAuthContext } from "../../context/AuthContext"

import { Redirect } from "react-router"
interface ContainerProps {}

export interface SegmentChangeEventDetail {
  value: string | undefined
}
const DiscoverContainer: React.FC<ContainerProps> = () => {
  const [currentValue, setCurrentValue] = useState<"all" | "bookable">("all")
  function handleSegmentChange(event: CustomEvent<SegmentChangeEventDetail>) {
    // console.log(event.detail.value)
    setCurrentValue(event.detail.value as any)
  }

  const { places } = usePlacesContext()
  const { user } = useAuthContext()

  const filterData = (value: Place, _index: number, _array: Place[]) => {
    if (!user) {
      console.log("no user in filterdata")
    }
    if (currentValue === "all" || !user) {
      return value.userId !== undefined
    }
    return value.userId !== user.userId
  }

  const [relevantPlaces, setReleveantPlaces] = useState<Place[]>(
    places.filter(filterData),
  )

  const { fetchPlaces } = usePlacesContext()

  React.useEffect(() => {
    if (user && user.token) {
      //geting places
      fetchPlaces(user.token)
    }
    //eslint-disable-next-line
  }, [user])

  React.useEffect(() => {
    setReleveantPlaces(places.filter(filterData))
    //eslint-disable-next-line
  }, [places, currentValue, user])

  if (!user) {
    return <Redirect to="/auth" />
  }

  return (
    <>
      <IonSegment value={currentValue} onIonChange={handleSegmentChange}>
        <IonSegmentButton value="all">All Places</IonSegmentButton>
        <IonSegmentButton value="bookable">
          All Bookable Places
        </IonSegmentButton>
      </IonSegment>
      <IonGrid>
        <IonRow>
          <IonCol
            sizeSm="8"
            size="12"
            offset="0"
            offsetSm="2"
            className="ion-text-center"
          >
            {relevantPlaces.length > 0 ? (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    {relevantPlaces.filter(filterData)[0].title}
                  </IonCardTitle>
                  <IonCardSubtitle>
                    ${relevantPlaces.filter(filterData)[0].price}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCol class="ion-no-padding">
                  <IonImg
                    className="main-image"
                    src={relevantPlaces.filter(filterData)[0].imageUrl}
                    alt="relevantPlaces[0].description"
                  />
                  <IonCardContent>
                    {relevantPlaces.filter(filterData)[0].description}
                  </IonCardContent>
                </IonCol>
                <div className="ion-text-right">
                  <IonButton
                    fill="clear"
                    color="primary"
                    routerDirection="forward"
                    routerLink={`/places/tabs/discover/${
                      relevantPlaces.filter(filterData)[0].id
                    }`}
                  >
                    More
                  </IonButton>
                </div>
              </IonCard>
            ) : (
              <IonItem lines="none" className="ion-text-center">
                <IonLabel className="ion-text-center">
                  <IonText className="ion-text-center">
                    No Places Found.
                  </IonText>
                </IonLabel>
              </IonItem>
            )}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol sizeSm="8" offsetSm="2" class="ion-text-center">
            <IonVirtualScroll items={["me", "mo"]} approxItemHeight={310}>
              {relevantPlaces.filter(filterData).map((place) => {
                return <DiscoverItem key={place.id} place={place} />
              })}
            </IonVirtualScroll>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  )
}

export default DiscoverContainer
