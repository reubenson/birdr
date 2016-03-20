class Login extends React.Component {
  render () {
    var display_text;
    if (this.props.userLoggedIn) {
      display_text =        <a href="/logout">Logout</a>
    } else {
      display_text = <a href="/login">Login</a>
    }

    return (
      <div class="login">
        <b>{this.props.currentUser}</b>
        <a href="/logout">Logout</a>
      </div>
    );
  }
}

Login.propTypes = {
  currentUser: React.PropTypes.string,
  userLoggedIn: React.PropTypes.bool
};
