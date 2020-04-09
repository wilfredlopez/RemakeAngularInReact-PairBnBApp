import React from "react"
import { Field, FieldProps } from "formik"
import { IonDatetime, IonText, IonLabel } from "@ionic/react"
import { ColorTypes } from "../../sharedTypes"
interface Props {
  placeholder: string
  name: string
  autoFocus?: boolean
}

interface IonDatetimeCustomOptions {
  cancelText?: string

  dayNames?: string[] | string

  dayShortNames?: string[] | string

  dayValues?: number[] | number | string

  displayFormat?: string
  /**
   * The timezone to use for display purposes only. See [Date.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) for a list of supported timezones. If no value is provided, the component will default to displaying times in the user's local timezone.
   */
  displayTimezone?: string
  /**
   * The text to display on the picker's "Done" button.
   */
  doneText?: string
  /**
   * Values used to create the list of selectable hours. By default the hour values range from `0` to `23` for 24-hour, or `1` to `12` for 12-hour. However, to control exactly which hours to display, the `hourValues` input can take a number, an array of numbers, or a string of comma separated numbers.
   */
  hourValues?: number[] | number | string

  minuteValues?: number[] | number | string
  monthNames?: string[] | string
  /**
   * Short abbreviated names for each month name. This can be used to provide locale month names. Defaults to English.
   */
  monthShortNames?: string[] | string
  /**
   * Values used to create the list of selectable months. By default the month values range from `1` to `12`. However, to control exactly which months to display, the `monthValues` input can take a number, an array of numbers, or a string of comma separated numbers. For example, if only summer months should be shown, then this input value would be `monthValues="6,7,8"`. Note that month numbers do *not* have a zero-based index, meaning January's value is `1`, and December's is `12`.
   */
  monthValues?: number[] | number | string

  yearValues?: number[] | number | string

  /**
   * The maximum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the maximum could just be the year, such as `1994`. Defaults to the end of this year.
   */
  max?: string
  /**
   * The minimum datetime allowed. Value must be a date string following the [ISO 8601 datetime format standard](https://www.w3.org/TR/NOTE-datetime), such as `1996-12-19`. The format does not have to be specific to an exact datetime. For example, the minimum could just be the year, such as `1994`. Defaults to the beginning of the year, 100 years ago from today.
   */
  min?: string
}

export const DateInputFieldGenerator: React.FC<
  Props & IonDatetimeCustomOptions
> = ({ name, placeholder, autoFocus, ...props }) => {
  return (
    <Field
      {...props}
      name={name}
      type="date"
      autoFocus={autoFocus}
      label={placeholder}
      labelText={placeholder}
      component={DateInput}
      placeholder={placeholder}
    />
  )
}

interface DateInputProps extends FieldProps {
  labelText: string
  color?: ColorTypes
}

const DateInput = ({
  field,
  labelText,
  form,
  ...props
}: DateInputProps & IonDatetimeCustomOptions) => {
  const errorMessage = form.touched[field.name] && form.errors[field.name]

  return (
    <React.Fragment>
      <IonLabel position="floating">{labelText}</IonLabel>
      <IonDatetime
        min={props.min}
        displayFormat="MMM DD YYYY"
        pickerFormat="YYYY MMM DD"
        {...field}
        {...props}
        onIonBlur={field.onBlur}
        onIonChange={field.onChange}
      ></IonDatetime>
      <IonText color="danger">{errorMessage}</IonText>
    </React.Fragment>
  )
}
