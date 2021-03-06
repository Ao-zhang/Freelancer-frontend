import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import * as UserSER from './services/UserService'
import { message } from 'antd'

class PersonRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      haveAuth: false,
      appliedAuth: false
    }
  }

  checkAuth = (data) => {
    console.log('will: PersonRouter -> checkAuth -> data', data)
    if (data.status == 0) {
      this.setState({ haveAuth: true, appliedAuth: true })
    } else {
      console.log('will: PersonRouter -> checkAuth -> data.msg', data.msg)
      localStorage.removeItem('user')
      this.setState({ haveAuth: false, appliedAuth: true })
    }
  }

  componentDidMount() {
    let currentpath = this.props.location
    let if_tologin = false
    if (currentpath.pathname == '/release') {
      if_tologin = true
    }
    console.log(
      'will: PersonRouter -> componentDidMount -> if_tologin',
      if_tologin
    )
    this.setState({ if_tologin })

    UserSER.checkSession(this.checkAuth)
  }

  render() {
    const {
      component: Component,
      path = '/',
      exact = false,
      strict = false
    } = this.props
    console.log(this.state.haveAuth)

    if (!this.state.appliedAuth) {
      return null
    }
    return (
      <Route
        path={path}
        exact={exact}
        strict={strict}
        render={(props) =>
          this.state.haveAuth ? (
            <Component {...props} />
          ) : this.state.if_tologin ? (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          ) : (
            <Redirect
              to={{
                pathname: '/unlogin',
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )
  }
}

export default PersonRouter
