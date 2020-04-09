import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import React from "react"
import { useHistory } from "react-router"
import { useAuthContext } from "../context/AuthContext"
import "./Page.css"

const Logout: React.FC = () => {
  const { logout } = useAuthContext()
  const history = useHistory()
  React.useEffect(() => {
    logout().then(() => {
      history.push("/auth")
    })

    //eslint-disable-next-line
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Logout</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSpinner />
      </IonContent>
    </IonPage>
  )
}

export default Logout
