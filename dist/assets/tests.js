'use strict';

define('kue-ui-client/tests/app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('kue-ui-client/tests/application/adapter.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | application/adapter.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/adapter.js should pass jshint.');
  });
});
define('kue-ui-client/tests/application/controller.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | application/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/controller.js should pass jshint.');
  });
});
define('kue-ui-client/tests/application/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | application/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/assertions', ['exports', 'ember', 'kue-ui-client/config/environment'], function (exports, _ember, _kueUiClientConfigEnvironment) {
  var camelize = _ember['default'].String.camelize;

  var assertionCache = undefined;

  function assertions() {
    if (!assertionCache) {
      (function () {
        var modulePrefix = _kueUiClientConfigEnvironment['default'].modulePrefix;

        var entries = _ember['default'].A(Object.keys(requirejs.entries));
        var pattern = new RegExp('^' + modulePrefix + '/tests/assertions/[\\w-]+$');

        assertionCache = entries.reduce(function (entries, entry) {
          if (entry.match(pattern)) {
            var splitEntry = entry.split('/');
            var fn = requirejs(entry)['default'];

            entry = splitEntry[splitEntry.length - 1];
            entry = camelize(entry);
            entries[entry] = fn;
          }

          return entries;
        }, {});
      })();
    }

    return assertionCache;
  }

  function assertionInjector(context) {
    var _assertions = assertions();

    Object.keys(_assertions).forEach(function (assertion) {
      window.QUnit.assert[assertion] = function () {
        var fn = _assertions[assertion];
        var args = Array.prototype.slice.call(arguments);

        if (context) {
          args.unshift(context);
        }

        return fn.apply(this, args);
      };
    });
  }

  function assertionCleanup() {
    var _assertions = assertions();

    Object.keys(_assertions).forEach(function (assertion) {
      delete window.QUnit.assert[assertions];
    });
  }

  exports.assertionInjector = assertionInjector;
  exports.assertionCleanup = assertionCleanup;
});
define("kue-ui-client/tests/assertions/contains", ["exports"], function (exports) {
  exports["default"] = contains;

  function contains(context, element, text, message) {
    message = message || element + " should contain \"" + text + "\"";
    var actual = element.text();
    var expected = text;
    var result = !!actual.match(new RegExp(expected));

    this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }
});
define('kue-ui-client/tests/assertions/contains.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | assertions/contains.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'assertions/contains.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/job-detail/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/job-detail/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/job-detail/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/jobs-filter/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/jobs-filter/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/jobs-filter/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/jobs-paging/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/jobs-paging/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/jobs-paging/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/jobs-table/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/jobs-table/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/jobs-table/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/json-pretty/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/json-pretty/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/json-pretty/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/menu-tabs/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/menu-tabs/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/menu-tabs/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/components/toggle-arrow/component.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/toggle-arrow/component.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/toggle-arrow/component.js should pass jshint.');
  });
});
define('kue-ui-client/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('kue-ui-client/tests/helpers/destroy-app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('kue-ui-client/tests/helpers/ember-basic-dropdown', ['exports', 'ember', 'ember-runloop'], function (exports, _ember, _emberRunloop) {
  exports.nativeClick = nativeClick;
  exports.clickTrigger = clickTrigger;
  exports.tapTrigger = tapTrigger;
  exports.fireKeydown = fireKeydown;

  // integration helpers
  function focus(el) {
    if (!el) {
      return;
    }
    var $el = jQuery(el);
    if ($el.is(':input, [contenteditable=true]')) {
      var type = $el.prop('type');
      if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
        (0, _emberRunloop['default'])(null, function () {
          // Firefox does not trigger the `focusin` event if the window
          // does not have focus. If the document doesn't have focus just
          // use trigger('focusin') instead.

          if (!document.hasFocus || document.hasFocus()) {
            el.focus();
          } else {
            $el.trigger('focusin');
          }
        });
      }
    }
  }

  function nativeClick(selector) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var mousedown = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    var mouseup = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
    var click = new window.Event('click', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      mousedown[key] = options[key];
      mouseup[key] = options[key];
      click[key] = options[key];
    });
    var element = document.querySelector(selector);
    (0, _emberRunloop['default'])(function () {
      return element.dispatchEvent(mousedown);
    });
    focus(element);
    (0, _emberRunloop['default'])(function () {
      return element.dispatchEvent(mouseup);
    });
    (0, _emberRunloop['default'])(function () {
      return element.dispatchEvent(click);
    });
  }

  function clickTrigger(scope) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = '.ember-basic-dropdown-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    nativeClick(selector, options);
  }

  function tapTrigger(scope) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = '.ember-basic-dropdown-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    var touchStartEvent = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return touchStartEvent[key] = options[key];
    });
    (0, _emberRunloop['default'])(function () {
      return document.querySelector(selector).dispatchEvent(touchStartEvent);
    });
    var touchEndEvent = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
    Object.keys(options).forEach(function (key) {
      return touchEndEvent[key] = options[key];
    });
    (0, _emberRunloop['default'])(function () {
      return document.querySelector(selector).dispatchEvent(touchEndEvent);
    });
  }

  function fireKeydown(selector, k) {
    var oEvent = document.createEvent('Events');
    oEvent.initEvent('keydown', true, true);
    $.extend(oEvent, {
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      keyCode: k,
      charCode: k
    });
    (0, _emberRunloop['default'])(function () {
      return document.querySelector(selector).dispatchEvent(oEvent);
    });
  }

  // acceptance helpers

  exports['default'] = function () {
    _ember['default'].Test.registerAsyncHelper('clickDropdown', function (app, cssPath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      clickTrigger(cssPath, options);
    });

    _ember['default'].Test.registerAsyncHelper('tapDropdown', function (app, cssPath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      tapTrigger(cssPath, options);
    });
  };
});
define('kue-ui-client/tests/helpers/ember-power-select', ['exports', 'jquery', 'ember-runloop', 'ember-test'], function (exports, _jquery, _emberRunloop, _emberTest) {
  exports.nativeMouseDown = nativeMouseDown;
  exports.nativeMouseUp = nativeMouseUp;
  exports.triggerKeydown = triggerKeydown;
  exports.typeInSearch = typeInSearch;
  exports.clickTrigger = clickTrigger;
  exports.nativeTouch = nativeTouch;
  exports.touchTrigger = touchTrigger;

  // Helpers for integration tests

  function typeText(selector, text) {
    var $selector = (0, _jquery['default'])((0, _jquery['default'])(selector).get(0)); // Only interact with the first result
    $selector.val(text);
    var event = document.createEvent('Events');
    event.initEvent('input', true, true);
    $selector[0].dispatchEvent(event);
  }

  function fireNativeMouseEvent(eventType, selectorOrDomElement) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var event = undefined;
    try {
      event = new window.Event(eventType, { bubbles: true, cancelable: true, view: window });
    } catch (e) {
      // fix IE11: "Object doesn't support this action"
      event = document.createEvent('Event');
      var bubbles = true;
      var cancelable = true;
      event.initEvent(eventType, bubbles, cancelable);
    }

    Object.keys(options).forEach(function (key) {
      return event[key] = options[key];
    });
    var target = undefined;
    if (typeof selectorOrDomElement === 'string') {
      target = (0, _jquery['default'])(selectorOrDomElement)[0];
    } else {
      target = selectorOrDomElement;
    }
    (0, _emberRunloop['default'])(function () {
      return target.dispatchEvent(event);
    });
  }

  function nativeMouseDown(selectorOrDomElement, options) {
    fireNativeMouseEvent('mousedown', selectorOrDomElement, options);
  }

  function nativeMouseUp(selectorOrDomElement, options) {
    fireNativeMouseEvent('mouseup', selectorOrDomElement, options);
  }

  function triggerKeydown(domElement, k) {
    var oEvent = document.createEvent('Events');
    oEvent.initEvent('keydown', true, true);
    _jquery['default'].extend(oEvent, {
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      keyCode: k,
      charCode: k
    });
    (0, _emberRunloop['default'])(function () {
      domElement.dispatchEvent(oEvent);
    });
  }

  function typeInSearch(text) {
    (0, _emberRunloop['default'])(function () {
      typeText('.ember-power-select-search-input, .ember-power-select-search input, .ember-power-select-trigger-multiple-input, input[type="search"]', text);
    });
  }

  function clickTrigger(scope) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = '.ember-power-select-trigger';
    if (scope) {
      selector = scope + ' ' + selector;
    }
    nativeMouseDown(selector, options);
  }

  function nativeTouch(selectorOrDomElement) {
    var event = new window.Event('touchstart', { bubbles: true, cancelable: true, view: window });
    var target = undefined;

    if (typeof selectorOrDomElement === 'string') {
      target = (0, _jquery['default'])(selectorOrDomElement)[0];
    } else {
      target = selectorOrDomElement;
    }
    (0, _emberRunloop['default'])(function () {
      return target.dispatchEvent(event);
    });
    (0, _emberRunloop['default'])(function () {
      event = new window.Event('touchend', { bubbles: true, cancelable: true, view: window });
      target.dispatchEvent(event);
    });
  }

  function touchTrigger() {
    var selector = '.ember-power-select-trigger';
    nativeTouch(selector);
  }

  // Helpers for acceptance tests

  exports['default'] = function () {
    _emberTest['default'].registerAsyncHelper('selectChoose', function (app, cssPath, valueOrSelector) {
      var $trigger = find(cssPath + ' .ember-power-select-trigger');

      if ($trigger === undefined || $trigger.length === 0) {
        $trigger = find(cssPath);
      }

      if ($trigger.length === 0) {
        throw new Error('You called "selectChoose(\'' + cssPath + '\', \'' + valueOrSelector + '\')" but no select was found using selector "' + cssPath + '"');
      }

      var contentId = '' + $trigger.attr('aria-controls');
      var $content = find('#' + contentId);
      // If the dropdown is closed, open it
      if ($content.length === 0) {
        nativeMouseDown($trigger.get(0));
        wait();
      }

      // Select the option with the given text
      andThen(function () {
        var potentialTargets = (0, _jquery['default'])('#' + contentId + ' .ember-power-select-option:contains("' + valueOrSelector + '")').toArray();
        var target = undefined;
        if (potentialTargets.length === 0) {
          // If treating the value as text doesn't gave use any result, let's try if it's a css selector
          potentialTargets = (0, _jquery['default'])('#' + contentId + ' ' + valueOrSelector).toArray();
        }
        if (potentialTargets.length > 1) {
          target = potentialTargets.filter(function (t) {
            return t.textContent.trim() === valueOrSelector;
          })[0] || potentialTargets[0];
        } else {
          target = potentialTargets[0];
        }
        if (!target) {
          throw new Error('You called "selectChoose(\'' + cssPath + '\', \'' + valueOrSelector + '\')" but "' + valueOrSelector + '" didn\'t match any option');
        }
        nativeMouseUp(target);
      });
    });

    _emberTest['default'].registerAsyncHelper('selectSearch', function (app, cssPath, value) {
      var triggerPath = cssPath + ' .ember-power-select-trigger';
      var $trigger = find(triggerPath);
      if ($trigger === undefined || $trigger.length === 0) {
        triggerPath = cssPath;
        $trigger = find(triggerPath);
      }

      if ($trigger.length === 0) {
        throw new Error('You called "selectSearch(\'' + cssPath + '\', \'' + value + '\')" but no select was found using selector "' + cssPath + '"');
      }

      var contentId = '' + $trigger.attr('aria-controls');
      var isMultipleSelect = (0, _jquery['default'])(cssPath + ' .ember-power-select-trigger-multiple-input').length > 0;

      var dropdownIsClosed = (0, _jquery['default'])('#' + contentId).length === 0;
      if (dropdownIsClosed) {
        nativeMouseDown(triggerPath);
        wait();
      }
      var isDefaultSingleSelect = (0, _jquery['default'])('.ember-power-select-search-input').length > 0;

      if (isMultipleSelect) {
        fillIn(triggerPath + ' .ember-power-select-trigger-multiple-input', value);
      } else if (isDefaultSingleSelect) {
        fillIn('.ember-power-select-search-input', value);
      } else {
        // It's probably a customized version
        var inputIsInTrigger = !!find(cssPath + ' .ember-power-select-trigger input[type=search]')[0];
        if (inputIsInTrigger) {
          fillIn(triggerPath + ' input[type=search]', value);
        } else {
          fillIn('#' + contentId + ' .ember-power-select-search-input[type=search]', 'input');
        }
      }
    });

    _emberTest['default'].registerAsyncHelper('removeMultipleOption', function (app, cssPath, value) {
      var elem = find(cssPath + ' .ember-power-select-multiple-options > li:contains(' + value + ') > .ember-power-select-multiple-remove-btn').get(0);
      try {
        nativeMouseDown(elem);
        wait();
      } catch (e) {
        console.warn('css path to remove btn not found');
        throw e;
      }
    });

    _emberTest['default'].registerAsyncHelper('clearSelected', function (app, cssPath) {
      var elem = find(cssPath + ' .ember-power-select-clear-btn').get(0);
      try {
        nativeMouseDown(elem);
        wait();
      } catch (e) {
        console.warn('css path to clear btn not found');
        throw e;
      }
    });
  };
});
define('kue-ui-client/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _emberSimpleAuthAuthenticatorsTest) {
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _emberSimpleAuthAuthenticatorsTest['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }
});
/* global wait */
define('kue-ui-client/tests/helpers/format-error.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/format-error.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-error.js should pass jshint.');
  });
});
define('kue-ui-client/tests/helpers/format-json.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/format-json.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-json.js should pass jshint.');
  });
});
define('kue-ui-client/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'kue-ui-client/tests/helpers/start-app', 'kue-ui-client/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _kueUiClientTestsHelpersStartApp, _kueUiClientTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _kueUiClientTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _kueUiClientTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('kue-ui-client/tests/helpers/module-for-acceptance.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('kue-ui-client/tests/helpers/register-select-helper', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = function () {
    _ember['default'].Test.registerAsyncHelper('select', function (app, selector) {
      for (var _len = arguments.length, texts = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        texts[_key - 2] = arguments[_key];
      }

      var $options = app.testHelpers.findWithAssert(selector + ' option');

      $options.each(function () {
        var _this = this;

        var $option = _ember['default'].$(this);

        _ember['default'].run(function () {
          _this.selected = texts.some(function (text) {
            return $option.is(':contains(\'' + text + '\')');
          });
          $option.trigger('change');
        });
      });

      return app.testHelpers.wait();
    });
  };
});
define('kue-ui-client/tests/helpers/resolver', ['exports', 'kue-ui-client/resolver', 'kue-ui-client/config/environment'], function (exports, _kueUiClientResolver, _kueUiClientConfigEnvironment) {

  var resolver = _kueUiClientResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _kueUiClientConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _kueUiClientConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('kue-ui-client/tests/helpers/resolver.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('kue-ui-client/tests/helpers/start-app', ['exports', 'ember', 'kue-ui-client/app', 'kue-ui-client/config/environment'], function (exports, _ember, _kueUiClientApp, _kueUiClientConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _kueUiClientConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _kueUiClientApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('kue-ui-client/tests/helpers/start-app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('kue-ui-client/tests/index/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'index/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/integration/components/job-detail/component-test', ['exports', 'ember', 'ember-qunit', 'kue-ui-client/tests/assertions'], function (exports, _ember, _emberQunit, _kueUiClientTestsAssertions) {

  (0, _emberQunit.moduleForComponent)('job-detail', 'Integration | Component | job detail', {
    integration: true,
    beforeEach: function beforeEach() {
      this.register('service:notification-messages', _ember['default'].Service.extend({}));

      (0, _kueUiClientTestsAssertions.assertionInjector)(this);
    },

    afterEach: function afterEach() {
      (0, _kueUiClientTestsAssertions.assertionCleanup)(this);
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('job', {});

    this.render(_ember['default'].HTMLBars.template({
      'id': 'tbnGdDwG',
      'block': '{"statements":[["append",["helper",["job-detail"],null,[["job"],[["get",["job"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.contains(this.$(), 'active');
  });
});
define('kue-ui-client/tests/integration/components/job-detail/component-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/job-detail/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/job-detail/component-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/integration/components/jobs-filter/component-test', ['exports', 'ember', 'ember-qunit', 'kue-ui-client/tests/assertions'], function (exports, _ember, _emberQunit, _kueUiClientTestsAssertions) {

  (0, _emberQunit.moduleForComponent)('/jobs-filter', 'Integration | Component | jobs filter', {
    integration: true,
    beforeEach: function beforeEach() {
      this.register('service:notification-messages', _ember['default'].Service.extend({}));

      (0, _kueUiClientTestsAssertions.assertionInjector)(this);
    },

    afterEach: function afterEach() {
      (0, _kueUiClientTestsAssertions.assertionCleanup)(this);
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(_ember['default'].HTMLBars.template({
      'id': 'Ug6MpuMS',
      'block': '{"statements":[["append",["unknown",["jobs-filter"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.contains(this.$(), 'Previous');

    // Template block usage:
    this.render(_ember['default'].HTMLBars.template({
      'id': 'fkBvbsuK',
      'block': '{"statements":[["text","\\n"],["block",["jobs-filter"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.contains(this.$(), '← Previous');
  });
});
define('kue-ui-client/tests/integration/components/jobs-filter/component-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/jobs-filter/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/jobs-filter/component-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/integration/components/jobs-paging/component-test', ['exports', 'ember-qunit', 'kue-ui-client/tests/assertions'], function (exports, _emberQunit, _kueUiClientTestsAssertions) {

  (0, _emberQunit.moduleForComponent)('jobs-paging', 'Integration | Component | jobs paging', {
    integration: true,
    beforeEach: function beforeEach() {
      (0, _kueUiClientTestsAssertions.assertionInjector)(this);
    },

    afterEach: function afterEach() {
      (0, _kueUiClientTestsAssertions.assertionCleanup)(this);
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '65frfhnq',
      'block': '{"statements":[["append",["unknown",["jobs-paging"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.contains(this.$(), '← Previous');
  });
});
define('kue-ui-client/tests/integration/components/jobs-paging/component-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/jobs-paging/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/jobs-paging/component-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/integration/components/jobs-table/component-test', ['exports', 'ember-qunit', 'kue-ui-client/tests/assertions'], function (exports, _emberQunit, _kueUiClientTestsAssertions) {

  (0, _emberQunit.moduleForComponent)('jobs-table', 'Integration | Component | jobs table', {
    integration: true,
    beforeEach: function beforeEach() {
      (0, _kueUiClientTestsAssertions.assertionInjector)(this);
    },

    afterEach: function afterEach() {
      (0, _kueUiClientTestsAssertions.assertionCleanup)(this);
    }
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'cHFLaXPd',
      'block': '{"statements":[["append",["unknown",["jobs-table"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.contains(this.$(), 'No results');
  });
});
define('kue-ui-client/tests/integration/components/jobs-table/component-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/jobs-table/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/jobs-table/component-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/integration/components/json-pretty/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('json-pretty', 'Integration | Component | json pretty', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('data', {});

    this.render(Ember.HTMLBars.template({
      'id': 'gQE5WxZy',
      'block': '{"statements":[["append",["helper",["json-pretty"],null,[["data"],[["get",["data"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '{ }');
  });
});
define('kue-ui-client/tests/integration/components/json-pretty/component-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/json-pretty/component-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/json-pretty/component-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/job/model.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | job/model.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'job/model.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/index/controller.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/index/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/index/controller.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/index/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/index/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/index/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/service.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/service.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/service.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/show/controller.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/show/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/show/controller.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/show/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/show/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/show/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/state/controller.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/state/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/state/controller.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/state/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/state/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/state/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/type/controller.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/type/controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/type/controller.js should pass jshint.');
  });
});
define('kue-ui-client/tests/jobs/type/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | jobs/type/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'jobs/type/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/login/route.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | login/route.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'login/route.js should pass jshint.');
  });
});
define('kue-ui-client/tests/models/job-non-model.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/job-non-model.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/job-non-model.js should pass jshint.');
  });
});
define('kue-ui-client/tests/resolver.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('kue-ui-client/tests/router.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('kue-ui-client/tests/state-timebucket/model.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | state-timebucket/model.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'state-timebucket/model.js should pass jshint.');
  });
});
define('kue-ui-client/tests/test-helper', ['exports', 'kue-ui-client/tests/helpers/resolver', 'ember-qunit'], function (exports, _kueUiClientTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_kueUiClientTestsHelpersResolver['default']);
});
define('kue-ui-client/tests/test-helper.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/application/adapter-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('kue-ui-client/tests/unit/application/adapter-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/application/adapter-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/application/adapter-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/components/menu-tabs-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('menu-tabs', 'MenuTabsComponent', {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // appends the component to the page
    this.append();
    assert.equal(component._state, 'inDOM');
  });
});
define('kue-ui-client/tests/unit/components/menu-tabs-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/components/menu-tabs-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/components/menu-tabs-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/components/toggle-arrow-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('toggle-arrow', 'ToggleArrowComponent', {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // appends the component to the page
    this.append();
    assert.equal(component._state, 'inDOM');
  });
});
define('kue-ui-client/tests/unit/components/toggle-arrow-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/components/toggle-arrow-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/components/toggle-arrow-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:jobs/index', 'JobsIndexController', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/index-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/jobs/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/jobs/index-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/show-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:jobs/show', 'JobsShowController', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/show-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/jobs/show-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/jobs/show-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/state-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:jobs/state', 'JobsStateController', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/state-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/jobs/state-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/jobs/state-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/type-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:jobs/type', 'JobsTypeController', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('kue-ui-client/tests/unit/controllers/jobs/type-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/controllers/jobs/type-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/jobs/type-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/job/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('job', 'Unit | Model | job', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('kue-ui-client/tests/unit/job/model-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/job/model-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/job/model-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/jobs/service-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:jobs', 'Unit | Service | jobs', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('kue-ui-client/tests/unit/jobs/service-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/jobs/service-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/jobs/service-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/login/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('kue-ui-client/tests/unit/login/route-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/login/route-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/login/route-test.js should pass jshint.');
  });
});
define('kue-ui-client/tests/unit/routes/index-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:index', 'IndexRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('kue-ui-client/tests/unit/routes/index-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/index-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('kue-ui-client/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map
