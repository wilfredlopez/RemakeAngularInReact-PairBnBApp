import { IonActionSheet, IonButton, IonSpinner } from "@ionic/react"
import { calendar } from "ionicons/icons"
import React, { useState } from "react"
// import DiscoverDetailModal from "./DiscoverDetailModal"
import { Place } from "../../sharedTypes"

interface Props {
  place: Place
}
const DiscoverDetailModal = React.lazy(() => import("./DiscoverDetailModal"))
export type ModalMode = "select" | "random"

const DiscoverDetailActionSheet = ({ place }: Props) => {
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [mode, setMode] = useState<ModalMode>("random")

  function closeModal() {
    setshowModal(false)
  }
  function openModal(mode: ModalMode) {
    setMode(mode)
    setshowModal(true)
  }
  return (
    <div>
      <IonButton color="primary" onClick={() => setShowActionSheet(true)}>
        Book This Place
      </IonButton>
      <React.Suspense fallback={<IonSpinner />}>
        <DiscoverDetailModal
          place={place}
          open={showModal}
          mode={mode}
          close={closeModal}
        />
      </React.Suspense>
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: "Select Date",
            icon: calendar,
            handler: () => {
              openModal("select")
            },
          },
          // {
          //   text: "Random Date",
          //   icon: calendarOutline,
          //   handler: () => {
          //     console.log("Random clicked")
          //     openModal("random")
          //   },
          // },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked")
            },
          },
        ]}
      ></IonActionSheet>
    </div>
  )
}

export default DiscoverDetailActionSheet
