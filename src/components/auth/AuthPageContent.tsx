import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
  IonLoading,
} from "@ionic/react"
import { Form, Formik } from "formik"
import React, { useState } from "react"
import * as yup from "yup"

import axios from "axios"

import { useHistory, Redirect } from "react-router"
import { useAuthContext, AuthResponseData } from "../../context/AuthContext"
import { FIREBAE_API_KEY } from "../../config/constants"
import { TextInputFieldGenerator } from "../shared/TextInputFieldGenerator"

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required("Email is required.")
    .min(2, "First Name should have at least 2 characters."),
  password: yup
    .string()
    .required("Password is required.")
    .min(5, "The Password should have at least 5 characters."),
})

const AuthPageContent: React.FC = () => {
  const [loginOrSignUp, setLoginOrSignUp] = useState<"Login" | "SignUp">(
    "Login",
  )
  const history = useHistory()
  const { setUserData, user } = useAuthContext()
  const [showLoading, setShowLoading] = useState(false)
  function switchLoginOrSignUp() {
    setLoginOrSignUp((current) => (current === "Login" ? "SignUp" : "Login"))
  }

  if (user !== null) {
    return <Redirect to="/places/tabs/discover" />
  }

  return (
    <React.Fragment>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{loginOrSignUp}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Let's do it..."}
          duration={5000}
        />
        {/* <IonHeader collapse="condense">
            <IonToolbar color="primary">
              <IonTitle size="large" className="ion-text-center">
                {loginOrSignUp}
              </IonTitle>
            </IonToolbar>
          </IonHeader> */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={schema}
          validateOnBlur={true}
          validateOnChange={false}
          onSubmit={async ({ email, password }, helpers) => {
            console.log("Submitting FOrm", email, password)

            setShowLoading(true)

            if (loginOrSignUp === "Login") {
              axios
                .post<AuthResponseData>(
                  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBAE_API_KEY}`,
                  {
                    email,
                    password,
                    returnSecureToken: true,
                  },
                )
                .then((response) => {
                  setUserData(response.data)
                  history.push("/places/tabs/discover")
                })
                .catch((error) => {
                  console.log(error.response)
                  const code = error.response?.data?.error?.message
                  console.log(code, "code")
                  let message = "Request failed"
                  if (code === "EMAIL_EXISTS") {
                    message = "This Email Already Exist"
                  } else if (code === "EMAIL_NOT_FOUND") {
                    message = "This Email address could not be found"
                  } else if (code === "INVALID_PASSWORD") {
                    message = "Unable to authenticate. please try again."
                  }
                  helpers.setErrors({
                    password: message,
                  })
                  setShowLoading(false)
                })

              return
            } else {
              axios
                .post<AuthResponseData>(
                  `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBAE_API_KEY}`,
                  {
                    email,
                    password,
                    returnSecureToken: true,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                )
                .then((response) => {
                  setUserData(response.data)
                  history.push("/places/tabs/discover")
                })
                .catch((error) => {
                  console.log(error.response)
                  const code = error.response?.data?.error?.message
                  console.log(code, "code")
                  let message = "Request failed"
                  if (code === "EMAIL_EXISTS") {
                    message = "This Email Already Exist"
                  } else if (code === "EMAIL_NOT_FOUND") {
                    message = "This Email address could not be found"
                  } else if (code === "INVALID_PASSWORD") {
                    message = "Unable to authenticate. please try again."
                  }
                  helpers.setErrors({
                    password: message,
                  })
                  setShowLoading(false)
                })

              return
            }
          }}
        >
          {() => (
            <Form>
              <IonGrid>
                <IonRow>
                  <IonCol sizeSm="6" offsetSm="3">
                    <IonList>
                      <IonItem>
                        <TextInputFieldGenerator
                          name="email"
                          placeholder="Email"
                          type="email"
                          autoFocus={true}
                        />
                      </IonItem>
                      <IonItem>
                        <TextInputFieldGenerator
                          name="password"
                          placeholder="Password"
                          type="password"
                        />
                      </IonItem>
                    </IonList>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol
                    sizeSm="6"
                    offsetSm="3"
                    className="ion-padding ion-text-center"
                  >
                    <IonButton type="submit" color="primary" expand="block">
                      {loginOrSignUp}
                    </IonButton>
                    <IonButton
                      type="button"
                      onClick={switchLoginOrSignUp}
                      expand="block"
                      fill="outline"
                      color="secondary"
                    >
                      Switch to Sign Up
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </Form>
          )}
        </Formik>

        {/* <AuthContainer /> */}
      </IonContent>
    </React.Fragment>
  )
}

export default AuthPageContent
