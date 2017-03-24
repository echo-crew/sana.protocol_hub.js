import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from '../../app/components/App';
import HomePage from '../../app/components/home/HomePage';
import SyncPage from '../../app/components/sync/SyncPage';
import ImportPage from '../../app/components/import/ImportPage';
import AddMdsPage from '../../app/components/mds/AddMdsPage';
import SearchResultsPage from '../../app/components/search/SearchResultsPage';
import ProtocolViewPage from '../../app/components/protocol-view/ProtocolViewPage';
import MdsManagementPage from '../../app/components/mds/MdsManagementPage';
import MemberManagementPage from '../../app/components/settings/members/MemberManagementPage';
import GroupManagementPage from '../../app/components/settings/groups/GroupManagementPage';

require('../styles/main.less');

ReactDOM.render((
  <Router history={browserHistory}>
      <Route component={App}>
          <Route path='/' component={HomePage} />
          <Route path='/search' component={SearchResultsPage} />
          <Route path='/sync' component={SyncPage} />
          <Route path='/import' component={ImportPage} />
          <Route path='/new' component={AddMdsPage} />
          <Route path='/protocol/:protocolId' component={ProtocolViewPage} />
          <Route path='/mds' component={MdsManagementPage} />
          <Route path='/mds/:mdsId' component={SyncPage} />
          <Route path='/settings/members' component={MemberManagementPage} />
          <Route path='/settings/groups' component={GroupManagementPage} />
      </Route>
  </Router>
), document.getElementById('app-root'));
