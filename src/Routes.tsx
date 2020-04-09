import { IonRouterOutlet, IonSplitPane } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import React from "react"
import { Redirect, Route } from "react-router-dom"
import AuthRoute from "./AuthRoute"
// import Menu from "./components/Menu"
import Auth from "./pages/Auth"
import Bookings from "./pages/Bookings"
import Logout from "./pages/Logout"
// import PlacesTabs from "./pages/PlacesTabs"
import Tests from "./pages/Tests"
// import Menu from "./components/Menu"
// import PlacesTabs from "./pages/PlacesTabs"

const Menu = React.lazy(() => import("./components/Menu"))
const PlacesTabs = React.lazy(() => import("./pages/PlacesTabs"))
interface Props {}

const Routes = (props: Props) => {
  return (
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <React.Suspense fallback="Loading...">
          <Menu />
        </React.Suspense>
        <IonRouterOutlet id="main">
          <React.Suspense fallback="Loading...">
            <PlacesTabs />
          </React.Suspense>

          <Route path="/auth" component={Auth} exact={true} />
          <Route path="/logout" component={Logout} exact={true} />
          <Route path="/test" component={Tests} exact={true} />
          <AuthRoute path="/bookings" Component={Bookings} exact={true} />
          <Route
            path="/"
            render={(props) => <Redirect to="/auth" {...props} />}
            exact={true}
          />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  )
}

export default Routes
