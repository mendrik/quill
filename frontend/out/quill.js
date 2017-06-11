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
            'Content-Type': 'application/json'
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
            return ("\n              <navigation class=\"no-grow\"></navigation>\n              <horizontal-split class=\"grow\" id=\"app-split\">\n                <sidebar class=\"v-flex\">\n                  <tree-node-actions></tree-node-actions>\n                  <scroll-pane class=\"grow\">\n                    <aside class=\"menu\">\n                      <p class=\"menu-label\">Structure</p>\n                      <ul class=\"tree-view is-marginless\" {{nodes}}></ul>\n                      <p class=\"menu-label\">Schemas</p>\n                    </aside>\n                  </scroll-pane>\n                </sidebar>\n                <section class=\"v-flex\">\n                  <scroll-pane class=\"grow\">\n                    <content></content>\n                  </scroll-pane>\n                </section>\n              </horizontal-split>\n              <footer class=\"no-grow\"/>\n            ");
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
    var On = feather.event.On;
    var Rest = feather.xhr.Rest;
    var Method = feather.xhr.Method;
    var GestureWidget = feather.ui.events.GestureWidget;
    var setDeepValue = feather.objects.setDeepValue;
    var LoginPage = (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.credentials = {
                email: 'user1@mail.com',
                password: '123456'
            };
            _this.signup = {};
            _this.forgotPassword = {};
            return _this;
        }
        LoginPage.prototype.loginClicked = function () {
            this.doLogin();
        };
        LoginPage.prototype.doLogin = function (token) {
            quill.setToken(token);
            this.route('/');
        };
        LoginPage.prototype.signupClicked = function () {
        };
        LoginPage.prototype.forgotPasswordClicked = function () {
        };
        LoginPage.prototype.textChanged = function (ev, el) {
            var bindTo = ev.target.closest('[bind]').getAttribute('bind');
            setDeepValue(this, bindTo, el.value);
        };
        LoginPage.prototype.loginPage = function () {
            return ("\n            <scroll-pane class=\"grow\">\n            <div class=\"login\">\n                <tabs>\n                  <div class=\"form-components\" title=\"Login\" icon=\"key\" active>\n                    <Text label=\"E-Mail\" placeholder=\"john@freemail.com\" icon=\"envelope-o\" value=\"user1@mail.com\" autofocus bind=\"credentials.email\"></Text>\n                    <Text label=\"Password\" type=\"password\" icon=\"lock\" bind=\"credentials.password\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary login-action\">Login</a>\n                    </div>\n                  </div>\n                  <div class=\"form-components\" title=\"Sign up\" icon=\"pencil-square-o\">\n                    <Text label=\"First name\" placeholder=\"John\" type=\"text\" icon=\"user-o\" bind=\"signup.firstname\"></Text>\n                    <Text label=\"Last name\" placeholder=\"Smith\" type=\"text\" icon=\"user-o\" bind=\"signup.lastname\"></Text>\n                    <Text label=\"E-Mail\" placeholder=\"john@freemail.com\" icon=\"envelope-o\" bind=\"signup.email\"></Text>\n                    <Text label=\"Password\" type=\"text\" icon=\"lock\" bind=\"signup.password\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary signup-action\">Sign up</a>\n                    </div>\n                  </div>\n                  <div class=\"form-components\" title=\"Unlock\" icon=\"unlock\">\n                    <p>\n                        If you have forgotten your password fill in your e-mail below\n                        and we will send you further instructions. If you need\n                        additional help, feel free to contact us at <a href=\"mailto:help@json.services\">help@json.services</a>.\n                    </p>\n                    <Text label=\"Send instrictions to\" placeholder=\"your e-mail\" icon=\"envelope-o\" bind=\"forgotPassword.email\"></Text>\n                    <div class=\"block has-text-right\">\n                         <a class=\"button is-primary forgotpassword-action\">Request</a>\n                    </div>\n                  </div>\n              </tabs>\n            </div>\n            </scroll-pane>\n            ");
        };
        return LoginPage;
    }(GestureWidget));
    __decorate([
        On({ event: 'tap', selector: '.login-action' })
    ], LoginPage.prototype, "loginClicked", null);
    __decorate([
        Rest({ url: '/signin', method: Method.POST, body: 'credentials', headers: quill.headers })
    ], LoginPage.prototype, "doLogin", null);
    __decorate([
        On({ event: 'tap', selector: '.signup-action' })
    ], LoginPage.prototype, "signupClicked", null);
    __decorate([
        On({ event: 'tap', selector: '.forgotpassword-action' })
    ], LoginPage.prototype, "forgotPasswordClicked", null);
    __decorate([
        On({ event: 'textchange', selector: 'input' })
    ], LoginPage.prototype, "textChanged", null);
    __decorate([
        Template()
    ], LoginPage.prototype, "loginPage", null);
    quill.LoginPage = LoginPage;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var On = feather.event.On;
    var GestureWidget = feather.ui.events.GestureWidget;
    var addMultipleEventListeners = feather.ui.events.addMultipleEventListeners;
    var removeMultipleEventListeners = feather.ui.events.removeMultipleEventListeners;
    var tapEvents = feather.ui.events.tapEvents;
    var Rest = feather.xhr.Rest;
    var Method = feather.xhr.Method;
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            var _this = _super.call(this) || this;
            _this.closeHandler = _this.closeHandler.bind(_this);
            return _this;
        }
        Navigation.prototype.init = function () {
            this.userName = quill.findParentValue(this, 'user').name;
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
        Navigation.prototype.doLogout = function (resp) {
            quill.removeToken();
            this.route('/login');
        };
        Navigation.prototype.markup = function () {
            return ("\n            <nav class=\"nav\">\n              <div class=\"nav-left\">\n                <a class=\"nav-item\" href=\"/\" id=\"logo\">Quill</a>\n              </div>\n              <span class=\"nav-toggle\">\n                <span></span>\n                <span></span>\n                <span></span>\n              </span>\n              <div class=\"nav-right nav-menu\">\n                <a class=\"nav-item logout\">Logout ({{userName}})</a>\n                <a class=\"nav-item\">Documentation</a>\n                <div  class=\"nav-item\">\n                    <p class=\"control has-icons-right\" id=\"search\">\n                      <input class=\"input\" type=\"text\" placeholder=\"Search...\">\n                      <span class=\"icon is-right\">\n                        <i class=\"fa fa-search\"></i>\n                      </span>\n                    </p>\n                </div>\n              </div>\n            </nav>\n            ");
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
        Rest({ url: '/signout', method: Method.POST, body: 'credentials', headers: quill.headers })
    ], Navigation.prototype, "doLogout", null);
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
            this.render();
        };
        QuillApplication.prototype.checkLogin = function (resp) {
            var code = resp.code;
            if (code) {
                this.route('/login');
            }
            else {
                this.user = resp;
                this.route("/project/1");
            }
        };
        QuillApplication.prototype.xhrFailure = function (err, xhr) {
            if (xhr.status === 401) {
                this.route('/login');
            }
            else {
                this.genericFetchError(err, xhr);
            }
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
        QuillApplication.prototype.homePage = function () {
            this.checkLogin();
        };
        QuillApplication.prototype.applicationHTML = function () {
            return ("<panel class=\"fullscreen v-flex\" {{pages}}></panel>");
        };
        return QuillApplication;
    }(Widget));
    __decorate([
        Bind()
    ], QuillApplication.prototype, "pages", void 0);
    __decorate([
        Rest({ url: '/account', headers: quill.headers })
    ], QuillApplication.prototype, "checkLogin", null);
    __decorate([
        Subscribe('xhr-failure')
    ], QuillApplication.prototype, "xhrFailure", null);
    __decorate([
        Route('/project/:id')
    ], QuillApplication.prototype, "projectPage", null);
    __decorate([
        Route('/login')
    ], QuillApplication.prototype, "loginPage", null);
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