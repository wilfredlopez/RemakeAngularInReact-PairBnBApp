import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from "@ionic/react"
import React from "react"
import { create } from "ionicons/icons"
import OfferItem from "./OfferItem"

import "./offers.css"
import { useHistory } from "react-router"
import { usePlacesContext } from "../../context/PlacesContext"
import { useAuthContext } from "../../context/AuthContext"
interface OffersContainerProps {}

const OffersContainer: React.FC<OffersContainerProps> = () => {
  const history = useHistory()
  const { places, fetchPlaces } = usePlacesContext()
  const { user } = useAuthContext()
  function handleOptionClick(offerId: string) {
    history.push(`/places/tabs/offers/edit/${offerId}`)
  }

  React.useEffect(() => {
    if (places.length <= 0 && user?.token) {
      fetchPlaces(user.token)
    }
    //eslint-disable-next-line
  }, [])
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="12" size-sm="8" offset-sm="2">
            <IonList>
              {places.map((offer) => {
                return (
                  <IonItemSliding key={offer.id}>
                    <OfferItem offer={offer} />
                    <IonItemOptions>
                      <IonItemOption
                        color="secondary"
                        onClick={() => handleOptionClick(offer.id)}
                      >
                        <IonIcon icon={create} slot="top"></IonIcon>
                        Edit
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                )
              })}
            </IonList>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  )
}

export default OffersContainer
