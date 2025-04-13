import React, { Component } from "react";
import { isAuthenticated, getCurrentUser, logout } from "@/auth/session";
import CircularLoader from "@/components/General/CircularLoader";
import { useRouter } from "next/router";

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

      if (!authenticated) {
        const router = this.props.router;
        router.push("/Login");
      }
    };

    handleLogout = () => {
      logout();
      this.setState({
        isAuthenticated: false,
        user: null,
      });
      const router = this.props.router;
      router.push("/Login");
    };

    render() {
      const { loading, isAuthenticated } = this.state;

      if (loading) {
        return <CircularLoader />;
      }

      if (!isAuthenticated) {
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

  const WithRouter = (props) => {
    const router = useRouter();
    return <AuthenticatedComponent {...props} router={router} />;
  };

  return WithRouter;
};

export default withAuth;