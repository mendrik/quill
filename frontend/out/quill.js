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
            this.render();
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
    var Widget = feather.core.Widget;
    var Template = feather.annotations.Template;
    var LoginPage = (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoginPage.prototype.init = function () {
            this.render();
        };
        LoginPage.prototype.projectPage = function () {
            return ("\n                Login\n            ");
        };
        return LoginPage;
    }(Widget));
    __decorate([
        Template()
    ], LoginPage.prototype, "projectPage", null);
    quill.LoginPage = LoginPage;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
    var On = feather.event.On;
    var GestureWidget = feather.ui.events.GestureWidget;
    var addMultipleEventListeners = feather.ui.events.addMultipleEventListeners;
    var removeMultipleEventListeners = feather.ui.events.removeMultipleEventListeners;
    var tapEvents = feather.ui.events.tapEvents;
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            var _this = _super.call(this) || this;
            _this.closeHandler = _this.closeHandler.bind(_this);
            return _this;
        }
        Navigation.prototype.init = function () {
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
        Navigation.prototype.markup = function () {
            return ("\n            <nav class=\"nav\">\n              <div class=\"nav-left\">\n                <a class=\"nav-item\" href=\"/\" id=\"logo\">\n                  Quill\n                </a>\n              </div>\n              <span class=\"nav-toggle\">\n                <span></span>\n                <span></span>\n                <span></span>\n              </span>\n              <div class=\"nav-right nav-menu\">\n                <a class=\"nav-item\">\n                  Home\n                </a>\n                <a class=\"nav-item\">\n                  Documentation\n                </a>\n                <a class=\"nav-item\">\n                  Blog\n                </a>\n                <div  class=\"nav-item\">\n                    <p class=\"control has-icons-right\" id=\"search\">\n                      <input class=\"input\" type=\"text\" placeholder=\"Search...\">\n                      <span class=\"icon is-right\">\n                        <i class=\"fa fa-search\"></i>\n                      </span>\n                    </p>\n                </div>\n              </div>\n            </nav>\n            ");
        };
        return Navigation;
    }(GestureWidget));
    __decorate([
        On({ event: 'tap', selector: '.nav-toggle' })
    ], Navigation.prototype, "toggle", null);
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
    var QuillApplication = QuillApplication_1 = (function (_super) {
        __extends(QuillApplication, _super);
        function QuillApplication() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pages = [];
            return _this;
        }
        QuillApplication.prototype.init = function () {
            this.render();
            this.checkLogin();
        };
        QuillApplication.prototype.checkLogin = function (resp) {
            var code = resp.code;
            if (code) {
                this.route('/login');
            }
            else {
                this.user = resp;
                this.route('/project');
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
        };
        QuillApplication.prototype.projectPage = function (params) {
            this.pages.splice(0, 1, new quill.ProjectPage(params.id));
        };
        QuillApplication.prototype.loginPage = function () {
            this.pages.splice(0, 1, new quill.LoginPage());
        };
        QuillApplication.prototype.applicationHTML = function () {
            return ("<panel class=\"fullscreen v-flex\" {{pages}}></panel>");
        };
        return QuillApplication;
    }(Widget));
    QuillApplication.Headers = {
        'X-Api-Key': undefined
    };
    __decorate([
        Bind()
    ], QuillApplication.prototype, "pages", void 0);
    __decorate([
        Rest({ url: '/account', headers: QuillApplication_1.Headers })
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
        Template()
    ], QuillApplication.prototype, "applicationHTML", null);
    QuillApplication = QuillApplication_1 = __decorate([
        Construct({ selector: 'body.quill-app' })
    ], QuillApplication);
    quill.QuillApplication = QuillApplication;
    var QuillApplication_1;
})(quill || (quill = {}));
feather.start();
//# sourceMappingURL=quill.js.map