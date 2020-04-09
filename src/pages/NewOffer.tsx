import { IonPage, IonLoading } from "@ionic/react"
import React from "react"
import { RouteComponentProps } from "react-router"
// import NewOfferContent from "../components/offers/NewOfferContent"

const NewOfferContent = React.lazy(() =>
  import("../components/offers/NewOfferContent"),
)
const NewOffer: React.FC<RouteComponentProps<{}>> = (props) => {
  return (
    <IonPage>
      <React.Suspense fallback={<IonLoading isOpen={true} />}>
        <NewOfferContent {...props} />
      </React.Suspense>
    </IonPage>
  )
}

export default NewOffer
