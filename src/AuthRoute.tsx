import React from "react"
import {
  Redirect,
  Route,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom"
import { useAuthContext } from "./context/AuthContext"

interface Props extends RouteProps {
  Component: React.ComponentType<any> | React.ComponentType<any>
}

interface WithRenderProps extends RouteProps {
  render: (props: RouteComponentProps<any>) => React.ReactNode
  Component?: React.ComponentType<any> | React.ComponentType<any>
}

function AuthRoute(props: Props): JSX.Element
function AuthRoute(props: WithRenderProps): JSX.Element
function AuthRoute({ Component, render, ...rest }: Props | WithRenderProps) {
  const { user } = useAuthContext()

  return (
    <Route
      {...rest}
      render={(props) =>
        user !== null ? (
          Component ? (
            <Component {...props}></Component>
          ) : (
            render!(props)
          )
        ) : (
          <Redirect to="/auth" />
        )
      }
    ></Route>
  )
}

export default AuthRoute
