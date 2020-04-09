import { IonImg, IonItem, IonLabel, IonThumbnail } from "@ionic/react"
import React from "react"
import { Place } from "../../sharedTypes"

interface Props {
  place: Place
}

const DiscoverItem = ({
  place: { id, title, description, imageUrl },
}: Props) => {
  return (
    <IonItem
      button
      // *virtualItem="let place;"
      routerLink={`/places/tabs/discover/${id}`}
      detail
    >
      <IonThumbnail slot="start">
        <IonImg src={imageUrl} alt={title} />
      </IonThumbnail>
      <IonLabel>
        <h2>{title}</h2>
        <p>{description}</p>
      </IonLabel>
    </IonItem>
  )
}

export default DiscoverItem
