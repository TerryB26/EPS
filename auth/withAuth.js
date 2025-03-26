import React, { Component } from "react";
import { isAuthenticated, getCurrentUser, logout } from "@/auth/session";
import CircularLoader from "@/components/General/CircularLoader";

const withAuth = (WrappedComponent) => {
  class AuthenticatedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isAuthenticated: false,
        user: null,
        loading: true,
      };
    }
    componentDidMount() {
      this.checkAuthentication();
    }

    checkAuthentication = () => {
      const authenticated = isAuthenticated();
      const user = authenticated ? getCurrentUser() : null;

      this.setState({
        isAuthenticated: authenticated,
        user: user,
        loading: false,
      });
    };

    handleLogout = () => {
      logout();
      this.setState({
        isAuthenticated: false,
        user: null,
      });
      if (this.props.history) {
        this.props.history.push("/login");
      }
    };

    render() {
      if (this.state.loading) {
        return <CircularLoader />;
      }

      if (!this.state.isAuthenticated) {
        if (this.props.history) {
          this.props.history.push("/login");
        }
        return null;
      }

      return (
        <WrappedComponent
          {...this.props}
          user={this.state.user}
          isAuthenticated={this.state.isAuthenticated}
          logout={this.handleLogout}
        />
      );
    }
  }

  return AuthenticatedComponent;
};

export default withAuth;
