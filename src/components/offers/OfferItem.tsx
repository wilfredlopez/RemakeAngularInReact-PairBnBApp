import React from "react"
import {
  IonThumbnail,
  IonImg,
  IonLabel,
  IonIcon,
  IonText,
  IonItem,
} from "@ionic/react"
import { Place } from "../../sharedTypes"
import { calendar } from "ionicons/icons"
import { formatDateToString } from "../../helpers/formatDate"

interface Props {
  offer: Place
}

const OfferItem = ({ offer }: Props) => {
  return (
    <IonItem routerLink={`/places/tabs/offers/edit/${offer.id}`}>
      <IonThumbnail slot="start">
        <IonImg src={offer.imageUrl}></IonImg>
      </IonThumbnail>
      <IonLabel>
        <h1>{offer.title}</h1>
        <div className="offer-details">
          <IonIcon icon={calendar} color="tertiary"></IonIcon>
          <IonText class="space-left">
            {formatDateToString(offer.availableFrom)}{" "}
          </IonText>
          <span className="space-left">
            <strong>To</strong>
          </span>
          <IonIcon
            icon={calendar}
            color="tertiary"
            class="space-left"
          ></IonIcon>
          <IonText class="space-left">
            {formatDateToString(offer.availableTo)}{" "}
          </IonText>
        </div>
      </IonLabel>
    </IonItem>
  )
}

export default OfferItem
