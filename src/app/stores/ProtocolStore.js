import AppDispatcher from '../dispatcher/AppDispatcher';
import ProtocolActions from '../actions/ProtocolActions';
import StoreActions from '../actions/StoreActions';
import request from 'superagent-bluebird-promise';
import { EventEmitter } from 'events';

let _protocols = [
  {
    id: 1,
    revision: 1,
    content: '<BODY>CONTENT</BODY>',
    owner: 'delta',
    name: 'test protocol 1',
    private: true,
    revision_date: '2017-01-01',
  }, {
    id: 1,
    revision: 2,
    content: '<BODY>OLD CONTENT</BODY>',
    owner: 'delta',
    name: 'test protocol 1',
    private: true,
    revision_date: '2016-12-31',
  },
];

function _addProtocol(protocol) {
  _protocols.push(protocol);
}

function _updateProtocol(id, updates) {
  let i = _protocols.findIndex((protocol) => {
    return protocol.id === id;
  });
  Object.assign(_protocols[id], updates);
}

function _removeProtocol(id) {
  let i = _protocols.findIndex((protocol) => {
    return protocol.id === id;
  });
  _protocols.splice(i, 1);
}

class ProtocolStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  getAll() {
    return _protocols;
  }

  get(id) {
    let revisions = getAllRevisions(id);
    return revisions[0];
  }

  getAllRevisions(id) {
    let revisions = [];
    _protocols.forEach((protocol) => {
      if(protocol.id === id) revisions.push(protocol);
    });

    return revisions;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(cb) {
    this.on(StoreActions.CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(StoreActions.CHANGE_EVENT, cb);
  }

  dispatcherCallback(action) {
    switch(action.type) {
      case ProtocolActions.CREATE_PROTOCOL:
        _addProtocol(action.protocol);
        this.emitChange();
        break;
      case ProtocolActions.UPDATE_PROTOCOL:
        _updateProtocol(action.id, action.updates)
        this.emitChange();
        break;
      case ProtocolActions.DELETE_PROTOCOL:
        _deleteProtocol(action.id);
        this.emitChange();
        break;
      case ProtocolActions.FETCH_PROTOCOLS:
        _fetchProtocols(action.page);
        this.emitChange();
        break;
    }
  }

  fetchProtocols() {
    // TODO API call
  }
}

export default new ProtocolStore();
