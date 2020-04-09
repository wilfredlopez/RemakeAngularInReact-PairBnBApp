import { IonPage, IonLoading } from "@ionic/react"
import React from "react"
import { RouteComponentProps } from "react-router"
// import EditOfferContent from "../components/offers/EditOfferContent"

const EditOfferContent = React.lazy(() =>
  import("../components/offers/EditOfferContent"),
)

const EditOffer: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  return (
    <IonPage>
      <React.Suspense
        fallback={<IonLoading isOpen={true} message="Loading..." />}
      >
        <EditOfferContent {...props} />
      </React.Suspense>
    </IonPage>
  )
}

export default EditOffer
