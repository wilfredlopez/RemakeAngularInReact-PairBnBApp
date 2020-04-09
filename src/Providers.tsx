import React, { PropsWithChildren } from "react"

import { AuthContextProvider } from "./context/AuthContext"
import { PlacesContextProvider } from "./context/PlacesContext"
import { BookingsContextProvider } from "./context/BookingsContext"
const Providers = ({ children }: PropsWithChildren<{}>) => {
  return (
    <AuthContextProvider>
      <BookingsContextProvider>
        <PlacesContextProvider>{children}</PlacesContextProvider>
      </BookingsContextProvider>
    </AuthContextProvider>
  )
}

export default Providers
