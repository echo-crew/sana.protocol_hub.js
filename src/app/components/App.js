import React from 'react';
import { Link, browserHistory } from 'react-router';

//import config from '../../../config/Linkpp';

class Linkpp extends React.Component {
  constructor() {
    super();

    this.state = {
      query: ''
    };

    this.handleQuery = this.handleQuery.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleQuery(event) {
    this.setState({query: event.target.value});
  }

  handleSearch(event) {
    event.preventDefault();
    browserHistory.push('/search?query=' + this.state.query);
  }

  render() {
    let logged_in = true;
    let nav_settings = <div className='navbar-right'><a className='login-button' href='' >Login</a></div>;

    if(logged_in) {
      nav_settings = (
        <div className='navbar-right'>
          <span className='glyphicon glyphicon-user user-icon'></span>
          <Link className='user-settings' to='settings/members' role='button'>
            Username
          </Link>
          <Link className='user-logout' to='#' role='button'>
            Logout
          </Link>
        </div>
      );
    }

    return (
      <div>
        <nav className='navbar'>
          <div className='navbar-left'>
            <Link to='/' className='home-button'><span className='glyphicon glyphicon-home'></span></Link>
            <form className='search-bar' onSubmit={this.handleSearch}>
              <input type='text' value={this.state.query} onChange={this.handleQuery} placeholder=' search protocols' />
            </form>
          </div>

          {nav_settings}
        </nav>

        <header className='title-bar'>
          <h1 className='sana-logo'>Sana Protocol Hub</h1>
        </header>

        <div className='container-fluid Linkpp'>
          {this.props.children}
        </div>

        <footer className="main-footer">
          <p>
            Copyright &copy; 2017 Sana Protocol Hub
          </p>
          <ul className="list-inline">
            <li><Link to='/english/credits'>Credits</Link></li>
          </ul>
        </footer>
      </div>
    );
  }
}

module.exports = Linkpp;
