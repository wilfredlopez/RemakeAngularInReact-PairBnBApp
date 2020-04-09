import React, { useState } from "react"
import { IonButton, IonIcon, IonLabel, IonImg } from "@ionic/react"
import { camera } from "ionicons/icons"
import { isPlatform } from "@ionic/react"
import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType,
} from "@capacitor/core"

import "./imagePicker.css"
interface Props {
  getFile: (file: File | string) => void
}

const ImagePicker = ({ getFile }: Props) => {
  const [selectedImage, setSelectedImage] = useState("")
  const filePickerRef = React.useRef<HTMLInputElement>(null)
  const [usePicker, setUsePicker] = useState(false)

  function onFileChoosen(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const pickedFile = event.target.files[0]
      if (!pickedFile) {
        return
      }

      const fr = new FileReader()
      fr.onload = () => {
        if (fr.result) {
          const dataUrl = fr.result.toString()
          setSelectedImage(dataUrl)
          getFile(pickedFile)
        }
      }
      fr.readAsDataURL(pickedFile)
    }
  }

  function onPickImage(
    event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>,
  ) {
    if (!Capacitor.isPluginAvailable("Camera")) {
      //Opens the web input element
      filePickerRef.current!.click()
      return
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl,
    })
      .then((image) => {
        setSelectedImage(image.dataUrl!)
        getFile(image.dataUrl!)
      })
      .catch((err) => {
        console.log(err)
        if (usePicker) {
          filePickerRef.current?.click()
        }
        return false
      })
  }

  React.useEffect(() => {
    if (
      (isPlatform("mobile") && !isPlatform("hybrid")) ||
      isPlatform("desktop")
    ) {
      setUsePicker(true)
    }
  }, [])

  return (
    <div className="imagePicker">
      <div className="picker">
        {selectedImage && (
          <IonImg
            role="ion-button"
            onClick={onPickImage}
            src={selectedImage}
            class="selected-image"
          ></IonImg>
        )}
        {!selectedImage && (
          <IonButton color="primary" onClick={onPickImage}>
            <IonIcon icon={camera} slot="start"></IonIcon>
            <IonLabel>Take Picture</IonLabel>
          </IonButton>
        )}
      </div>
      <input
        ref={filePickerRef}
        type="file"
        accept="image/jpeg"
        onChange={onFileChoosen}
      ></input>
    </div>
  )
}

export default ImagePicker
