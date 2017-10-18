"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('kue-ui-client/app', ['exports', 'ember', 'kue-ui-client/resolver', 'ember-load-initializers', 'kue-ui-client/config/environment'], function (exports, _ember, _kueUiClientResolver, _emberLoadInitializers, _kueUiClientConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _kueUiClientConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _kueUiClientConfigEnvironment['default'].podModulePrefix,
    Resolver: _kueUiClientResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _kueUiClientConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('kue-ui-client/application/adapter', ['exports', 'ember-simple-auth/mixins/data-adapter-mixin', 'ember-data', 'ember', 'kue-ui-client/config/environment'], function (exports, _emberSimpleAuthMixinsDataAdapterMixin, _emberData, _ember, _kueUiClientConfigEnvironment) {
  var get = _ember['default'].get;
  exports['default'] = _emberData['default'].JSONAPIAdapter.extend(_emberSimpleAuthMixinsDataAdapterMixin['default'], {
    host: (get(window, '__kueUiExpress.apiURL') || _kueUiClientConfigEnvironment['default'].apiURL) + '/v2'
  });
});
define('kue-ui-client/application/controller', ['exports', 'ember', 'lodash', 'kue-ui-client/config/environment'], function (exports, _ember, _lodash, _kueUiClientConfigEnvironment) {
    exports['default'] = _ember['default'].Controller.extend({
        indexController: _ember['default'].inject.controller('jobs/index'),

        jobId: '',
        jobs: _ember['default'].inject.service(),
        notifications: _ember['default'].inject.service('notification-messages'),

        initStatsRefresh: _ember['default'].on('init', function () {
            var self = this;
            self.updateStats(); // first call

            if (!isNaN(_kueUiClientConfigEnvironment['default'].updateInterval)) {
                setInterval(function () {
                    return self.updateStats();
                }, _kueUiClientConfigEnvironment['default'].updateInterval); // every Xs
            }
        }),

        updateStats: function updateStats() {
            var self = this;
            this.get('jobs').stats().then(function (data) {
                self.set('stats', data);
                return self.getCountBreakdowns();
            }).then(function (res) {
                self.set('breakdowns', res);
                self.get('indexController').set('breakdowns', res);
            });
        },

        getAllStates: function getAllStates(type) {
            var _this = this;

            var promises = this.get('jobs.STATES').map(function (state) {
                var query = { type: type, state: state };
                return _this.get('jobs').stats(query).then(function (res) {
                    return _lodash['default'].extend(res, query);
                });
            });
            return _ember['default'].RSVP.Promise.all(promises);
        },

        getCountBreakdowns: function getCountBreakdowns() {
            var _this2 = this;

            return this.get('jobs').stats().then(function (stats) {
                return _this2.get('indexController').set('stats', stats);
            }).then(function () {
                return _this2.get('jobs').types();
            }).then(function (types) {
                var promises = types.map(function (type) {
                    return _this2.getAllStates(type);
                });
                return _ember['default'].RSVP.Promise.all(promises).then(_lodash['default'].flatten);
            });
        },

        actions: {
            goToTypeRoute: function goToTypeRoute(obj) {
                this.transitionToRoute('jobs.type', obj.type, {
                    queryParams: {
                        state: obj.state || 'active'
                    }
                });
            },
            closeAddDialog: function closeAddDialog() {
                this.set('newJobBody', '');
                this.set('showAddDialog', false);
            },
            createJob: function createJob() {
                var _this3 = this;

                this.get('jobs').create(this.get('newJobBody')).then(function () {
                    _this3.get('notifications').success('Job Created Successfully', {
                        autoClear: true
                    });
                    _this3.set('newJobBody', '');
                    _this3.set('showAddDialog', false);
                }, function (err) {
                    console.log(err);
                    _this3.get('notifications').error('Error creating job: ' + err.messsage);
                });
            }
        }

    });
});
define('kue-ui-client/application/route', ['exports', 'ember-simple-auth/mixins/application-route-mixin', 'ember'], function (exports, _emberSimpleAuthMixinsApplicationRouteMixin, _ember) {
  exports['default'] = _ember['default'].Route.extend(_emberSimpleAuthMixinsApplicationRouteMixin['default'], {
    actions: {
      goToJob: function goToJob(job) {
        this.transitionTo('jobs.show', job);
      }
    }
  });
});
define("kue-ui-client/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "wjdSJwL+", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"notification-container\"]],false],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"menu\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"logo\"],[\"flush-element\"],[\"block\",[\"link-to\"],[\"jobs.index\"],null,9],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-search\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\",\"placeholder\",\"class\",\"enter\"],[[\"get\",[\"jobId\"]],\"Find Job By Id\",\"input\",[\"helper\",[\"transition-to\"],[\"jobs.show\",[\"get\",[\"jobId\"]]],null]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"menu-tabs\"],null,[[\"stats\",\"breakdowns\",\"stateParam\",\"typeParam\",\"action\"],[[\"get\",[\"stats\"]],[\"get\",[\"breakdowns\"]],[\"get\",[\"state\"]],[\"get\",[\"type\"]],\"goToTypeRoute\"]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"showAddDialog\"]]],null,8],[\"text\",\"\\n\"],[\"block\",[\"paper-button\"],null,[[\"class\",\"raised\",\"primary\",\"fab\",\"onClick\"],[\"bottom-right\",true,true,true,[\"helper\",[\"toggle\"],[\"showAddDialog\",[\"get\",[null]]],null]]],0],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"paper-icon\"],[\"add\"],null],false]],\"locals\":[]},{\"statements\":[[\"text\",\"Create\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"flex\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"block\",[\"paper-button\"],null,[[\"primary\",\"onClick\"],[true,[\"helper\",[\"action\"],[[\"get\",[null]],\"createJob\"],null]]],1],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"paper-input\"],null,[[\"textarea\",\"block\",\"label\",\"value\",\"passThru\",\"onChange\"],[true,true,\"New Job Body\",[\"get\",[\"newJobBody\"]],[\"helper\",[\"hash\"],null,[[\"rows\",\"maxRows\"],[5,5]]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"newJobBody\"]]],null]],null]]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"append\",[\"helper\",[\"paper-icon\"],null,[[\"icon\"],[\"close\"]]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Create Job\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"flex\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"block\",[\"paper-button\"],null,[[\"iconButton\",\"onClick\"],[true,\"closeAddDialog\"]],4],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"paper-toolbar-tools\"],null,null,5]],\"locals\":[]},{\"statements\":[[\"block\",[\"paper-toolbar\"],null,null,6],[\"block\",[\"paper-dialog-content\"],null,null,3],[\"text\",\"\\n\"],[\"block\",[\"paper-dialog-actions\"],null,[[\"class\"],[\"layout-row\"]],2],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"paper-dialog\"],null,[[\"class\",\"clickOutsideToClose\",\"onClose\"],[\"new-job-dialog\",true,\"closeAddDialog\"]],7]],\"locals\":[]},{\"statements\":[[\"text\",\" kue \"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/application/template.hbs" } });
});
define('kue-ui-client/authenticators/authmaker', ['exports', 'authmaker-ember-simple-auth/authenticator'], function (exports, _authmakerEmberSimpleAuthAuthenticator) {
  exports['default'] = _authmakerEmberSimpleAuthAuthenticator['default'].extend();
});
define('kue-ui-client/authorizers/application', ['exports', 'authmaker-ember-simple-auth/authorizer'], function (exports, _authmakerEmberSimpleAuthAuthorizer) {
  exports['default'] = _authmakerEmberSimpleAuthAuthorizer['default'].extend();
});
define('kue-ui-client/components/basic-dropdown', ['exports', 'ember-basic-dropdown/components/basic-dropdown'], function (exports, _emberBasicDropdownComponentsBasicDropdown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdown['default'];
    }
  });
});
define('kue-ui-client/components/basic-dropdown/content', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content'], function (exports, _emberBasicDropdownComponentsBasicDropdownContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownContent['default'];
    }
  });
});
define('kue-ui-client/components/basic-dropdown/trigger', ['exports', 'ember-basic-dropdown/components/basic-dropdown/trigger'], function (exports, _emberBasicDropdownComponentsBasicDropdownTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberBasicDropdownComponentsBasicDropdownTrigger['default'];
    }
  });
});
define('kue-ui-client/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('kue-ui-client/components/high-charts', ['exports', 'ember-highcharts/components/high-charts'], function (exports, _emberHighchartsComponentsHighCharts) {
  exports['default'] = _emberHighchartsComponentsHighCharts['default'];
});
define('kue-ui-client/components/job-detail/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        selections: _ember['default'].computed.alias('jobs.STATES'),
        jobs: _ember['default'].inject.service(),

        setup: _ember['default'].on('init', function () {
            this.set('job.selected', this.get('job.state'));
        }).observes('job.id'),

        selectedStateDidChange: _ember['default'].observer('job.selected', function () {
            if (_ember['default'].isEmpty(this.get('job.state'))) {
                return;
            }

            if (this.get('job.state') !== this.get('job.selected')) {
                this.set('job.state', this.get('job.selected'));

                this.get('jobs').updateState(this.get('job.id'), this.get('job.state'));
            }
        }),

        actions: {

            goToJob: function goToJob(job) {
                this.sendAction('action', job);
            },

            removeJob: function removeJob(job) {
                this.sendAction('removeAction', job);
            }
        }
    });
});
define("kue-ui-client/components/job-detail/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+85t0tTl", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"job-detail\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"title\"],[\"flush-element\"],[\"text\",\"\\n        Job #\"],[\"append\",[\"unknown\",[\"job\",\"id\"]],false],[\"text\",\"\\n\"],[\"block\",[\"x-select\"],null,[[\"value\"],[[\"get\",[\"job\",\"selected\"]]]],3],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn-more\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"goToJob\",[\"get\",[\"job\"]]]],[\"flush-element\"],[\"text\",\"More\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"console\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"pre\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"json-pretty\"],null,[[\"data\"],[[\"get\",[\"job\"]]]]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"job\",\"error\"]]],null,0],[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn-remove\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"removeJob\",[\"get\",[\"job\"]]]],[\"flush-element\"],[\"text\",\"Delete\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"error\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"title\"],[\"flush-element\"],[\"text\",\"Error\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"error-output\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"format-error\"],[[\"get\",[\"job\",\"error\"]]],null],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"append\",[\"get\",[\"selection\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"block\",[\"x-option\"],null,[[\"value\"],[[\"get\",[\"selection\"]]]],1],[\"text\",\"\\n\"]],\"locals\":[\"selection\"]},{\"statements\":[[\"block\",[\"each\"],[[\"get\",[\"selections\"]]],null,2]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/job-detail/template.hbs" } });
});
define('kue-ui-client/components/jobs-filter/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        selections: _ember['default'].computed.alias('jobs.STATES'),
        jobs: _ember['default'].inject.service(),

        selectedState: null,

        sorts: _ember['default'].A(['created_at', 'updated_at']),
        selectedSort: null

    });
});
define("kue-ui-client/components/jobs-filter/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "2WUqddbh", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"top-bar\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"type\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"type\"]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"gt\"],[\"flush-element\"],[\"text\",\">\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"dropdown\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"x-select\"],null,[[\"value\"],[[\"get\",[\"selectedState\"]]]],2],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"jobs-paging\"],null,[[\"page\"],[[\"get\",[\"page\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"append\",[\"get\",[\"selection\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"block\",[\"x-option\"],null,[[\"value\"],[[\"get\",[\"selection\"]]]],0],[\"text\",\"\\n\"]],\"locals\":[\"selection\"]},{\"statements\":[[\"block\",[\"each\"],[[\"get\",[\"selections\"]]],null,1]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/jobs-filter/template.hbs" } });
});
define('kue-ui-client/components/jobs-paging/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        page: 1,

        actions: {
            next: function next() {
                this.incrementProperty('page');
            },

            previous: function previous() {
                if (this.get('page') > 1) {
                    this.decrementProperty('page');
                }
            }
        }

    });
});
define("kue-ui-client/components/jobs-paging/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "IJCrXhEO", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"paging\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"previous\"]],[\"flush-element\"],[\"text\",\"← Previous\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"next\"]],[\"flush-element\"],[\"text\",\"Next →\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/jobs-paging/template.hbs" } });
});
define('kue-ui-client/components/jobs-table/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        selectedJob: null,
        hasSelectedJob: _ember['default'].computed.gt('selectedJob.id.length', 0),
        order: null,

        actions: {
            showDetail: function showDetail(job) {
                this.set('selectedJob', job);
                this.get('jobs').setEach('active', false);
                job.set('active', true);
            },

            toggleArrow: function toggleArrow() {
                this.sendAction('orderAction');
            }
        }
    });
});
define("kue-ui-client/components/jobs-table/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "2FIXwX+c", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"table jobs\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"heading\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col col-id\"],[\"flush-element\"],[\"text\",\"\\n        id\\n        \"],[\"append\",[\"helper\",[\"toggle-arrow\"],null,[[\"value\",\"action\"],[[\"get\",[\"order\"]],\"toggleArrow\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"text\",\"type\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"text\",\"state\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"text\",\"created_at\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"text\",\"updated_at\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"text\",\"attempts\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"jobs\"]]],null,1,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"empty\"],[\"flush-element\"],[\"text\",\"No results\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"table-row job \",[\"helper\",[\"if\"],[[\"get\",[\"job\",\"active\"]],\"active\"],null]]]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showDetail\",[\"get\",[\"job\"]]]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"job\",\"id\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"job\",\"type\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"job\",\"state\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"job\",\"created_at\"]],\"DD/MM/YYYY HH:mm:ss\",\"x\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"job\",\"updated_at\"]],\"DD/MM/YYYY HH:mm:ss\",\"x\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"job\",\"attempts\",\"made\"]],false],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"job\",\"attempts\",\"remaining\"]],false],[\"text\",\") \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"job\"]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/jobs-table/template.hbs" } });
});
define('kue-ui-client/components/json-pretty/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        printJSON: function printJSON() {
            var data = this.get('data');
            _ember['default'].$("#json").JSONView(JSON.stringify(data));
        },

        didInsertElement: function didInsertElement() {
            this.printJSON();
        },

        jobDidChange: _ember['default'].observer('data', function () {
            this.printJSON();
        })
    });
});
define("kue-ui-client/components/json-pretty/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "soFARYEB", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"json\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/json-pretty/template.hbs" } });
});
define('kue-ui-client/components/menu-tabs/component', ['exports', 'ember', 'lodash'], function (exports, _ember, _lodash) {
    exports['default'] = _ember['default'].Component.extend({
        breakdowns: _ember['default'].A([]),
        selected: null,
        items: null,
        menuTree: [],

        jobs: _ember['default'].inject.service(),

        setScroll: _ember['default'].on('didInsertElement', function () {
            _ember['default'].$('.menu').perfectScrollbar();
        }),

        paramsDidChange: _ember['default'].observer('typeParam', 'stateParam', 'menuTree', 'menuTree.[]', function () {
            this.updateActiveState();
        }),

        jobStates: _ember['default'].computed('stats', 'stats.[]', function () {
            var states = _ember['default'].A(this.get('jobs.STATES'));
            var stats = this.get('stats');

            if (_ember['default'].isEmpty(stats)) {
                return;
            }

            return states.map(function (state) {
                return {
                    state: state,
                    count: stats[state + 'Count']
                };
            });
        }),

        breakdownsDidLoad: _ember['default'].observer('breakdowns', 'breakdowns.[]', function () {
            var breakdowns = this.get('breakdowns');
            var byType = _lodash['default'].groupBy(breakdowns, 'type');
            var menu = [];

            for (var type in byType) {
                var subItems = byType[type];
                menu.push({
                    type: type,
                    count: this.computeTotal(subItems),
                    subItems: subItems
                });
            }
            this.set('menuTree', menu);
        }),

        computeTotal: function computeTotal(arr) {
            return arr.reduce(function (acc, obj) {
                return obj.count + acc;
            }, 0);
        },

        updateActiveState: function updateActiveState() {
            var selected = {
                state: this.get('stateParam'),
                type: this.get('typeParam')
            };
            var items = this.get('menuTree');

            items.forEach(function (item) {
                _ember['default'].set(item, 'active', item.type === selected.type);
                item.subItems.forEach(function (sub) {
                    _ember['default'].set(sub, 'active', sub.state === selected.state && sub.type === selected.type);
                    _ember['default'].set(sub, 'hide', !item.active);
                });
                return item;
            });

            this.set('items', items);
        },

        actions: {
            goToItem: function goToItem(item) {
                this.sendAction("action", item);
            }

        }
    });
});
define("kue-ui-client/components/menu-tabs/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "JnZz3sAL", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"menu-list\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"jobStates\"]]],null,3],[\"block\",[\"each\"],[[\"get\",[\"items\"]]],null,1],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"         \"],[\"open-element\",\"a\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"sub-item \",[\"helper\",[\"if\"],[[\"get\",[\"subItem\",\"active\"]],\"active\"],null],\" \",[\"helper\",[\"if\"],[[\"get\",[\"subItem\",\"hide\"]],\"hide\"],null]]]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"goToItem\",[\"get\",[\"subItem\"]]]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"unknown\",[\"subItem\",\"state\"]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sub-item-count\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"subItem\",\"count\"]],false],[\"close-element\"],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"subItem\"]},{\"statements\":[[\"text\",\"\\n    \"],[\"open-element\",\"a\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"item \",[\"helper\",[\"if\"],[[\"get\",[\"item\",\"active\"]],\"active\"],null]]]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"goToItem\",[\"get\",[\"item\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"item\",\"type\"]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"item-count\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"item\",\"count\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"item\",\"subItems\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"unknown\",[\"s\",\"state\"]],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"item-count\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"s\",\"count\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"jobs.state\",[\"get\",[\"s\",\"state\"]]],[[\"class\"],[\"item\"]],2]],\"locals\":[\"s\"]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/menu-tabs/template.hbs" } });
});
define('kue-ui-client/components/notification-container', ['exports', 'ember-cli-notifications/components/notification-container'], function (exports, _emberCliNotificationsComponentsNotificationContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliNotificationsComponentsNotificationContainer['default'];
    }
  });
});
define('kue-ui-client/components/notification-message', ['exports', 'ember-cli-notifications/components/notification-message', 'kue-ui-client/config/environment'], function (exports, _emberCliNotificationsComponentsNotificationMessage, _kueUiClientConfigEnvironment) {

  var config = _kueUiClientConfigEnvironment['default']['ember-cli-notifications'] || {};

  exports['default'] = _emberCliNotificationsComponentsNotificationMessage['default'].extend({
    icons: config.icons || 'font-awesome'
  });
});
define('kue-ui-client/components/paper-autocomplete-content', ['exports', 'ember-paper/components/paper-autocomplete-content'], function (exports, _emberPaperComponentsPaperAutocompleteContent) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteContent['default'];
});
define('kue-ui-client/components/paper-autocomplete-dropdown', ['exports', 'ember-paper/components/paper-autocomplete-dropdown'], function (exports, _emberPaperComponentsPaperAutocompleteDropdown) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteDropdown['default'];
});
define('kue-ui-client/components/paper-autocomplete-highlight', ['exports', 'ember-paper/components/paper-autocomplete-highlight'], function (exports, _emberPaperComponentsPaperAutocompleteHighlight) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperAutocompleteHighlight['default'];
    }
  });
});
define('kue-ui-client/components/paper-autocomplete-options', ['exports', 'ember-paper/components/paper-autocomplete-options'], function (exports, _emberPaperComponentsPaperAutocompleteOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperAutocompleteOptions['default'];
    }
  });
});
define('kue-ui-client/components/paper-autocomplete-trigger-container', ['exports', 'ember-paper/components/paper-autocomplete-trigger-container'], function (exports, _emberPaperComponentsPaperAutocompleteTriggerContainer) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteTriggerContainer['default'];
});
define('kue-ui-client/components/paper-autocomplete-trigger', ['exports', 'ember-paper/components/paper-autocomplete-trigger'], function (exports, _emberPaperComponentsPaperAutocompleteTrigger) {
  exports['default'] = _emberPaperComponentsPaperAutocompleteTrigger['default'];
});
define('kue-ui-client/components/paper-autocomplete', ['exports', 'ember-paper/components/paper-autocomplete'], function (exports, _emberPaperComponentsPaperAutocomplete) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperAutocomplete['default'];
    }
  });
});
define('kue-ui-client/components/paper-backdrop', ['exports', 'ember-paper/components/paper-backdrop'], function (exports, _emberPaperComponentsPaperBackdrop) {
  exports['default'] = _emberPaperComponentsPaperBackdrop['default'];
});
define('kue-ui-client/components/paper-button', ['exports', 'ember-paper/components/paper-button'], function (exports, _emberPaperComponentsPaperButton) {
  exports['default'] = _emberPaperComponentsPaperButton['default'];
});
define('kue-ui-client/components/paper-card-actions', ['exports', 'ember-paper/components/paper-card-actions'], function (exports, _emberPaperComponentsPaperCardActions) {
  exports['default'] = _emberPaperComponentsPaperCardActions['default'];
});
define('kue-ui-client/components/paper-card-avatar', ['exports', 'ember-paper/components/paper-card-avatar'], function (exports, _emberPaperComponentsPaperCardAvatar) {
  exports['default'] = _emberPaperComponentsPaperCardAvatar['default'];
});
define('kue-ui-client/components/paper-card-content', ['exports', 'ember-paper/components/paper-card-content'], function (exports, _emberPaperComponentsPaperCardContent) {
  exports['default'] = _emberPaperComponentsPaperCardContent['default'];
});
define('kue-ui-client/components/paper-card-header-headline', ['exports', 'ember-paper/components/paper-card-header-headline'], function (exports, _emberPaperComponentsPaperCardHeaderHeadline) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderHeadline['default'];
});
define('kue-ui-client/components/paper-card-header-subhead', ['exports', 'ember-paper/components/paper-card-header-subhead'], function (exports, _emberPaperComponentsPaperCardHeaderSubhead) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderSubhead['default'];
});
define('kue-ui-client/components/paper-card-header-text', ['exports', 'ember-paper/components/paper-card-header-text'], function (exports, _emberPaperComponentsPaperCardHeaderText) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderText['default'];
});
define('kue-ui-client/components/paper-card-header-title', ['exports', 'ember-paper/components/paper-card-header-title'], function (exports, _emberPaperComponentsPaperCardHeaderTitle) {
  exports['default'] = _emberPaperComponentsPaperCardHeaderTitle['default'];
});
define('kue-ui-client/components/paper-card-header', ['exports', 'ember-paper/components/paper-card-header'], function (exports, _emberPaperComponentsPaperCardHeader) {
  exports['default'] = _emberPaperComponentsPaperCardHeader['default'];
});
define('kue-ui-client/components/paper-card-icon-actions', ['exports', 'ember-paper/components/paper-card-icon-actions'], function (exports, _emberPaperComponentsPaperCardIconActions) {
  exports['default'] = _emberPaperComponentsPaperCardIconActions['default'];
});
define('kue-ui-client/components/paper-card-image', ['exports', 'ember-paper/components/paper-card-image'], function (exports, _emberPaperComponentsPaperCardImage) {
  exports['default'] = _emberPaperComponentsPaperCardImage['default'];
});
define('kue-ui-client/components/paper-card-media', ['exports', 'ember-paper/components/paper-card-media'], function (exports, _emberPaperComponentsPaperCardMedia) {
  exports['default'] = _emberPaperComponentsPaperCardMedia['default'];
});
define('kue-ui-client/components/paper-card-title-media', ['exports', 'ember-paper/components/paper-card-title-media'], function (exports, _emberPaperComponentsPaperCardTitleMedia) {
  exports['default'] = _emberPaperComponentsPaperCardTitleMedia['default'];
});
define('kue-ui-client/components/paper-card-title-text', ['exports', 'ember-paper/components/paper-card-title-text'], function (exports, _emberPaperComponentsPaperCardTitleText) {
  exports['default'] = _emberPaperComponentsPaperCardTitleText['default'];
});
define('kue-ui-client/components/paper-card-title', ['exports', 'ember-paper/components/paper-card-title'], function (exports, _emberPaperComponentsPaperCardTitle) {
  exports['default'] = _emberPaperComponentsPaperCardTitle['default'];
});
define('kue-ui-client/components/paper-card', ['exports', 'ember-paper/components/paper-card'], function (exports, _emberPaperComponentsPaperCard) {
  exports['default'] = _emberPaperComponentsPaperCard['default'];
});
define('kue-ui-client/components/paper-checkbox', ['exports', 'ember-paper/components/paper-checkbox'], function (exports, _emberPaperComponentsPaperCheckbox) {
  exports['default'] = _emberPaperComponentsPaperCheckbox['default'];
});
define('kue-ui-client/components/paper-chips', ['exports', 'ember-paper/components/paper-chips'], function (exports, _emberPaperComponentsPaperChips) {
  exports['default'] = _emberPaperComponentsPaperChips['default'];
});
define('kue-ui-client/components/paper-contact-chips', ['exports', 'ember-paper/components/paper-contact-chips'], function (exports, _emberPaperComponentsPaperContactChips) {
  exports['default'] = _emberPaperComponentsPaperContactChips['default'];
});
define('kue-ui-client/components/paper-content', ['exports', 'ember-paper/components/paper-content'], function (exports, _emberPaperComponentsPaperContent) {
  exports['default'] = _emberPaperComponentsPaperContent['default'];
});
define('kue-ui-client/components/paper-dialog-actions', ['exports', 'ember-paper/components/paper-dialog-actions'], function (exports, _emberPaperComponentsPaperDialogActions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogActions['default'];
    }
  });
});
define('kue-ui-client/components/paper-dialog-container', ['exports', 'ember-paper/components/paper-dialog-container'], function (exports, _emberPaperComponentsPaperDialogContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogContainer['default'];
    }
  });
});
define('kue-ui-client/components/paper-dialog-content', ['exports', 'ember-paper/components/paper-dialog-content'], function (exports, _emberPaperComponentsPaperDialogContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogContent['default'];
    }
  });
});
define('kue-ui-client/components/paper-dialog-inner', ['exports', 'ember-paper/components/paper-dialog-inner'], function (exports, _emberPaperComponentsPaperDialogInner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialogInner['default'];
    }
  });
});
define('kue-ui-client/components/paper-dialog', ['exports', 'ember-paper/components/paper-dialog'], function (exports, _emberPaperComponentsPaperDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperDialog['default'];
    }
  });
});
define('kue-ui-client/components/paper-divider', ['exports', 'ember-paper/components/paper-divider'], function (exports, _emberPaperComponentsPaperDivider) {
  exports['default'] = _emberPaperComponentsPaperDivider['default'];
});
define('kue-ui-client/components/paper-form', ['exports', 'ember-paper/components/paper-form'], function (exports, _emberPaperComponentsPaperForm) {
  exports['default'] = _emberPaperComponentsPaperForm['default'];
});
define('kue-ui-client/components/paper-grid-list', ['exports', 'ember-paper/components/paper-grid-list'], function (exports, _emberPaperComponentsPaperGridList) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperGridList['default'];
    }
  });
});
define('kue-ui-client/components/paper-grid-tile-footer', ['exports', 'ember-paper/components/paper-grid-tile-footer'], function (exports, _emberPaperComponentsPaperGridTileFooter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperGridTileFooter['default'];
    }
  });
});
define('kue-ui-client/components/paper-grid-tile', ['exports', 'ember-paper/components/paper-grid-tile'], function (exports, _emberPaperComponentsPaperGridTile) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperGridTile['default'];
    }
  });
});
define('kue-ui-client/components/paper-icon', ['exports', 'ember-paper/components/paper-icon'], function (exports, _emberPaperComponentsPaperIcon) {
  exports['default'] = _emberPaperComponentsPaperIcon['default'];
});
define('kue-ui-client/components/paper-input', ['exports', 'ember-paper/components/paper-input'], function (exports, _emberPaperComponentsPaperInput) {
  exports['default'] = _emberPaperComponentsPaperInput['default'];
});
define('kue-ui-client/components/paper-item', ['exports', 'ember-paper/components/paper-item'], function (exports, _emberPaperComponentsPaperItem) {
  exports['default'] = _emberPaperComponentsPaperItem['default'];
});
define('kue-ui-client/components/paper-list', ['exports', 'ember-paper/components/paper-list'], function (exports, _emberPaperComponentsPaperList) {
  exports['default'] = _emberPaperComponentsPaperList['default'];
});
define('kue-ui-client/components/paper-menu-content-inner', ['exports', 'ember-paper/components/paper-menu-content-inner'], function (exports, _emberPaperComponentsPaperMenuContentInner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenuContentInner['default'];
    }
  });
});
define('kue-ui-client/components/paper-menu-content', ['exports', 'ember-paper/components/paper-menu-content'], function (exports, _emberPaperComponentsPaperMenuContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenuContent['default'];
    }
  });
});
define('kue-ui-client/components/paper-menu-item', ['exports', 'ember-paper/components/paper-menu-item'], function (exports, _emberPaperComponentsPaperMenuItem) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenuItem['default'];
    }
  });
});
define('kue-ui-client/components/paper-menu', ['exports', 'ember-paper/components/paper-menu'], function (exports, _emberPaperComponentsPaperMenu) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperMenu['default'];
    }
  });
});
define('kue-ui-client/components/paper-optgroup', ['exports', 'ember-paper/components/paper-optgroup'], function (exports, _emberPaperComponentsPaperOptgroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperOptgroup['default'];
    }
  });
});
define('kue-ui-client/components/paper-option', ['exports', 'ember-paper/components/paper-option'], function (exports, _emberPaperComponentsPaperOption) {
  exports['default'] = _emberPaperComponentsPaperOption['default'];
});
define('kue-ui-client/components/paper-progress-circular', ['exports', 'ember-paper/components/paper-progress-circular'], function (exports, _emberPaperComponentsPaperProgressCircular) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperProgressCircular['default'];
    }
  });
});
define('kue-ui-client/components/paper-progress-linear', ['exports', 'ember-paper/components/paper-progress-linear'], function (exports, _emberPaperComponentsPaperProgressLinear) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperProgressLinear['default'];
    }
  });
});
define('kue-ui-client/components/paper-radio-group', ['exports', 'ember-paper/components/paper-radio-group'], function (exports, _emberPaperComponentsPaperRadioGroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperRadioGroup['default'];
    }
  });
});
define('kue-ui-client/components/paper-radio-proxiable', ['exports', 'ember-paper/components/paper-radio-proxiable'], function (exports, _emberPaperComponentsPaperRadioProxiable) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperRadioProxiable['default'];
    }
  });
});
define('kue-ui-client/components/paper-radio', ['exports', 'ember-paper/components/paper-radio'], function (exports, _emberPaperComponentsPaperRadio) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperRadio['default'];
    }
  });
});
define('kue-ui-client/components/paper-reset-button', ['exports', 'ember-paper/components/paper-reset-button'], function (exports, _emberPaperComponentsPaperResetButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperResetButton['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-content', ['exports', 'ember-paper/components/paper-select-content'], function (exports, _emberPaperComponentsPaperSelectContent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectContent['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-header', ['exports', 'ember-paper/components/paper-select-header'], function (exports, _emberPaperComponentsPaperSelectHeader) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectHeader['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-menu-inner', ['exports', 'ember-paper/components/paper-select-menu-inner'], function (exports, _emberPaperComponentsPaperSelectMenuInner) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectMenuInner['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-menu-trigger', ['exports', 'ember-paper/components/paper-select-menu-trigger'], function (exports, _emberPaperComponentsPaperSelectMenuTrigger) {
  exports['default'] = _emberPaperComponentsPaperSelectMenuTrigger['default'];
});
define('kue-ui-client/components/paper-select-menu', ['exports', 'ember-paper/components/paper-select-menu'], function (exports, _emberPaperComponentsPaperSelectMenu) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectMenu['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-options', ['exports', 'ember-paper/components/paper-select-options'], function (exports, _emberPaperComponentsPaperSelectOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectOptions['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-search', ['exports', 'ember-paper/components/paper-select-search'], function (exports, _emberPaperComponentsPaperSelectSearch) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectSearch['default'];
    }
  });
});
define('kue-ui-client/components/paper-select-trigger', ['exports', 'ember-paper/components/paper-select-trigger'], function (exports, _emberPaperComponentsPaperSelectTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSelectTrigger['default'];
    }
  });
});
define('kue-ui-client/components/paper-select', ['exports', 'ember-paper/components/paper-select'], function (exports, _emberPaperComponentsPaperSelect) {
  exports['default'] = _emberPaperComponentsPaperSelect['default'];
});
define('kue-ui-client/components/paper-sidenav-container', ['exports', 'ember-paper/components/paper-sidenav-container'], function (exports, _emberPaperComponentsPaperSidenavContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperComponentsPaperSidenavContainer['default'];
    }
  });
});
define('kue-ui-client/components/paper-sidenav-inner', ['exports', 'ember-paper/components/paper-sidenav-inner'], function (exports, _emberPaperComponentsPaperSidenavInner) {
  exports['default'] = _emberPaperComponentsPaperSidenavInner['default'];
});
define('kue-ui-client/components/paper-sidenav-toggle', ['exports', 'ember-paper/components/paper-sidenav-toggle'], function (exports, _emberPaperComponentsPaperSidenavToggle) {
  exports['default'] = _emberPaperComponentsPaperSidenavToggle['default'];
});
define('kue-ui-client/components/paper-sidenav', ['exports', 'ember-paper/components/paper-sidenav'], function (exports, _emberPaperComponentsPaperSidenav) {
  exports['default'] = _emberPaperComponentsPaperSidenav['default'];
});
define('kue-ui-client/components/paper-slider', ['exports', 'ember-paper/components/paper-slider'], function (exports, _emberPaperComponentsPaperSlider) {
  exports['default'] = _emberPaperComponentsPaperSlider['default'];
});
define('kue-ui-client/components/paper-subheader', ['exports', 'ember-paper/components/paper-subheader'], function (exports, _emberPaperComponentsPaperSubheader) {
  exports['default'] = _emberPaperComponentsPaperSubheader['default'];
});
define('kue-ui-client/components/paper-switch', ['exports', 'ember-paper/components/paper-switch'], function (exports, _emberPaperComponentsPaperSwitch) {
  exports['default'] = _emberPaperComponentsPaperSwitch['default'];
});
define('kue-ui-client/components/paper-toolbar-tools', ['exports', 'ember-paper/components/paper-toolbar-tools'], function (exports, _emberPaperComponentsPaperToolbarTools) {
  exports['default'] = _emberPaperComponentsPaperToolbarTools['default'];
});
define('kue-ui-client/components/paper-toolbar', ['exports', 'ember-paper/components/paper-toolbar'], function (exports, _emberPaperComponentsPaperToolbar) {
  exports['default'] = _emberPaperComponentsPaperToolbar['default'];
});
define('kue-ui-client/components/paper-virtual-repeat-scroller', ['exports', 'ember-paper/components/paper-virtual-repeat-scroller'], function (exports, _emberPaperComponentsPaperVirtualRepeatScroller) {
  exports['default'] = _emberPaperComponentsPaperVirtualRepeatScroller['default'];
});
define('kue-ui-client/components/paper-virtual-repeat', ['exports', 'ember-paper/components/paper-virtual-repeat'], function (exports, _emberPaperComponentsPaperVirtualRepeat) {
  exports['default'] = _emberPaperComponentsPaperVirtualRepeat['default'];
});
define('kue-ui-client/components/power-select-multiple', ['exports', 'ember-power-select/components/power-select-multiple'], function (exports, _emberPowerSelectComponentsPowerSelectMultiple) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectMultiple['default'];
    }
  });
});
define('kue-ui-client/components/power-select-multiple/trigger', ['exports', 'ember-power-select/components/power-select-multiple/trigger'], function (exports, _emberPowerSelectComponentsPowerSelectMultipleTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectMultipleTrigger['default'];
    }
  });
});
define('kue-ui-client/components/power-select', ['exports', 'ember-power-select/components/power-select'], function (exports, _emberPowerSelectComponentsPowerSelect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelect['default'];
    }
  });
});
define('kue-ui-client/components/power-select/before-options', ['exports', 'ember-power-select/components/power-select/before-options'], function (exports, _emberPowerSelectComponentsPowerSelectBeforeOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectBeforeOptions['default'];
    }
  });
});
define('kue-ui-client/components/power-select/options', ['exports', 'ember-power-select/components/power-select/options'], function (exports, _emberPowerSelectComponentsPowerSelectOptions) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectOptions['default'];
    }
  });
});
define('kue-ui-client/components/power-select/search-message', ['exports', 'ember-power-select/components/power-select/search-message'], function (exports, _emberPowerSelectComponentsPowerSelectSearchMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectSearchMessage['default'];
    }
  });
});
define('kue-ui-client/components/power-select/trigger', ['exports', 'ember-power-select/components/power-select/trigger'], function (exports, _emberPowerSelectComponentsPowerSelectTrigger) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectComponentsPowerSelectTrigger['default'];
    }
  });
});
define('kue-ui-client/components/toggle-arrow/component', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        tagName: 'span',
        value: null,
        up: _ember['default'].computed.equal('value', 'asc'),

        click: function click() {
            this.sendAction('action');
        }
    });
});
define("kue-ui-client/components/toggle-arrow/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "lYsSpopx", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"up\"]]],null,1,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  ▼\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  ▲\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/components/toggle-arrow/template.hbs" } });
});
define('kue-ui-client/components/transition-group', ['exports', 'ember-css-transitions/components/transition-group'], function (exports, _emberCssTransitionsComponentsTransitionGroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCssTransitionsComponentsTransitionGroup['default'];
    }
  });
});
define('kue-ui-client/components/virtual-each', ['exports', 'virtual-each/components/virtual-each/component'], function (exports, _virtualEachComponentsVirtualEachComponent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _virtualEachComponentsVirtualEachComponent['default'];
    }
  });
});
define('kue-ui-client/components/x-option', ['exports', 'emberx-select/components/x-option'], function (exports, _emberxSelectComponentsXOption) {
  exports['default'] = _emberxSelectComponentsXOption['default'];
});
define('kue-ui-client/components/x-select', ['exports', 'emberx-select/components/x-select'], function (exports, _emberxSelectComponentsXSelect) {
  exports['default'] = _emberxSelectComponentsXSelect['default'];
});
define('kue-ui-client/helpers/-paper-underscore', ['exports', 'ember-paper/helpers/underscore'], function (exports, _emberPaperHelpersUnderscore) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperHelpersUnderscore['default'];
    }
  });
  Object.defineProperty(exports, 'underscore', {
    enumerable: true,
    get: function get() {
      return _emberPaperHelpersUnderscore.underscore;
    }
  });
});
define('kue-ui-client/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/app-version', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _kueUiClientConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('kue-ui-client/helpers/append', ['exports', 'ember-composable-helpers/helpers/append'], function (exports, _emberComposableHelpersHelpersAppend) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend['default'];
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersAppend.append;
    }
  });
});
define('kue-ui-client/helpers/array', ['exports', 'ember-composable-helpers/helpers/array'], function (exports, _emberComposableHelpersHelpersArray) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray['default'];
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersArray.array;
    }
  });
});
define('kue-ui-client/helpers/cancel-all', ['exports', 'ember', 'ember-concurrency/-helpers'], function (exports, _ember, _emberConcurrencyHelpers) {
  exports.cancelHelper = cancelHelper;

  function cancelHelper(args) {
    var cancelable = args[0];
    if (!cancelable || typeof cancelable.cancelAll !== 'function') {
      _ember['default'].assert('The first argument passed to the `cancel-all` helper should be a Task or TaskGroup (without quotes); you passed ' + cancelable, false);
    }

    return (0, _emberConcurrencyHelpers.taskHelperClosure)('cancelAll', args);
  }

  exports['default'] = _ember['default'].Helper.helper(cancelHelper);
});
define('kue-ui-client/helpers/chunk', ['exports', 'ember-composable-helpers/helpers/chunk'], function (exports, _emberComposableHelpersHelpersChunk) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk['default'];
    }
  });
  Object.defineProperty(exports, 'chunk', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersChunk.chunk;
    }
  });
});
define('kue-ui-client/helpers/compact', ['exports', 'ember-composable-helpers/helpers/compact'], function (exports, _emberComposableHelpersHelpersCompact) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact['default'];
    }
  });
  Object.defineProperty(exports, 'compact', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompact.compact;
    }
  });
});
define('kue-ui-client/helpers/compute', ['exports', 'ember-composable-helpers/helpers/compute'], function (exports, _emberComposableHelpersHelpersCompute) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute['default'];
    }
  });
  Object.defineProperty(exports, 'compute', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersCompute.compute;
    }
  });
});
define('kue-ui-client/helpers/contains', ['exports', 'ember-composable-helpers/helpers/contains'], function (exports, _emberComposableHelpersHelpersContains) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains['default'];
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersContains.contains;
    }
  });
});
define('kue-ui-client/helpers/dec', ['exports', 'ember-composable-helpers/helpers/dec'], function (exports, _emberComposableHelpersHelpersDec) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec['default'];
    }
  });
  Object.defineProperty(exports, 'dec', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDec.dec;
    }
  });
});
define('kue-ui-client/helpers/drop', ['exports', 'ember-composable-helpers/helpers/drop'], function (exports, _emberComposableHelpersHelpersDrop) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop['default'];
    }
  });
  Object.defineProperty(exports, 'drop', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersDrop.drop;
    }
  });
});
define('kue-ui-client/helpers/ember-power-select-is-group', ['exports', 'ember-power-select/helpers/ember-power-select-is-group'], function (exports, _emberPowerSelectHelpersEmberPowerSelectIsGroup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsGroup['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectIsGroup', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsGroup.emberPowerSelectIsGroup;
    }
  });
});
define('kue-ui-client/helpers/ember-power-select-is-selected', ['exports', 'ember-power-select/helpers/ember-power-select-is-selected'], function (exports, _emberPowerSelectHelpersEmberPowerSelectIsSelected) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsSelected['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectIsSelected', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectIsSelected.emberPowerSelectIsSelected;
    }
  });
});
define('kue-ui-client/helpers/ember-power-select-true-string-if-present', ['exports', 'ember-power-select/helpers/ember-power-select-true-string-if-present'], function (exports, _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent['default'];
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectTrueStringIfPresent', {
    enumerable: true,
    get: function get() {
      return _emberPowerSelectHelpersEmberPowerSelectTrueStringIfPresent.emberPowerSelectTrueStringIfPresent;
    }
  });
});
define('kue-ui-client/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/filter-by', ['exports', 'ember-composable-helpers/helpers/filter-by'], function (exports, _emberComposableHelpersHelpersFilterBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy['default'];
    }
  });
  Object.defineProperty(exports, 'filterBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilterBy.filterBy;
    }
  });
});
define('kue-ui-client/helpers/filter', ['exports', 'ember-composable-helpers/helpers/filter'], function (exports, _emberComposableHelpersHelpersFilter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter['default'];
    }
  });
  Object.defineProperty(exports, 'filter', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFilter.filter;
    }
  });
});
define('kue-ui-client/helpers/find-by', ['exports', 'ember-composable-helpers/helpers/find-by'], function (exports, _emberComposableHelpersHelpersFindBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy['default'];
    }
  });
  Object.defineProperty(exports, 'findBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFindBy.findBy;
    }
  });
});
define('kue-ui-client/helpers/flatten', ['exports', 'ember-composable-helpers/helpers/flatten'], function (exports, _emberComposableHelpersHelpersFlatten) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten['default'];
    }
  });
  Object.defineProperty(exports, 'flatten', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersFlatten.flatten;
    }
  });
});
define('kue-ui-client/helpers/format-error', ['exports', 'ember'], function (exports, _ember) {
  exports.formatError = formatError;

  function formatError(params /*, hash*/) {
    return params[0];
  }

  exports['default'] = _ember['default'].Helper.helper(formatError);
});
define('kue-ui-client/helpers/format-json', ['exports', 'ember'], function (exports, _ember) {
  exports.formatJson = formatJson;

  function formatJson(params /*, hash*/) {
    var str = JSON.stringify(params[0], undefined, 2);
    return str.replace(/ /g, '&nbsp').htmlSafe();
  }

  exports['default'] = _ember['default'].Helper.helper(formatJson);
});
define('kue-ui-client/helpers/group-by', ['exports', 'ember-composable-helpers/helpers/group-by'], function (exports, _emberComposableHelpersHelpersGroupBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy['default'];
    }
  });
  Object.defineProperty(exports, 'groupBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersGroupBy.groupBy;
    }
  });
});
define('kue-ui-client/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/has-next', ['exports', 'ember-composable-helpers/helpers/has-next'], function (exports, _emberComposableHelpersHelpersHasNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext['default'];
    }
  });
  Object.defineProperty(exports, 'hasNext', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasNext.hasNext;
    }
  });
});
define('kue-ui-client/helpers/has-previous', ['exports', 'ember-composable-helpers/helpers/has-previous'], function (exports, _emberComposableHelpersHelpersHasPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'hasPrevious', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersHasPrevious.hasPrevious;
    }
  });
});
define('kue-ui-client/helpers/inc', ['exports', 'ember-composable-helpers/helpers/inc'], function (exports, _emberComposableHelpersHelpersInc) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc['default'];
    }
  });
  Object.defineProperty(exports, 'inc', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInc.inc;
    }
  });
});
define('kue-ui-client/helpers/intersect', ['exports', 'ember-composable-helpers/helpers/intersect'], function (exports, _emberComposableHelpersHelpersIntersect) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect['default'];
    }
  });
  Object.defineProperty(exports, 'intersect', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersIntersect.intersect;
    }
  });
});
define('kue-ui-client/helpers/invoke', ['exports', 'ember-composable-helpers/helpers/invoke'], function (exports, _emberComposableHelpersHelpersInvoke) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke['default'];
    }
  });
  Object.defineProperty(exports, 'invoke', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersInvoke.invoke;
    }
  });
});
define('kue-ui-client/helpers/is-after', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/is-before', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/is-between', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _emberTruthHelpersHelpersIsEqual) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTruthHelpersHelpersIsEqual['default'];
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function get() {
      return _emberTruthHelpersHelpersIsEqual.isEqual;
    }
  });
});
define('kue-ui-client/helpers/is-same-or-after', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/is-same-or-before', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/is-same', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/join', ['exports', 'ember-composable-helpers/helpers/join'], function (exports, _emberComposableHelpersHelpersJoin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin['default'];
    }
  });
  Object.defineProperty(exports, 'join', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersJoin.join;
    }
  });
});
define('kue-ui-client/helpers/local-class', ['exports', 'ember-css-modules/helpers/local-class'], function (exports, _emberCssModulesHelpersLocalClass) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCssModulesHelpersLocalClass['default'];
    }
  });
  Object.defineProperty(exports, 'localClass', {
    enumerable: true,
    get: function get() {
      return _emberCssModulesHelpersLocalClass.localClass;
    }
  });
});
define('kue-ui-client/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/map-by', ['exports', 'ember-composable-helpers/helpers/map-by'], function (exports, _emberComposableHelpersHelpersMapBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy['default'];
    }
  });
  Object.defineProperty(exports, 'mapBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMapBy.mapBy;
    }
  });
});
define('kue-ui-client/helpers/map', ['exports', 'ember-composable-helpers/helpers/map'], function (exports, _emberComposableHelpersHelpersMap) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap['default'];
    }
  });
  Object.defineProperty(exports, 'map', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersMap.map;
    }
  });
});
define('kue-ui-client/helpers/moment-add', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-add'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentAdd) {
  exports['default'] = _emberMomentHelpersMomentAdd['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-calendar', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('kue-ui-client/helpers/moment-format', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-from-now', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-from', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-from'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentFrom) {
  exports['default'] = _emberMomentHelpersMomentFrom['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-subtract', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentSubtract) {
  exports['default'] = _emberMomentHelpersMomentSubtract['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-to-date', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentToDate) {
  exports['default'] = _emberMomentHelpersMomentToDate['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-to-now', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-to', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentHelpersMomentTo) {
  exports['default'] = _emberMomentHelpersMomentTo['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('kue-ui-client/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('kue-ui-client/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _emberMomentHelpersMoment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMoment['default'];
    }
  });
});
define('kue-ui-client/helpers/next', ['exports', 'ember-composable-helpers/helpers/next'], function (exports, _emberComposableHelpersHelpersNext) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext['default'];
    }
  });
  Object.defineProperty(exports, 'next', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersNext.next;
    }
  });
});
define('kue-ui-client/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('kue-ui-client/helpers/object-at', ['exports', 'ember-composable-helpers/helpers/object-at'], function (exports, _emberComposableHelpersHelpersObjectAt) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt['default'];
    }
  });
  Object.defineProperty(exports, 'objectAt', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersObjectAt.objectAt;
    }
  });
});
define('kue-ui-client/helpers/optional', ['exports', 'ember-composable-helpers/helpers/optional'], function (exports, _emberComposableHelpersHelpersOptional) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional['default'];
    }
  });
  Object.defineProperty(exports, 'optional', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersOptional.optional;
    }
  });
});
define('kue-ui-client/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/helpers/perform', ['exports', 'ember', 'ember-concurrency/-helpers'], function (exports, _ember, _emberConcurrencyHelpers) {
  exports.performHelper = performHelper;

  function performHelper(args, hash) {
    return (0, _emberConcurrencyHelpers.taskHelperClosure)('perform', args, hash);
  }

  exports['default'] = _ember['default'].Helper.helper(performHelper);
});
define('kue-ui-client/helpers/pipe-action', ['exports', 'ember-composable-helpers/helpers/pipe-action'], function (exports, _emberComposableHelpersHelpersPipeAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipeAction['default'];
    }
  });
});
define('kue-ui-client/helpers/pipe', ['exports', 'ember-composable-helpers/helpers/pipe'], function (exports, _emberComposableHelpersHelpersPipe) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe['default'];
    }
  });
  Object.defineProperty(exports, 'pipe', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPipe.pipe;
    }
  });
});
define('kue-ui-client/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('kue-ui-client/helpers/previous', ['exports', 'ember-composable-helpers/helpers/previous'], function (exports, _emberComposableHelpersHelpersPrevious) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious['default'];
    }
  });
  Object.defineProperty(exports, 'previous', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersPrevious.previous;
    }
  });
});
define('kue-ui-client/helpers/queue', ['exports', 'ember-composable-helpers/helpers/queue'], function (exports, _emberComposableHelpersHelpersQueue) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue['default'];
    }
  });
  Object.defineProperty(exports, 'queue', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersQueue.queue;
    }
  });
});
define('kue-ui-client/helpers/range', ['exports', 'ember-composable-helpers/helpers/range'], function (exports, _emberComposableHelpersHelpersRange) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange['default'];
    }
  });
  Object.defineProperty(exports, 'range', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRange.range;
    }
  });
});
define('kue-ui-client/helpers/reduce', ['exports', 'ember-composable-helpers/helpers/reduce'], function (exports, _emberComposableHelpersHelpersReduce) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce['default'];
    }
  });
  Object.defineProperty(exports, 'reduce', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReduce.reduce;
    }
  });
});
define('kue-ui-client/helpers/reject-by', ['exports', 'ember-composable-helpers/helpers/reject-by'], function (exports, _emberComposableHelpersHelpersRejectBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy['default'];
    }
  });
  Object.defineProperty(exports, 'rejectBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRejectBy.rejectBy;
    }
  });
});
define('kue-ui-client/helpers/repeat', ['exports', 'ember-composable-helpers/helpers/repeat'], function (exports, _emberComposableHelpersHelpersRepeat) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat['default'];
    }
  });
  Object.defineProperty(exports, 'repeat', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersRepeat.repeat;
    }
  });
});
define('kue-ui-client/helpers/reverse', ['exports', 'ember-composable-helpers/helpers/reverse'], function (exports, _emberComposableHelpersHelpersReverse) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse['default'];
    }
  });
  Object.defineProperty(exports, 'reverse', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersReverse.reverse;
    }
  });
});
define('kue-ui-client/helpers/shuffle', ['exports', 'ember-composable-helpers/helpers/shuffle'], function (exports, _emberComposableHelpersHelpersShuffle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle['default'];
    }
  });
  Object.defineProperty(exports, 'shuffle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersShuffle.shuffle;
    }
  });
});
define('kue-ui-client/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('kue-ui-client/helpers/slice', ['exports', 'ember-composable-helpers/helpers/slice'], function (exports, _emberComposableHelpersHelpersSlice) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice['default'];
    }
  });
  Object.defineProperty(exports, 'slice', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSlice.slice;
    }
  });
});
define('kue-ui-client/helpers/sort-by', ['exports', 'ember-composable-helpers/helpers/sort-by'], function (exports, _emberComposableHelpersHelpersSortBy) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy['default'];
    }
  });
  Object.defineProperty(exports, 'sortBy', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersSortBy.sortBy;
    }
  });
});
define('kue-ui-client/helpers/take', ['exports', 'ember-composable-helpers/helpers/take'], function (exports, _emberComposableHelpersHelpersTake) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake['default'];
    }
  });
  Object.defineProperty(exports, 'take', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersTake.take;
    }
  });
});
define('kue-ui-client/helpers/task', ['exports', 'ember'], function (exports, _ember) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  function taskHelper(_ref) {
    var _ref2 = _toArray(_ref);

    var task = _ref2[0];

    var args = _ref2.slice(1);

    return task._curry.apply(task, _toConsumableArray(args));
  }

  exports['default'] = _ember['default'].Helper.helper(taskHelper);
});
define('kue-ui-client/helpers/toggle-action', ['exports', 'ember-composable-helpers/helpers/toggle-action'], function (exports, _emberComposableHelpersHelpersToggleAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggleAction['default'];
    }
  });
});
define('kue-ui-client/helpers/toggle', ['exports', 'ember-composable-helpers/helpers/toggle'], function (exports, _emberComposableHelpersHelpersToggle) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle['default'];
    }
  });
  Object.defineProperty(exports, 'toggle', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersToggle.toggle;
    }
  });
});
define('kue-ui-client/helpers/transition-to', ['exports', 'ember-transition-helper/helpers/transition-to'], function (exports, _emberTransitionHelperHelpersTransitionTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTransitionHelperHelpersTransitionTo['default'];
    }
  });
  Object.defineProperty(exports, 'transitionTo', {
    enumerable: true,
    get: function get() {
      return _emberTransitionHelperHelpersTransitionTo.transitionTo;
    }
  });
});
define('kue-ui-client/helpers/union', ['exports', 'ember-composable-helpers/helpers/union'], function (exports, _emberComposableHelpersHelpersUnion) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion['default'];
    }
  });
  Object.defineProperty(exports, 'union', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersUnion.union;
    }
  });
});
define('kue-ui-client/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('kue-ui-client/helpers/without', ['exports', 'ember-composable-helpers/helpers/without'], function (exports, _emberComposableHelpersHelpersWithout) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout['default'];
    }
  });
  Object.defineProperty(exports, 'without', {
    enumerable: true,
    get: function get() {
      return _emberComposableHelpersHelpersWithout.without;
    }
  });
});
define('kue-ui-client/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('kue-ui-client/index/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        beforeModel: function beforeModel(transition) {
            transition.abort();
            this.transitionTo('jobs.index');
        }

    });
});
define('kue-ui-client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'kue-ui-client/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _kueUiClientConfigEnvironment) {
  var _config$APP = _kueUiClientConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('kue-ui-client/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('kue-ui-client/initializers/data-adapter', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('kue-ui-client/initializers/ember-concurrency', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  exports['default'] = {
    name: 'ember-concurrency',
    initialize: function initialize() {}
  };
});
// This initializer exists only to make sure that the following
// imports happen before the app boots.
define('kue-ui-client/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _emberDataSetupContainer, _emberData) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('kue-ui-client/initializers/ember-simple-auth', ['exports', 'kue-ui-client/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _kueUiClientConfigEnvironment, _emberSimpleAuthConfiguration, _emberSimpleAuthInitializersSetupSession, _emberSimpleAuthInitializersSetupSessionService) {
  exports['default'] = {
    name: 'ember-simple-auth',

    initialize: function initialize(registry) {
      var config = _kueUiClientConfigEnvironment['default']['ember-simple-auth'] || {};
      config.baseURL = _kueUiClientConfigEnvironment['default'].rootURL || _kueUiClientConfigEnvironment['default'].baseURL;
      _emberSimpleAuthConfiguration['default'].load(config);

      (0, _emberSimpleAuthInitializersSetupSession['default'])(registry);
      (0, _emberSimpleAuthInitializersSetupSessionService['default'])(registry);
    }
  };
});
define('kue-ui-client/initializers/export-application-global', ['exports', 'ember', 'kue-ui-client/config/environment'], function (exports, _ember, _kueUiClientConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_kueUiClientConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _kueUiClientConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_kueUiClientConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('kue-ui-client/initializers/injectStore', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('kue-ui-client/initializers/notifications', ['exports', 'ember', 'ember-cli-notifications/services/notification-messages-service'], function (exports, _ember, _emberCliNotificationsServicesNotificationMessagesService) {
    exports['default'] = {
        name: 'notification-messages-service',

        initialize: function initialize() {
            var application = arguments[1] || arguments[0];
            if (_ember['default'].Service) {
                application.register('service:notification-messages', _emberCliNotificationsServicesNotificationMessagesService['default']);
                application.inject('component:notification-container', 'notifications', 'service:notification-messages');
                application.inject('component:notification-message', 'notifications', 'service:notification-messages');
                return;
            }
            application.register('notification-messages:service', _emberCliNotificationsServicesNotificationMessagesService['default']);

            ['controller', 'component', 'route', 'router', 'service'].forEach(function (injectionTarget) {
                application.inject(injectionTarget, 'notifications', 'notification-messages:service');
            });
        }
    };
});
define('kue-ui-client/initializers/paper-wormhole', ['exports', 'ember-paper/initializers/paper-wormhole'], function (exports, _emberPaperInitializersPaperWormhole) {
  exports['default'] = {
    name: 'paper-wormhole',
    initialize: _emberPaperInitializersPaperWormhole['default']
  };
});
define('kue-ui-client/initializers/store', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('kue-ui-client/initializers/transforms', ['exports'], function (exports) {
  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('kue-ui-client/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("kue-ui-client/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _emberDataInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataInstanceInitializersInitializeStoreService["default"]
  };
});
define('kue-ui-client/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _emberSimpleAuthInstanceInitializersSetupSessionRestoration) {
  exports['default'] = {
    name: 'ember-simple-auth',

    initialize: function initialize(instance) {
      (0, _emberSimpleAuthInstanceInitializersSetupSessionRestoration['default'])(instance);
    }
  };
});
define('kue-ui-client/job/model', ['exports', 'ember-data'], function (exports, _emberData) {
  var Model = _emberData['default'].Model;
  var attr = _emberData['default'].attr;
  exports['default'] = Model.extend({
    attempts: attr(),
    created_at: attr('string'),
    duration: attr('number'),
    error: attr('string'),
    jobData: attr(),
    priority: attr('number'),
    progress: attr('number'),
    promote_at: attr('string'),
    started_at: attr('string'),
    state: attr('string'),
    type: attr('string'),
    updated_at: attr('string'),
    workerId: attr('string')
  });
});
define('kue-ui-client/jobs/index/controller', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        breakdowns: _ember['default'].A([])
    });
});
define('kue-ui-client/jobs/index/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({

        model: function model() {
            return _ember['default'].A([]);
        }
    });
});
define("kue-ui-client/jobs/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Zqkpqf6l", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"route route-jobs-index\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"stats-panel\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"title\"],[\"flush-element\"],[\"text\",\"General Stats\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"field\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"jobs.state\",\"active\"],null,6],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"field\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"jobs.state\",\"complete\"],null,5],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"field\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"jobs.state\",\"delayed\"],null,4],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"field\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"jobs.state\",\"failed\"],null,3],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"field\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"jobs.state\",\"inactive\"],null,2],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"stats-panel\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"title\"],[\"flush-element\"],[\"text\",\"Breakdown\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"breakdowns\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                \"],[\"append\",[\"unknown\",[\"stat\",\"type\"]],false],[\"text\",\" > \"],[\"append\",[\"unknown\",[\"stat\",\"state\"]],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"stat\",\"count\"]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"field\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"jobs.type\",[\"get\",[\"stat\",\"type\"]],[\"helper\",[\"query-params\"],null,[[\"state\"],[[\"get\",[\"stat\",\"state\"]]]]]],null,0],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"stat\"]},{\"statements\":[[\"text\",\"Inactive: \"],[\"append\",[\"unknown\",[\"stats\",\"inactiveCount\"]],false],[\"text\",\" \"]],\"locals\":[]},{\"statements\":[[\"text\",\"Failed: \"],[\"append\",[\"unknown\",[\"stats\",\"failedCount\"]],false],[\"text\",\" \"]],\"locals\":[]},{\"statements\":[[\"text\",\"Delayed: \"],[\"append\",[\"unknown\",[\"stats\",\"delayedCount\"]],false],[\"text\",\" \"]],\"locals\":[]},{\"statements\":[[\"text\",\"Complete: \"],[\"append\",[\"unknown\",[\"stats\",\"completeCount\"]],false],[\"text\",\" \"]],\"locals\":[]},{\"statements\":[[\"text\",\"Active: \"],[\"append\",[\"unknown\",[\"stats\",\"activeCount\"]],false],[\"text\",\" \"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/jobs/index/template.hbs" } });
});
define('kue-ui-client/jobs/route', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'ember'], function (exports, _emberSimpleAuthMixinsAuthenticatedRouteMixin, _ember) {
  var Route = _ember['default'].Route;
  var get = _ember['default'].get;
  exports['default'] = Route.extend(_emberSimpleAuthMixinsAuthenticatedRouteMixin['default'], {
    session: _ember['default'].inject.service(),
    beforeModel: function beforeModel(transition) {
      if (get(window, '__kueUiExpress.authmaker') && !this.get('session.isAuthenticated')) {
        var authenticationRoute = this.get('authenticationRoute');
        this.set('session.attemptedTransition', transition);
        return this.transitionTo(authenticationRoute);
      }
    }
  });
});
define('kue-ui-client/jobs/service', ['exports', 'ember', 'ember-ajax/request', 'kue-ui-client/config/environment', 'kue-ui-client/models/job-non-model'], function (exports, _ember, _emberAjaxRequest, _kueUiClientConfigEnvironment, _kueUiClientModelsJobNonModel) {
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var Service = _ember['default'].Service;
  var get = _ember['default'].get;
  exports['default'] = Service.extend({

    ajax: _ember['default'].inject.service(),
    session: _ember['default'].inject.service(),
    notifications: _ember['default'].inject.service('notification-messages'),

    STATES: _ember['default'].A(['active', 'complete', 'delayed', 'failed', 'inactive']),

    request: function request() {
      var _this = this;

      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new _ember['default'].RSVP.Promise(function (resolve) {
        if (_this.get('session.isAuthenticated')) {
          _this.get('session').authorize('authorizer:application', function (key, value) {
            resolve(_defineProperty({}, key, value));
          });
        } else {
          if (_ember['default'].get(window, '__kueUiExpress.authmaker')) {
            _this.get('session').invalidate();
          }
          resolve({});
        }
      }).then(function (headers) {
        return (0, _emberAjaxRequest['default'])((get(window, '__kueUiExpress.apiURL') || _kueUiClientConfigEnvironment['default'].apiURL) + '/' + opts.url, {
          method: opts.method,
          data: opts.data,
          headers: headers,
          contentType: opts.contentType
        }).then(null, function (err) {
          if (_ember['default'].get(err, 'errors.0.status') === '401') {
            _this.get('session').invalidate();
          }

          throw err;
        });
      });
    },

    stats: function stats() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var type = opts.type;
      var state = opts.state;
      var url = '';

      if (!_ember['default'].isEmpty(type) && !_ember['default'].isEmpty(state)) {
        url = 'jobs/' + type + '/' + state + '/stats';
      } else {
        url = 'stats';
      }

      return this.request({
        url: url
      });
    },

    find: function find() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var size = Number(opts.size) || 20;
      var page = Number(opts.page) || 1;
      var from = (page - 1) * size;
      var to = page * size;
      console.log('find', opts);
      var url = _kueUiClientConfigEnvironment['default'].apiURL + '/' + from + '..' + to;

      if (opts.type && opts.state) {
        url = 'jobs/' + opts.type + '/' + opts.state + '/' + from + '..' + to;
      } else if (opts.type) {
        url = 'jobs/' + opts.type + '/' + from + '..' + to;
      } else if (opts.state) {
        url = 'jobs/' + opts.state + '/' + from + '..' + to;
      }

      if (opts.order) {
        url += '/' + opts.order + '?';
      }

      return this.request({
        data: opts.data || {},
        method: 'GET',
        url: url
      }).then(function (data) {
        if (_ember['default'].isArray(data)) {
          return data.map(function (obj) {
            return _kueUiClientModelsJobNonModel['default'].create(obj);
          });
        } else {
          return _kueUiClientModelsJobNonModel['default'].create(data);
        }
      });
    },

    updateState: function updateState(id, state) {
      return this.request({
        method: 'PUT',
        url: 'job/' + id + '/state/' + state
      }).then(function (job) {
        return job;
      })['catch'](function (err) {
        console.warn('Job state update error', err);
      });
    },

    findOne: function findOne() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.request({
        method: 'GET',
        url: 'job/' + opts.id
      }).then(function (result) {
        return _kueUiClientModelsJobNonModel['default'].create(result);
      });
    },

    types: function types() {
      return this.request({
        method: 'GET',
        url: 'job/types/'
      });
    },

    remove: function remove(job) {
      var _this2 = this;

      var id = job.get('id');
      return this.request({
        method: 'DELETE',
        url: 'job/' + id + '/'
      })['catch'](function (err) {
        console.warn('Job remove error', err);
        _this2.get('notifications').error('Error removing Job: ' + err.message);
        throw err;
      });
    },

    create: function create(jobBody) {
      return this.request({
        method: 'POST',
        url: 'job',
        data: jobBody,
        contentType: 'application/json'
      });
    }
  });
});
define('kue-ui-client/jobs/show/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    jobs: _ember['default'].inject.service(),
    notifications: _ember['default'].inject.service('notification-messages'),

    actions: {
      removeJob: function removeJob(job) {
        var _this = this;

        this.get('jobs').remove(job).then(function () {
          _this.get('notifications').success('Job Deleted', {
            autoClear: true
          });
        });
      }
    }
  });
});
define('kue-ui-client/jobs/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    jobs: _ember['default'].inject.service(),

    model: function model(params) {
      return this.get('jobs').findOne({
        id: params.id
      });
    }
  });
});
define("kue-ui-client/jobs/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "CJmjp0h9", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"route route-jobs-show\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"job-detail\"],null,[[\"job\",\"removeAction\"],[[\"get\",[\"model\"]],\"removeJob\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/jobs/show/template.hbs" } });
});
define('kue-ui-client/jobs/state/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    queryParams: ['page', 'order'],
    page: 1,
    order: 'asc',

    jobs: _ember['default'].inject.service(),
    notifications: _ember['default'].inject.service('notification-messages'),
    actions: {
      removeJob: function removeJob(job) {
        var _this = this;

        this.get('jobs').remove(job).then(function () {
          _this.get('notifications').success('Job Deleted', {
            autoClear: true
          });
          _this.get('model').removeObject(job);
        });
      },

      updateOrder: function updateOrder() {
        var order = this.get('order');
        this.set('order', order === 'asc' ? 'desc' : 'asc');
      }
    }
  });
});
define('kue-ui-client/jobs/state/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        jobs: _ember['default'].inject.service(),
        queryParams: {
            page: { refreshModel: true },
            order: { refreshModel: true }
        },

        model: function model(params) {
            this.controllerFor('application').set('type', null);
            this.controllerFor('application').set('state', params.stateId);
            return this.get('jobs').find({
                state: params.stateId,
                page: params.page,
                order: params.order
            });
        },

        activate: function activate() {
            this._super();
            window.scrollTo(0, 0);
        }

    });
});
define("kue-ui-client/jobs/state/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FtMLUgLQ", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"route route-jobs-state\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"jobs-table\"],null,[[\"jobs\",\"selectedJob\",\"order\",\"orderAction\"],[[\"get\",[\"model\"]],[\"get\",[\"selectedJob\"]],[\"get\",[\"order\"]],\"updateOrder\"]]],false],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-right\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"selectedJob\"]]],null,1,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"jobs-paging\"],null,[[\"page\"],[[\"get\",[\"page\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"job-detail\"],null,[[\"job\",\"action\",\"removeAction\"],[[\"get\",[\"selectedJob\"]],\"goToJob\",\"removeJob\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/jobs/state/template.hbs" } });
});
define('kue-ui-client/jobs/type/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    queryParams: ['state', 'page', 'order'],
    // query params will be a separate  value for every object implementing the mixin
    state: 'active',
    page: 1,
    order: 'asc',

    jobs: _ember['default'].inject.service(),
    notifications: _ember['default'].inject.service('notification-messages'),
    actions: {
      removeJob: function removeJob(job) {
        var _this = this;

        this.get('jobs').remove(job).then(function () {
          _this.get('notifications').success('Job Deleted', {
            autoClear: true
          });
          _this.get('model').removeObject(job);
        });
      },

      goToJob: function goToJob(job) {
        this.transitionToRoute('jobs.show', job);
      },

      updateOrder: function updateOrder() {
        var order = this.get('order');
        this.set('order', order === 'asc' ? 'desc' : 'asc');
        this.set('page', 1);
      }
    }
  });
});
define('kue-ui-client/jobs/type/route', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        jobs: _ember['default'].inject.service(),
        queryParams: {
            page: { refreshModel: true },
            sort: { refreshModel: true },
            state: { refreshModel: true }
        },

        model: function model(params) {
            this.controllerFor('jobs.type').set('type', params.type);
            this.controllerFor('application').set('type', params.type);
            return this.get('jobs').find({
                type: params.type,
                state: params.state,
                page: params.page,
                order: params.order
            });
        },

        activate: function activate() {
            this._super();
            window.scrollTo(0, 0);
        }

    });
});
define("kue-ui-client/jobs/type/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "rVr6hjei", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"route route-jobs-type\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"jobs-filter\"],null,[[\"type\",\"selectedState\",\"page\",\"sort\"],[[\"get\",[\"type\"]],[\"get\",[\"state\"]],[\"get\",[\"page\"]],[\"get\",[\"sort\"]]]],2],[\"text\",\"  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-right\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"selectedJob\"]]],null,1,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"job-detail\"],null,[[\"job\",\"action\",\"removeAction\"],[[\"get\",[\"selectedJob\"]],\"goToJob\",\"removeJob\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"jobs-table\"],null,[[\"jobs\",\"selectedJob\",\"order\",\"orderAction\"],[[\"get\",[\"model\"]],[\"get\",[\"selectedJob\"]],[\"get\",[\"order\"]],\"updateOrder\"]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/jobs/type/template.hbs" } });
});
define('kue-ui-client/login/route', ['exports', 'ember', 'authmaker-ember-simple-auth/mixins/login-route', 'kue-ui-client/config/environment'], function (exports, _ember, _authmakerEmberSimpleAuthMixinsLoginRoute, _kueUiClientConfigEnvironment) {
  var Route = _ember['default'].Route;
  var get = _ember['default'].get;
  exports['default'] = Route.extend(_authmakerEmberSimpleAuthMixinsLoginRoute['default'], {
    config: get(window, '__kueUiExpress.authmaker') || _kueUiClientConfigEnvironment['default'].authMaker
  });
});
define('kue-ui-client/mixins/transition-mixin', ['exports', 'ember-css-transitions/mixins/transition-mixin'], function (exports, _emberCssTransitionsMixinsTransitionMixin) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCssTransitionsMixinsTransitionMixin['default'];
    }
  });
});
define('kue-ui-client/models/job-non-model', ['exports', 'ember'], function (exports, _ember) {

  // TODO: remove this class when we can transition Job over to EmberData completely
  var Job = _ember['default'].Object.extend({
    deleted: _ember['default'].computed.alias('isDestroyed')
  });

  exports['default'] = Job;
});
define('kue-ui-client/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('kue-ui-client/router', ['exports', 'ember', 'kue-ui-client/config/environment'], function (exports, _ember, _kueUiClientConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _kueUiClientConfigEnvironment['default'].locationType,
    rootURL: window.__kueUiExpress ? window.__kueUiExpress.rootUrl : _kueUiClientConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('jobs', function () {
      this.route('type', { path: "type/:type" });
      this.route('state', { path: "state/:stateId" });
      this.route('show', { path: ":id" });
      this.route('new', { path: "/new" });
    });
    this.route('login');
  });

  exports['default'] = Router;
});
define('kue-ui-client/routes/application', ['exports', 'ember'], function (exports, _ember) {
  var Route = _ember['default'].Route;

  // Ensure the application route exists for ember-simple-auth's `setup-session-restoration` initializer
  exports['default'] = Route.extend();
});
define('kue-ui-client/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('kue-ui-client/services/constants', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var inject = _ember['default'].inject;
  var computed = _ember['default'].computed;
  var EObject = _ember['default'].Object;
  exports['default'] = Service.extend({

    sniffer: inject.service('sniffer'),

    webkit: computed(function () {
      return (/webkit/i.test(this.get('sniffer.vendorPrefix'))
      );
    }),

    vendorProperty: function vendorProperty(name) {
      var prefix = this.get('sniffer.vendorPrefix').toLowerCase();
      return this.get('webkit') ? '-webkit-' + name.charAt(0) + name.substring(1) : name;
    },

    CSS: computed('webkit', function () {
      var webkit = this.get('webkit');
      return {
        /* Constants */
        TRANSITIONEND: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
        ANIMATIONEND: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

        TRANSFORM: this.vendorProperty('transform'),
        TRANSFORM_ORIGIN: this.vendorProperty('transformOrigin'),
        TRANSITION: this.vendorProperty('transition'),
        TRANSITION_DURATION: this.vendorProperty('transitionDuration'),
        ANIMATION_PLAY_STATE: this.vendorProperty('animationPlayState'),
        ANIMATION_DURATION: this.vendorProperty('animationDuration'),
        ANIMATION_NAME: this.vendorProperty('animationName'),
        ANIMATION_TIMING: this.vendorProperty('animationTimingFunction'),
        ANIMATION_DIRECTION: this.vendorProperty('animationDirection')
      };
    }),

    KEYCODE: EObject.create({
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      TAB: 9
    }),

    MEDIA: {
      'xs': '(max-width: 599px)',
      'gt-xs': '(min-width: 600px)',
      'sm': '(min-width: 600px) and (max-width: 959px)',
      'gt-sm': '(min-width: 960px)',
      'md': '(min-width: 960px) and (max-width: 1279px)',
      'gt-md': '(min-width: 1280px)',
      'lg': '(min-width: 1280px) and (max-width: 1919px)',
      'gt-lg': '(min-width: 1920px)',
      'xl': '(min-width: 1920px)',
      'print': 'print'
    },

    MEDIA_PRIORITY: ['xl', 'gt-lg', 'lg', 'gt-md', 'md', 'gt-sm', 'sm', 'gt-xs', 'xs', 'print']
  });
});
define('kue-ui-client/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _emberCookiesServicesCookies) {
  exports['default'] = _emberCookiesServicesCookies['default'];
});
define('kue-ui-client/services/moment', ['exports', 'ember', 'kue-ui-client/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _kueUiClientConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_kueUiClientConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('kue-ui-client/services/notification-messages-service', ['exports', 'ember-cli-notifications/services/notification-messages-service'], function (exports, _emberCliNotificationsServicesNotificationMessagesService) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliNotificationsServicesNotificationMessagesService['default'];
    }
  });
});
define('kue-ui-client/services/paper-sidenav', ['exports', 'ember-paper/services/paper-sidenav'], function (exports, _emberPaperServicesPaperSidenav) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPaperServicesPaperSidenav['default'];
    }
  });
});
define('kue-ui-client/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _emberSimpleAuthServicesSession) {
  exports['default'] = _emberSimpleAuthServicesSession['default'];
});
define('kue-ui-client/services/sniffer', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var computed = _ember['default'].computed;

  var isString = function isString(value) {
    return typeof value === 'string';
  };

  var lowercase = function lowercase(string) {
    return isString(string) ? string.toLowerCase() : string;
  };

  var toInt = function toInt(str) {
    return parseInt(str, 10);
  };

  exports['default'] = Service.extend({
    vendorPrefix: '',
    transitions: false,
    animations: false,
    _document: null,
    _window: null,

    android: computed('', function () {
      return toInt((/android (\d+)/.exec(lowercase((this.get('_window').navigator || {}).userAgent)) || [])[1]);
    }),

    init: function init() {
      this._super.apply(this, arguments);
      if (typeof FastBoot !== 'undefined') {
        return;
      }

      var _document = document;
      var _window = window;

      this.setProperties({
        _document: _document,
        _window: _window
      });

      var bodyStyle = _document.body && _document.body.style;
      var vendorPrefix = undefined;
      var vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/;

      var transitions = false;
      var animations = false;
      var match = undefined;

      if (bodyStyle) {
        for (var prop in bodyStyle) {
          if (match = vendorRegex.exec(prop)) {
            vendorPrefix = match[0];
            vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
            break;
          }
        }

        if (!vendorPrefix) {
          vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
        }

        transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
        animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);

        if (this.get('android') && (!transitions || !animations)) {
          transitions = isString(bodyStyle.webkitTransition);
          animations = isString(bodyStyle.webkitAnimation);
        }
      }

      this.set('transitions', transitions);
      this.set('animations', animations);

      this.set('vendorPrefix', vendorPrefix);
    }

  });
});
/* globals FastBoot */
define('kue-ui-client/services/text-measurer', ['exports', 'ember-text-measurer/services/text-measurer'], function (exports, _emberTextMeasurerServicesTextMeasurer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTextMeasurerServicesTextMeasurer['default'];
    }
  });
});
define('kue-ui-client/services/util', ['exports', 'ember'], function (exports, _ember) {
  var Service = _ember['default'].Service;
  var $ = _ember['default'].$;

  var Util = Service.extend({

    // Disables scroll around the passed element.
    disableScrollAround: function disableScrollAround(element) {
      var util = this;
      var $document = $(window.document);

      util.disableScrollAround._count = util.disableScrollAround._count || 0;
      ++util.disableScrollAround._count;
      if (util.disableScrollAround._enableScrolling) {
        return util.disableScrollAround._enableScrolling;
      }

      var _$document$get = $document.get(0);

      var body = _$document$get.body;

      var restoreBody = disableBodyScroll();
      var restoreElement = disableElementScroll();

      return util.disableScrollAround._enableScrolling = function () {
        if (! --util.disableScrollAround._count) {
          restoreBody();
          restoreElement();
          delete util.disableScrollAround._enableScrolling;
        }
      };

      // Creates a virtual scrolling mask to absorb touchmove, keyboard, scrollbar clicking, and wheel events
      function disableElementScroll() {
        var zIndex = 50;
        var scrollMask = $('<div class="md-scroll-mask" style="z-index: ' + zIndex + '">\n          <div class="md-scroll-mask-bar"></div>\n        </div>');
        body.appendChild(scrollMask[0]);

        scrollMask.on('wheel', preventDefault);
        scrollMask.on('touchmove', preventDefault);
        $document.on('keydown', disableKeyNav);

        return function restoreScroll() {
          scrollMask.off('wheel');
          scrollMask.off('touchmove');
          scrollMask[0].parentNode.removeChild(scrollMask[0]);
          $document.off('keydown', disableKeyNav);
          delete util.disableScrollAround._enableScrolling;
        };

        // Prevent keypresses from elements inside the body
        // used to stop the keypresses that could cause the page to scroll
        // (arrow keys, spacebar, tab, etc).
        function disableKeyNav(e) {
          // -- temporarily removed this logic, will possibly re-add at a later date
          return;
          if (!element[0].contains(e.target)) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }

        function preventDefault(e) {
          e.preventDefault();
        }
      }

      // Converts the body to a position fixed block and translate it to the proper scroll
      // position
      function disableBodyScroll() {
        var htmlNode = body.parentNode;
        var restoreHtmlStyle = htmlNode.getAttribute('style') || '';
        var restoreBodyStyle = body.getAttribute('style') || '';
        var scrollOffset = body.scrollTop + body.parentElement.scrollTop;
        var clientWidth = body.clientWidth;

        if (body.scrollHeight > body.clientHeight) {
          applyStyles(body, {
            position: 'fixed',
            width: '100%',
            top: -scrollOffset + 'px'
          });

          applyStyles(htmlNode, {
            overflowY: 'scroll'
          });
        }

        if (body.clientWidth < clientWidth) {
          applyStyles(body, { overflow: 'hidden' });
        }

        return function restoreScroll() {
          body.setAttribute('style', restoreBodyStyle);
          htmlNode.setAttribute('style', restoreHtmlStyle);
          body.scrollTop = scrollOffset;
        };
      }

      function applyStyles(el, styles) {
        for (var key in styles) {
          el.style[key] = styles[key];
        }
      }
    },
    enableScrolling: function enableScrolling() {
      var method = this.disableScrollAround._enableScrolling;
      method && method();
    },

    /*
     * supplant() method from Crockford's `Remedial Javascript`
     * Equivalent to use of $interpolate; without dependency on
     * interpolation symbols and scope. Note: the '{<token>}' can
     * be property names, property chains, or array indices.
     */
    supplant: function supplant(template, values, pattern) {
      pattern = pattern || /\{([^\{\}]*)\}/g;
      return template.replace(pattern, function (a, b) {
        var p = b.split('.');
        var r = values;
        try {
          for (var s in p) {
            if (p.hasOwnProperty(s)) {
              r = r[p[s]];
            }
          }
        } catch (e) {
          r = a;
        }
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      });
    },
    nextTick: (function (window, prefixes, i, p, fnc) {
      while (!fnc && i < prefixes.length) {
        fnc = window[prefixes[i++] + 'equestAnimationFrame'];
      }
      return fnc && fnc.bind(window) || window.setImmediate || function (fnc) {
        window.setTimeout(fnc, 0);
      };
    })(window, 'r webkitR mozR msR oR'.split(' '), 0)

  });

  exports['default'] = Util;
});
define('kue-ui-client/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _emberSimpleAuthSessionStoresAdaptive) {
  exports['default'] = _emberSimpleAuthSessionStoresAdaptive['default'].extend();
});
define('kue-ui-client/state-timebucket/model', ['exports', 'ember-data'], function (exports, _emberData) {
  var Model = _emberData['default'].Model;
  var hasMany = _emberData['default'].hasMany;
  var attr = _emberData['default'].attr;
  exports['default'] = Model.extend({
    complete: attr('number'),
    failed: attr('number'),
    completeJobs: hasMany('job'),
    failedJobs: hasMany('job')
  });
});
define("kue-ui-client/templates/components/transition-group", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eLD7zyrR", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/templates/components/transition-group.hbs" } });
});
define("kue-ui-client/templates/components/x-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ikgog2oC", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "kue-ui-client/templates/components/x-select.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('kue-ui-client/config/environment', ['ember'], function(Ember) {
  var prefix = 'kue-ui-client';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("kue-ui-client/app")["default"].create({"name":"kue-ui-client","version":"1.1.3+321caaed"});
}

/* jshint ignore:end */
//# sourceMappingURL=kue-ui-client.map
