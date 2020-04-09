import React from "react"
import { FieldProps } from "formik"
import { IonInput, IonLabel, IonText } from "@ionic/react"
import { ColorTypes } from "../../sharedTypes"

interface ITextInputFieldProps extends FieldProps {
  labelText: string
  color?: ColorTypes
}

const TextInputField: React.FunctionComponent<ITextInputFieldProps> = ({
  field,
  form,
  labelText,
  color,
  ...props
}) => {
  const errorMessage = form.touched[field.name] && form.errors[field.name]

  return (
    <React.Fragment>
      <IonLabel position="floating">{labelText}</IonLabel>
      <IonInput
        color={color}
        {...field}
        {...props}
        onIonChange={field.onChange}
        required
        // ref={emailInputRef}
      ></IonInput>
      <IonText color="danger">{errorMessage}</IonText>
    </React.Fragment>
  )
}

export default TextInputField
