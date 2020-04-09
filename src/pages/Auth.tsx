import { IonPage, IonLoading } from "@ionic/react"
import React from "react"
// import AuthPageContent from "../components/auth/AuthPageContent"

const AuthPageContent = React.lazy(() =>
  import("../components/auth/AuthPageContent"),
)

const Auth: React.FC = () => {
  return (
    <IonPage>
      <React.Suspense fallback={<IonLoading isOpen={true} />}>
        <AuthPageContent />
      </React.Suspense>
    </IonPage>
  )
}

export default Auth
