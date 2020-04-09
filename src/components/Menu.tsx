import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
} from "@ionic/react"
import {
  archiveOutline,
  archiveSharp,
  // bookmarkOutline,
  heartOutline,
  heartSharp,
  paperPlaneOutline,
  paperPlaneSharp,
} from "ionicons/icons"
import React from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import "./Menu.css"
import { useAuthContext } from "../context/AuthContext"

interface MenuProps extends RouteComponentProps {}

interface AppPage {
  url: string
  iosIcon: string
  mdIcon: string
  title: string
}

const appPages: AppPage[] = [
  {
    title: "Discover Places",
    url: "/places/tabs/discover",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
  {
    title: "Your Bookings",
    url: "/bookings",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: "logout",
    url: "/logout",
    iosIcon: archiveOutline,
    mdIcon: archiveSharp,
  },
]

// const labels = ["Family", "Friends", "Reminders"]

const Menu: React.FunctionComponent<MenuProps> = () => {
  const { user } = useAuthContext()
  if (!user) {
    return null
  }
  return (
    <IonMenu contentId="main" type="push">
      <IonListHeader color="primary">
        <IonTitle>PairBnB</IonTitle>
      </IonListHeader>
      <IonContent>
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}
        </IonList>

        {/* <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  )
}

export default withRouter(Menu)
