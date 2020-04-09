import { Field } from "formik"
import React from "react"
import TextInputField from "./TextInputField"

interface Props {
  placeholder: string
  name: string
  type?: string
  autoFocus?: boolean
}

export const TextInputFieldGenerator: React.FC<Props> = ({
  name,
  placeholder,
  type = "text",
  autoFocus,
  ...props
}) => {
  return (
    <Field
      name={name}
      type={type}
      autoFocus={autoFocus}
      label={placeholder}
      labelText={placeholder}
      component={TextInputField}
      placeholder={placeholder}
    />
  )
}
