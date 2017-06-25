var quill;
(function (quill) {
    var Keys;
    (function (Keys) {
        Keys[Keys["ENTER"] = 13] = "ENTER";
    })(Keys = quill.Keys || (quill.Keys = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    quill.findParentValue = function (widget, key) {
        var parent = widget, val;
        while (typeof (parent = parent.parentWidget) !== 'undefined') {
            val = parent[key];
            if (typeof val !== 'undefined') {
                return val;
            }
        }
    };
})(quill || (quill = {}));
var quill;
(function (quill) {
    var AUTH_HEADER = 'X-Auth-Token';
    quill.headers = (_a = {
            'X-Api-Key': 'AbCdEfGhIjK1',
            'Content-Type': 'application/json',
            'Accept-Language': 'en_IE.UTF-8'
        },
        _a[AUTH_HEADER] = localStorage.getItem(AUTH_HEADER),
        _a);
    quill.setToken = function (token) {
        localStorage.setItem(AUTH_HEADER, token.token);
        quill.headers[AUTH_HEADER] = token.token;
    };
    quill.removeToken = function () {
        localStorage.removeItem(AUTH_HEADER);
        quill.headers[AUTH_HEADER] = undefined;
    };
    var _a;
})(quill || (quill = {}));
var _this = this;
if (window['Element'] && !Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var matches = (_this.document || _this.ownerDocument).querySelectorAll(s), i, el = _this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) { }
        } while ((i < 0) && (el = el.parentElement));
        return el;
    };
}
var quill;
(function (quill) {
    var Widget = feather.core.Widget;
    var Construct = feather.annotations.Construct;
    var Bind = feather.observe.Bind;
    var Template = feather.annotations.Template;
    var Progress = Progress_1 = (function (_super) {
        __extends(Progress, _super);
        function Progress() {
            var _this = _super.call(this) || this;
            _this.fetching = false;
            _this.runningClass = function (running) { return running ? 'running' : undefined; };
            Progress_1.instance = _this;
            return _this;
        }
        Progress.prototype.init = function () {
            this.render();
        };
        Progress.prototype.markup = function () {
            return '<div class="progress-runner {{fetching:runningClass}}"></div>';
        };
        Progress.start = function () {
            Progress_1.instance.fetching = true;
        };
        Progress.stop = function () {
            Progress_1.instance.fetching = false;
        };
        return Progress;
    }(Widget));
    __decorate([
        Bind()
    ], Progress.prototype, "fetching", void 0);
    __decorate([
        Template()
    ], Progress.prototype, "markup", null);
    Progress = Progress_1 = __decorate([
        Construct({ selector: 'progress-bar' })
    ], Progress);
    quill.Progress = Progress;
    var Progress_1;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var components;
    (function (components) {
        var Widget = feather.core.Widget;
        var Construct = feather.annotations.Construct;
        var Template = feather.annotations.Template;
        var Bind = feather.observe.Bind;
        var Translate = Translate_1 = (function (_super) {
            __extends(Translate, _super);
            function Translate(key) {
                var _this = _super.call(this) || this;
                _this.translated = function (key) { return Translate_1.translations[key]; };
                _this.key = key;
                return _this;
            }
            Translate.prototype.init = function () {
                this.render();
            };
            Translate.prototype.text = function () {
                return '<span>{{key:translated}}</span>';
            };
            return Translate;
        }(Widget));
        Translate.translate = function (text) { return text.replace(/•([A-Z\.\-_]+)/gi, function (m, g) {
            var translations = Translate_1.translations || {};
            return translations[g] || g;
        }); };
        __decorate([
            Bind({ html: true })
        ], Translate.prototype, "key", void 0);
        __decorate([
            Template()
        ], Translate.prototype, "text", null);
        Translate = Translate_1 = __decorate([
            Construct({ selector: 'translate', attributes: ['key'] })
        ], Translate);
        components.Translate = Translate;
        var Translate_1;
    })(components = quill.components || (quill.components = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var components;
    (function (components) {
        var GestureWidget = feather.ui.events.GestureWidget;
        var Theme = feather.ui.toast.Theme;
        var setDeepValue = feather.objects.setDeepValue;
        var ToastManager = feather.ui.toast.ToastManager;
        var Toast = feather.ui.toast.Toast;
        var Subscribe = feather.hub.Subscribe;
        var On = feather.event.On;
        var AjaxForm = (function (_super) {
            __extends(AjaxForm, _super);
            function AjaxForm() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.translated = function (key) { return components.Translate.translations[key]; };
                return _this;
            }
            AjaxForm.prototype.validationFailed = function (err, xhr) {
                var _this = this;
                quill.Progress.stop();
                var messages = err.errors.map(function (e) {
                    if (e.type === 'validation') {
                        _this.triggerDown('field-error', e.title);
                    }
                    return e.message;
                });
                if (err.errors.length) {
                    var errorType = err.errors[0].title.split(".").shift();
                    ToastManager.showToast(new Toast(components.Translate.translations["ui." + errorType + ".failed"], messages, Theme.Warning));
                }
            };
            AjaxForm.prototype.requestFailed = function (err, xhr) {
                quill.Progress.stop();
                ToastManager.showToast(new Toast(components.Translate.translations["ui.error.server"], err.errors[0].message, Theme.Error));
            };
            AjaxForm.prototype.timeout = function (err, xhr) {
                quill.Progress.stop();
                ToastManager.showToast(new Toast(components.Translate.translations["ui.error.timeout"], components.Translate.translations["ui.error.timeout.message"], Theme.Error));
            };
            AjaxForm.prototype.textChanged = function (ev, el) {
                var closest = ev.target.closest('[bind]');
                if (closest) {
                    setDeepValue(this, closest.getAttribute('bind'), el.value);
                }
            };
            return AjaxForm;
        }(GestureWidget));
        __decorate([
            Subscribe('xhr-failure-400')
        ], AjaxForm.prototype, "validationFailed", null);
        __decorate([
            Subscribe('xhr-failure-500')
        ], AjaxForm.prototype, "requestFailed", null);
        __decorate([
            Subscribe('xhr-failure-timeout')
        ], AjaxForm.prototype, "timeout", null);
        __decorate([
            On({ event: 'textchange', selector: 'input' })
        ], AjaxForm.prototype, "textChanged", null);
        components.AjaxForm = AjaxForm;
    })(components = quill.components || (quill.components = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Widget = feather.core.Widget;
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var Subscribe = feather.hub.Subscribe;
    var TreeNode = feather.ui.tree.TreeNode;
    var ProjectPage = (function (_super) {
        __extends(ProjectPage, _super);
        function ProjectPage(projectId) {
            var _this = _super.call(this) || this;
            _this.nodes = [];
            _this.projectId = projectId;
            return _this;
        }
        ProjectPage.prototype.init = function () {
            var animals = new TreeNode('Animals', {}), cats = new TreeNode('Cats', {}), dogs = new TreeNode('Dogs', {}), birds = new TreeNode('Birds', {}), fish = new TreeNode('Fish', {});
            var lion = new TreeNode('Lion', {}), tiger = new TreeNode('Tiger', {}), cheetah = new TreeNode('Cheetah', {}), leopard = new TreeNode('Leopard', {});
            var cars = new TreeNode('Cars', {}), merc = new TreeNode('Mercedes', {}), bmw = new TreeNode('BMW', {}), audi = new TreeNode('Audi', {}), porsche = new TreeNode('Porsche', {});
            var p911 = new TreeNode('911', {}), p911t = new TreeNode('911 Turbo', {}), p911ts = new TreeNode('911 Turbo S', {});
            p911t.push(p911ts);
            p911.push(p911t);
            porsche.push(p911);
            cats.push(lion, tiger, cheetah, leopard);
            animals.push(cats, dogs, birds, fish);
            cars.push(merc, porsche, bmw, audi);
            this.nodes.push(animals, cars);
        };
        ProjectPage.prototype.nodeSelected = function (node) {
            this.triggerDown('deselect-other-nodes', node);
        };
        ProjectPage.prototype.projectPage = function () {
            return ("\n              <panel class=\"fullscreen v-flex\">  \n                  <navigation class=\"no-grow\"></navigation>\n                  <horizontal-split class=\"grow\" id=\"app-split\">\n                    <sidebar class=\"v-flex\">\n                      <tree-actions></tree-actions>\n                      <scroll-pane class=\"grow\">\n                        <aside class=\"menu\">\n                          <p class=\"menu-label\">Structure</p>\n                          <ul class=\"tree-view is-marginless\" {{nodes}}></ul>\n                          <p class=\"menu-label\">Schemas</p>\n                        </aside>\n                      </scroll-pane>\n                    </sidebar>\n                    <section class=\"v-flex\">\n                      <scroll-pane class=\"grow\">\n                      </scroll-pane>\n                    </section>\n                  </horizontal-split>\n                  <footer class=\"no-grow\"/>\n              </panel>\n            ");
        };
        return ProjectPage;
    }(Widget));
    __decorate([
        Bind()
    ], ProjectPage.prototype, "nodes", void 0);
    __decorate([
        Subscribe('node-selected')
    ], ProjectPage.prototype, "nodeSelected", null);
    __decorate([
        Template()
    ], ProjectPage.prototype, "projectPage", null);
    quill.ProjectPage = ProjectPage;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var Subscribe = feather.hub.Subscribe;
    var On = feather.event.On;
    var Rest = feather.xhr.Rest;
    var Method = feather.xhr.Method;
    var Theme = feather.ui.toast.Theme;
    var AjaxForm = quill.components.AjaxForm;
    var Translate = quill.components.Translate;
    var Toast = feather.ui.toast.Toast;
    var ToastManager = feather.ui.toast.ToastManager;
    var Scope = feather.event.Scope;
    var LoginPage = (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.credentials = {};
            _this.signup = {};
            _this.forgotPassword = {};
            _this.forgotPasswordInfo = 'forgot-password.info';
            return _this;
        }
        LoginPage.prototype.loginClicked = function () {
            quill.Progress.start();
            this.doLogin();
        };
        LoginPage.prototype.pressedEnter = function (ev) {
            if (ev.keyCode === quill.Keys.ENTER) {
                quill.Progress.start();
                this.doLogin();
            }
        };
        LoginPage.prototype.doLogin = function (token) {
            quill.setToken(token);
            this.route('/');
            quill.Progress.stop();
        };
        LoginPage.prototype.unauthorized = function (err, xhr) {
            quill.Progress.stop();
            ToastManager.showToast(new Toast(err.errors[0].title, err.errors[0].message, Theme.Error));
        };
        LoginPage.prototype.signupClicked = function () {
            this.triggerDown('field-error-clear');
            quill.Progress.start();
            this.doSignup();
        };
        LoginPage.prototype.doSignup = function (token) {
            quill.setToken(token);
            quill.Progress.stop();
            this.route('/');
        };
        LoginPage.prototype.forgotPasswordClicked = function () {
            quill.Progress.start();
            this.requestPasswordChange();
        };
        LoginPage.prototype.requestPasswordChange = function () {
            quill.Progress.stop();
            var title = Translate.translations['ui.forgot-password.email-sent'];
            var message = Translate.translations['ui.forgot-password.email-sent.message'];
            ToastManager.showToast(new Toast(title, message, Theme.Info));
            this.route('/login');
        };
        LoginPage.prototype.loginPage = function () {
            return Translate.translate("\n            <scroll-pane class=\"grow\">\n            <div class=\"login\">\n                <tabs>\n                  <div class=\"form-components\" title=\"\u2022ui.login.tabs.login\" icon=\"key\" active>\n                    <Text label=\"\u2022ui.signin.identifier\" name=\"signin.identifier\" placeholder=\"john@freemail.com\" icon=\"envelope-o\" autofocus bind=\"credentials.identifier\"></Text>\n                    <Text label=\"\u2022ui.signin.password\" name=\"signin.password\" type=\"password\" icon=\"lock\" bind=\"credentials.password\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary login-action\">\u2022ui.signin.button</a>\n                    </div>\n                  </div>\n                  <div class=\"form-components\" title=\"\u2022ui.login.tabs.signup\" icon=\"pencil-square-o\">\n                    <Text label=\"\u2022ui.signup.firstname\" name=\"signup.firstname\" placeholder=\"John\" type=\"text\" icon=\"user-o\" bind=\"signup.firstname\"></Text>\n                    <Text label=\"\u2022ui.signup.lastname\" name=\"signup.lastname\" placeholder=\"Smith\" type=\"text\" icon=\"user-o\" bind=\"signup.lastname\"></Text>\n                    <Text label=\"\u2022ui.signup.email\" name=\"signup.email\" placeholder=\"john@freemail.com\" icon=\"envelope-o\" bind=\"signup.email\"></Text>\n                    <Text label=\"\u2022ui.signup.password\" name=\"signup.password\" type=\"text\" icon=\"lock\" bind=\"signup.password\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary signup-action\">\u2022ui.signup.button</a>\n                    </div>\n                  </div>\n                  <div class=\"form-components\" title=\"\u2022ui.login.tabs.forgot-password\" icon=\"unlock\">\n                    <p><Translate key=\"ui.forgot-password.info\"/></p>\n                    <Text label=\"\u2022ui.forgot-password.email\" name=\"forgot-password.email\"  placeholder=\"\u2022ui.forgot-password.email.placeholder\" icon=\"envelope-o\" bind=\"forgotPassword.identifier\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary forgot-password-action\">\u2022ui.forgot-password.button</a>\n                    </div>\n                  </div>\n              </tabs>\n            </div>\n            </scroll-pane>\n            ");
        };
        return LoginPage;
    }(AjaxForm));
    __decorate([
        Bind()
    ], LoginPage.prototype, "forgotPasswordInfo", void 0);
    __decorate([
        On({ event: 'tap', selector: '.login-action' })
    ], LoginPage.prototype, "loginClicked", null);
    __decorate([
        On({ event: 'keypress', selector: 'input[type="password"]', scope: Scope.Direct })
    ], LoginPage.prototype, "pressedEnter", null);
    __decorate([
        Rest({ url: '/signin', method: Method.POST, body: 'credentials', headers: quill.headers })
    ], LoginPage.prototype, "doLogin", null);
    __decorate([
        Subscribe('xhr-failure-401')
    ], LoginPage.prototype, "unauthorized", null);
    __decorate([
        On({ event: 'tap', selector: '.signup-action' })
    ], LoginPage.prototype, "signupClicked", null);
    __decorate([
        Rest({ url: '/signup', method: Method.POST, body: 'signup', headers: quill.headers })
    ], LoginPage.prototype, "doSignup", null);
    __decorate([
        On({ event: 'tap', selector: '.forgot-password-action' })
    ], LoginPage.prototype, "forgotPasswordClicked", null);
    __decorate([
        Rest({ url: '/account', method: Method.PUT, body: 'forgotPassword', headers: quill.headers })
    ], LoginPage.prototype, "requestPasswordChange", null);
    __decorate([
        Template('default', false)
    ], LoginPage.prototype, "loginPage", null);
    quill.LoginPage = LoginPage;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var On = feather.event.On;
    var Rest = feather.xhr.Rest;
    var Method = feather.xhr.Method;
    var AjaxForm = quill.components.AjaxForm;
    var Translate = quill.components.Translate;
    var PassordChangePage = (function (_super) {
        __extends(PassordChangePage, _super);
        function PassordChangePage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.newPassword = {};
            _this.changePasswordInfo = 'ui.change-password.info';
            return _this;
        }
        PassordChangePage.prototype.submitClicked = function () {
            quill.Progress.start();
            this.doPasswordChange();
        };
        PassordChangePage.prototype.doPasswordChange = function () {
            quill.Progress.stop();
            this.route('/');
        };
        PassordChangePage.prototype.loginPage = function () {
            return Translate.translate("\n            <scroll-pane class=\"grow\">\n                <div class=\"change-password\">\n                  <p><Translate key=\"ui.change-password.info\"/></p>\n                  <div class=\"form-components\">\n                    <Text label=\"\u2022ui.change-password.password\" \n                          name=\"change-password.password\" \n                          placeholder=\"\u2022ui.change-password.placeholder\" \n                          type=\"password\" \n                          icon=\"lock\" \n                          autofocus \n                          bind=\"newPassword.password\"></Text>\n                    <Text label=\"\u2022ui.change-password.password-repeat\" \n                          name=\"change-password.password-repeat\" \n                          type=\"password\" \n                          icon=\"lock\" \n                          bind=\"newPassword.passwordRepeat\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary change-action\">\u2022ui.change-password.button</a>\n                    </div>\n                  </div>\n                </div>\n            </scroll-pane>\n            ");
        };
        return PassordChangePage;
    }(AjaxForm));
    __decorate([
        Bind()
    ], PassordChangePage.prototype, "changePasswordInfo", void 0);
    __decorate([
        On({ event: 'tap', selector: '.change-action' })
    ], PassordChangePage.prototype, "submitClicked", null);
    __decorate([
        Rest({ url: '/account/password', method: Method.PUT, body: 'newPassword', headers: quill.headers })
    ], PassordChangePage.prototype, "doPasswordChange", null);
    __decorate([
        Template('default', false)
    ], PassordChangePage.prototype, "loginPage", null);
    quill.PassordChangePage = PassordChangePage;
})(quill || (quill = {}));
var feather;
(function (feather) {
    var ui;
    (function (ui) {
        var Widget = feather.core.Widget;
        var Construct = feather.annotations.Construct;
        var Template = feather.annotations.Template;
        var Bind = feather.observe.Bind;
        var Subscribe = feather.hub.Subscribe;
        var TreeActions = (function (_super) {
            __extends(TreeActions, _super);
            function TreeActions() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.disabled = true;
                return _this;
            }
            TreeActions.prototype.init = function () {
                this.render();
            };
            TreeActions.prototype.nodeSelected = function (node) {
                this.disabled = false;
            };
            TreeActions.prototype.markup = function () {
                return ("\n              <div class=\"level is-mobile is-marginless\">\n                <div class=\"level-left\">\n                   <div class=\"inline toggler\">\n                      <a class=\"button is-small\"><Icon name=\"plus\"></Icon></a>\n                      <div class=\"block form-components create-node toggle open-in-view\">\n                         <Text label=\"Name\"></Text>\n                         <div class=\"block has-text-right\">\n                            <a class=\"button\">Cancel</a>\n                            <a class=\"button is-primary\">Create</a>\n                         </div>\n                      </div>\n                   </div>\n                   <a class=\"button is-small\" {{disabled}}><Icon name=\"lock\"/></a>\n                   <a class=\"button is-small\" {{disabled}}><Icon name=\"cut\"/></a>\n                   <a class=\"button is-small\" {{disabled}}><Icon name=\"paste\"/></a>\n                </div>\n                <div class=\"level-right\">\n                   <a class=\"button is-small\" {{disabled}}><Icon name=\"trash-o\"/></a>\n                </div>\n              </div>\n            ");
            };
            return TreeActions;
        }(Widget));
        __decorate([
            Bind()
        ], TreeActions.prototype, "disabled", void 0);
        __decorate([
            Subscribe('deselect-other-nodes')
        ], TreeActions.prototype, "nodeSelected", null);
        __decorate([
            Template()
        ], TreeActions.prototype, "markup", null);
        TreeActions = __decorate([
            Construct({ selector: 'tree-actions' })
        ], TreeActions);
        ui.TreeActions = TreeActions;
    })(ui = feather.ui || (feather.ui = {}));
})(feather || (feather = {}));
var quill;
(function (quill) {
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var On = feather.event.On;
    var GestureWidget = feather.ui.events.GestureWidget;
    var Subscribe = feather.hub.Subscribe;
    var addMultipleEventListeners = feather.ui.events.addMultipleEventListeners;
    var removeMultipleEventListeners = feather.ui.events.removeMultipleEventListeners;
    var tapEvents = feather.ui.events.tapEvents;
    var Rest = feather.xhr.Rest;
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            var _this = _super.call(this) || this;
            _this.closeHandler = _this.closeHandler.bind(_this);
            return _this;
        }
        Navigation.prototype.init = function () {
            this.userName = quill.findParentValue(this, 'user').firstname;
            this.render();
        };
        Navigation.prototype.toggle = function (ev, el) {
            this.toggleActiveState();
            if (el.classList.contains('is-active')) {
                addMultipleEventListeners(tapEvents, document, this.closeHandler);
            }
            else {
                removeMultipleEventListeners(tapEvents, document, this.closeHandler);
            }
        };
        Navigation.prototype.closeHandler = function (ev) {
            var el = this.element;
            if (!el.contains(ev.target)) {
                this.toggleActiveState();
                removeMultipleEventListeners(tapEvents, document, this.closeHandler);
            }
        };
        Navigation.prototype.toggleActiveState = function () {
            var el = this.element.querySelector('.nav-toggle');
            el.classList.toggle('is-active');
            el.nextElementSibling.classList.toggle('is-active');
        };
        Navigation.prototype.logoutClicked = function () {
            this.doLogout();
        };
        Navigation.prototype.doLogout = function () {
            quill.removeToken();
            this.route('/login');
        };
        Navigation.prototype.logoutFailed = function () {
            quill.removeToken();
            this.route('/login');
        };
        Navigation.prototype.markup = function () {
            return ("\n            <nav class=\"nav\">\n              <div class=\"nav-left\">\n                <a class=\"nav-item\" href=\"/\" id=\"logo\">\n                    <img src=\"/assets/images/quill.svg\" alt=\"Quill Logo\">\n                    Quill\n                </a>\n              </div>\n              <span class=\"nav-toggle\">\n                <span></span>\n                <span></span>\n                <span></span>\n              </span>\n              <div class=\"nav-right nav-menu\">\n                <a class=\"nav-item logout\">Logout ({{userName}})</a>\n                <a class=\"nav-item\">Documentation</a>\n                <div  class=\"nav-item\">\n                    <p class=\"control has-icons-right\" id=\"search\">\n                      <input class=\"input\" type=\"text\" placeholder=\"Search...\">\n                      <Icon name=\"search\" align-right=\"right\"></Icon>\n                    </p>\n                </div>\n              </div>\n            </nav>\n            ");
        };
        return Navigation;
    }(GestureWidget));
    __decorate([
        Bind()
    ], Navigation.prototype, "userName", void 0);
    __decorate([
        On({ event: 'tap', selector: '.nav-toggle' })
    ], Navigation.prototype, "toggle", null);
    __decorate([
        On({ event: 'tap', selector: 'a.logout' })
    ], Navigation.prototype, "logoutClicked", null);
    __decorate([
        Rest({ url: '/signout', headers: quill.headers })
    ], Navigation.prototype, "doLogout", null);
    __decorate([
        Subscribe('xhr-failure')
    ], Navigation.prototype, "logoutFailed", null);
    __decorate([
        Template()
    ], Navigation.prototype, "markup", null);
    Navigation = __decorate([
        Construct({ selector: 'navigation' })
    ], Navigation);
    quill.Navigation = Navigation;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
    var GestureWidget = feather.ui.events.GestureWidget;
    var Content = (function (_super) {
        __extends(Content, _super);
        function Content() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Content.prototype.init = function () {
            this.render();
        };
        Content.prototype.markup = function () {
            return '';
        };
        return Content;
    }(GestureWidget));
    __decorate([
        Template()
    ], Content.prototype, "markup", null);
    Content = __decorate([
        Construct({ selector: 'content' })
    ], Content);
    quill.Content = Content;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Widget = feather.core.Widget;
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var Route = feather.routing.Route;
    var Subscribe = feather.hub.Subscribe;
    var Rest = feather.xhr.Rest;
    var ToastManager = feather.ui.toast.ToastManager;
    var Toast = feather.ui.toast.Toast;
    var Theme = feather.ui.toast.Theme;
    var QuillApplication = (function (_super) {
        __extends(QuillApplication, _super);
        function QuillApplication() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pages = [];
            return _this;
        }
        QuillApplication.prototype.init = function () {
            this.fetchTranslations();
        };
        QuillApplication.prototype.fetchTranslations = function (translations) {
            quill.components.Translate.translations = translations.messages.reduce(function (p, c) {
                return (__assign({}, p, (_a = {}, _a[c.key] = c.value, _a)));
                var _a;
            }, {});
            this.render();
        };
        QuillApplication.prototype.checkLogin = function (resp) {
            this.user = resp;
            this.route("/project/1");
        };
        QuillApplication.prototype.unauthorized = function () {
            this.route('/login');
        };
        QuillApplication.prototype.genericFetchError = function (err, xhr) {
            ToastManager.showToast(new Toast('API request has failed', err, Theme.Error));
        };
        QuillApplication.prototype.projectPage = function (params) {
            if (!this.user) {
                this.checkLogin();
            }
            else {
                this.pages.splice(0, 1, new quill.ProjectPage(params.id));
            }
        };
        QuillApplication.prototype.loginPage = function () {
            this.pages.splice(0, 1, new quill.LoginPage());
        };
        QuillApplication.prototype.changePasswordPage = function () {
            this.pages.splice(0, 1, new quill.PassordChangePage());
        };
        QuillApplication.prototype.homePage = function () {
            this.checkLogin();
        };
        QuillApplication.prototype.applicationHTML = function () {
            return ("<progress-bar></progress-bar><panel class=\"fullscreen v-flex\" {{pages}}></panel>");
        };
        return QuillApplication;
    }(Widget));
    __decorate([
        Bind()
    ], QuillApplication.prototype, "pages", void 0);
    __decorate([
        Rest({ url: '/translations', headers: quill.headers })
    ], QuillApplication.prototype, "fetchTranslations", null);
    __decorate([
        Rest({ url: '/account', headers: quill.headers })
    ], QuillApplication.prototype, "checkLogin", null);
    __decorate([
        Subscribe('xhr-failure-401')
    ], QuillApplication.prototype, "unauthorized", null);
    __decorate([
        Route('/project/:id')
    ], QuillApplication.prototype, "projectPage", null);
    __decorate([
        Route('/login')
    ], QuillApplication.prototype, "loginPage", null);
    __decorate([
        Route('/changepassword')
    ], QuillApplication.prototype, "changePasswordPage", null);
    __decorate([
        Route('/')
    ], QuillApplication.prototype, "homePage", null);
    __decorate([
        Template()
    ], QuillApplication.prototype, "applicationHTML", null);
    QuillApplication = __decorate([
        Construct({ selector: 'body.quill-app' })
    ], QuillApplication);
    quill.QuillApplication = QuillApplication;
})(quill || (quill = {}));
feather.start();
//# sourceMappingURL=quill.js.map