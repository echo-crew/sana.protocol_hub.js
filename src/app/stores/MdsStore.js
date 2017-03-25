import AppDispatcher from '../dispatcher/AppDispatcher';
import MdsActions from '../actions/MdsActions';
import OrganizationActions from '../actions/MdsActions';
import StoreActions from '../actions/StoreActions';
import request from 'superagent-bluebird-promise';
import { EventEmitter } from 'events';

let _mds = [{
  id: 1,
  owner: '',
  name: 'mds 1',
  link: 'http://mds1.com/api',
  synced_protocols: [],
}];

function _clearMds() {
  _mds = [];
}

function _addMds(mds) {
  _mds.push(mds);
}

function _updateMds(id, updates) {
  let i = _mds.findIndex((mds) => {
    return mds.id === id;
  });
  Object.assign(_mds[id], updates);
}

function _removeMds(id) {
  let i = _mds.findIndex((mds) => {
    return mds.id === id;
  });
  _mds.splice(i, 1);
}

function _addSyncedProtocol(mdsId, protocol) {
  const mds = mdss.find(({ id }) => mdsId === id);
  mds.protocols.push(protocol);
}

function _removeSyncedProtocol(mdsId, protocolId) {
  const mds = mdss.find(({ id }) => mdsId === id);
  const i = mds.protocols.findIndex(({ id }) => protocolId === id);
  mds.protocols.splice(i, 1);
}

class MdsStore extends EventEmitter {
  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));
  }

  getAll() {
    return _mds;
  }

  get(id) {
    let i = _mds.findIndex((mds) => {
      return mds.id === id;
    });
    return _mds[i];
  }

  emitChange() {
    this.emit(StoreActions.CHANGE_EVENT);
  }

  addChangeListener(cb) {
    this.on(StoreActions.CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(StoreActions.CHANGE_EVENT, cb);
  }

  dispatcherCallback(action) {
    switch(action.type) {
      case OrganizationActions.SWITCH_ACTIVE_ORG:
        _clearMds();
        this.emitChange();
        break;

      case MdsActions.CREATE_MDS:
        _addMds(action.mds);
        this.emitChange();
        break;
      case MdsActions.UPDATE_MDS:
        _updateMds(action.id, action.updates)
        this.emitChange();
        break;
      case MdsActions.DELETE_MDS:
        _deleteMds(action.id);
        this.emitChange();
        break;
      case MdsActions.FETCH_MDS:
        _fetchMds(action.page);
        this.emitChange();
        break;

      case MdsActions.FETCH_MEMBERS:
        _updateMds(action.id, { protocols: action.protocols });
        this.emitChange();
        break;
      case MdsActions.ADD_MEMBER:
        _updateMds(action.id, {
          protocols: [...this.get(action.id).protocols, action.protocol],
        });
        this.emitChange();
        break;
      case MdsActions.REMOVE_MEMBER:
        _removeSyncedProtocol(action.mdsId, action.protocolId);
        this.emitChange();
        break;
    }
  }

  listMds(organizationId) {
    return request.get(`/organizations/${organizationId}/mds_links/`)
      .then(({ data }) => MdsActionCreator.listMds(data));
  }

  fetchMds(organizationId, mdsId) {
    return request.get(`/organizations/${organizationId}/mds_links/${mdsId}`)
      .then(({ data }) => MdsActionCreator.fetchMds(data));
  }

  updateMds(organizationId, mdsId, name, url) {
    return request.put(`/organizations/${organizationId}/mds_links/${mdsId}`)
      .send({ name, url })
      .then(({ data }) => MdsActionCreator.updateMds(mdsId, data));
  }

  createMds(organizationId, name, url) {
    return request.post(`/organizations/${organizationId}/mds_links/`)
      .send({ name, url })
      .then(({ data }) => MdsActionCreator.createMds(data));
  }

  removeMds(organizationId, mdsId) {
    return request.delete(`/organizations/${organizationId}/mds_links/${mdsId}`)
      .then(() => MdsActionCreator.removeMds(mdsId));
  }

  fetchSyncedProtocols(organizationId, id) {
    return request.get(`/organizations/${organizationId}/mds_links/${id}/protocols/`)
      .then(({ data }) => MdsActionCreator.fetchSyncedProtocols(id, data));
  }

  createSyncedProtocol(organizationId, mdsId, protocolId) {
    return request.post(`/organizations/${organizationId}/mds_links/${id}/protocols/`)
      .send({ protocolId })
      .then(({ data }) => MdsActionCreator.createSyncedProtocol(id, data));
  }

  removeSyncedProtocol(organizationId, mdsId, protocolId) {
    return request.delete(`/organizations/${organizationId}/mds_links/${id}/protocols/${protocolId}`)
      .then(({ data }) => MdsActionCreator.removeSyncedProtocol(id, protocolId));
  }
}

export default new MdsStore();
