var quill;
(function (quill) {
    var Keys;
    (function (Keys) {
        Keys[Keys["ENTER"] = 13] = "ENTER";
    })(Keys = quill.Keys || (quill.Keys = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var TreeNodeIcon = feather.ui.tree.TreeNodeIcon;
    var urlParams = {};
    var popstate = function () {
        var pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) {
            return decodeURIComponent(s.replace(pl, ' '));
        }, query = window.location.search.substring(1);
        var match;
        while (match = search.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
    };
    window.addEventListener('popstate', popstate);
    popstate();
    quill.getQueryStringParam = function (key) { return urlParams[key]; };
    quill.iconFor = function (type) {
        switch (type) {
            case 'string':
                return TreeNodeIcon.text;
            case 'number':
                return TreeNodeIcon.number;
            case 'enum':
                return TreeNodeIcon.enum;
            case 'list':
                return TreeNodeIcon.array;
            case 'node':
                return TreeNodeIcon.object;
            case 'boolean':
                return TreeNodeIcon.boolean;
        }
    };
    quill.flattenTree = function (node) {
        return (_a = [node]).concat.apply(_a, node.children.map(quill.flattenTree));
        var _a;
    };
})(quill || (quill = {}));
var quill;
(function (quill) {
    var AUTH_HEADER = 'X-Auth-Token';
    quill.headers = (_a = {
            'X-Api-Key': 'AbCdEfGhIjK1',
            'Content-Type': 'application/json',
            'Accept-Language': 'en'
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
        var matches = (_this.document || _this.ownerDocument).querySelectorAll(s);
        var i, el = _this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {
            }
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
    var Translate = (function (_super) {
        __extends(Translate, _super);
        function Translate(key) {
            var _this = _super.call(this) || this;
            _this.key = key;
            return _this;
        }
        Translate.prototype.init = function (element) {
            element.classList.remove('key');
            this.render();
        };
        Translate.prototype.markup = function () {
            return "{{key:translate}}";
        };
        __decorate([
            Bind()
        ], Translate.prototype, "key", void 0);
        __decorate([
            Template()
        ], Translate.prototype, "markup", null);
        Translate = __decorate([
            Construct({ selector: '[key]', attributes: ['key'] })
        ], Translate);
        return Translate;
    }(Widget));
    quill.Translate = Translate;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Widget = feather.core.Widget;
    var Construct = feather.annotations.Construct;
    var Bind = feather.observe.Bind;
    var Template = feather.annotations.Template;
    var Progress = (function (_super) {
        __extends(Progress, _super);
        function Progress() {
            var _this = _super.call(this) || this;
            _this.fetching = false;
            _this.runningClass = function (running) { return running ? 'running' : undefined; };
            Progress_1.instance = _this;
            return _this;
        }
        Progress_1 = Progress;
        Progress.prototype.init = function () {
            this.render();
        };
        Progress.prototype.markup = function () {
            return "<div class=\"progress-runner {{fetching:runningClass}}\"></div>";
        };
        Progress.start = function () {
            Progress_1.instance.fetching = true;
        };
        Progress.stop = function () {
            Progress_1.instance.fetching = false;
        };
        __decorate([
            Bind()
        ], Progress.prototype, "fetching", void 0);
        __decorate([
            Template()
        ], Progress.prototype, "markup", null);
        Progress = Progress_1 = __decorate([
            Construct({ selector: 'progress-bar' })
        ], Progress);
        return Progress;
        var Progress_1;
    }(Widget));
    quill.Progress = Progress;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var components;
    (function (components) {
        var Widget = feather.core.Widget;
        var Construct = feather.annotations.Construct;
        var Template = feather.annotations.Template;
        var Bind = feather.observe.Bind;
        var HtmlFragment = (function (_super) {
            __extends(HtmlFragment, _super);
            function HtmlFragment(key) {
                var _this = _super.call(this) || this;
                _this.key = key;
                return _this;
            }
            HtmlFragment.prototype.init = function (element) {
                element.classList.remove('html-key');
                this.render();
            };
            HtmlFragment.prototype.text = function () {
                return '{{key:translate}}';
            };
            __decorate([
                Bind({ html: true })
            ], HtmlFragment.prototype, "key", void 0);
            __decorate([
                Template()
            ], HtmlFragment.prototype, "text", null);
            HtmlFragment = __decorate([
                Construct({ selector: 'html-fragment', attributes: ['html-key'] })
            ], HtmlFragment);
            return HtmlFragment;
        }(Widget));
        components.HtmlFragment = HtmlFragment;
    })(components = quill.components || (quill.components = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var components;
    (function (components) {
        var GestureWidget = feather.ui.events.GestureWidget;
        var Theme = feather.ui.toast.Theme;
        var ToastManager = feather.ui.toast.ToastManager;
        var Toast = feather.ui.toast.Toast;
        var Subscribe = feather.hub.Subscribe;
        var AjaxWidget = (function (_super) {
            __extends(AjaxWidget, _super);
            function AjaxWidget() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AjaxWidget.prototype.requestFailed = function (err) {
                quill.Progress.stop();
                ToastManager.showToast(new Toast('ui.error.server', err.errors[0].message, Theme.Error));
            };
            AjaxWidget.prototype.requestForbidden = function () {
                quill.Progress.stop();
                ToastManager.showToast(new Toast('ui.errors.forbidden.title', 'ui.errors.forbidden.message', Theme.Error));
            };
            AjaxWidget.prototype.requestUnauthorized = function () {
                quill.Progress.stop();
                ToastManager.showToast(new Toast('ui.errors.unauthorized.title', 'ui.errors.unauthorized.message', Theme.Error));
            };
            AjaxWidget.prototype.requestMethodNotAllowed = function () {
                quill.Progress.stop();
                ToastManager.showToast(new Toast('ui.errors.notallowed.title', 'ui.errors.notallowed.message', Theme.Error));
            };
            AjaxWidget.prototype.timeout = function () {
                quill.Progress.stop();
                ToastManager.showToast(new Toast('ui.error.timeout.title', 'ui.error.timeout.message', Theme.Error));
            };
            AjaxWidget.prototype.genericError = function () {
                quill.Progress.stop();
                ToastManager.showToast(new Toast('ui.error.generic.title', 'ui.error.generic.message', Theme.Error));
            };
            __decorate([
                Subscribe('xhr-failure-500')
            ], AjaxWidget.prototype, "requestFailed", null);
            __decorate([
                Subscribe('xhr-failure-403')
            ], AjaxWidget.prototype, "requestForbidden", null);
            __decorate([
                Subscribe('xhr-failure-401')
            ], AjaxWidget.prototype, "requestUnauthorized", null);
            __decorate([
                Subscribe('xhr-failure-405')
            ], AjaxWidget.prototype, "requestMethodNotAllowed", null);
            __decorate([
                Subscribe('xhr-failure-timeout')
            ], AjaxWidget.prototype, "timeout", null);
            __decorate([
                Subscribe('xhr-failure-error')
            ], AjaxWidget.prototype, "genericError", null);
            return AjaxWidget;
        }(GestureWidget));
        components.AjaxWidget = AjaxWidget;
    })(components = quill.components || (quill.components = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var components;
    (function (components) {
        var Theme = feather.ui.toast.Theme;
        var ToastManager = feather.ui.toast.ToastManager;
        var Toast = feather.ui.toast.Toast;
        var Subscribe = feather.hub.Subscribe;
        var AjaxForm = (function (_super) {
            __extends(AjaxForm, _super);
            function AjaxForm() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AjaxForm.prototype.validationFailed = function (err) {
                var _this = this;
                quill.Progress.stop();
                var messages = err.errors.map(function (e) {
                    if (e.type === 'validation') {
                        _this.triggerDown('field-error', e.title);
                    }
                    return e.message;
                });
                if (err.errors.length) {
                    var errorType = err.errors[0].title.split('.').shift();
                    ToastManager.showToast(new Toast("ui." + errorType + ".failed", messages, Theme.Warning));
                }
            };
            __decorate([
                Subscribe('xhr-failure-400')
            ], AjaxForm.prototype, "validationFailed", null);
            return AjaxForm;
        }(components.AjaxWidget));
        components.AjaxForm = AjaxForm;
    })(components = quill.components || (quill.components = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var components;
    (function (components) {
        var GestureWidget = feather.ui.events.GestureWidget;
        var Construct = feather.annotations.Construct;
        var Subscribe = feather.hub.Subscribe;
        var On = feather.event.On;
        var Bind = feather.observe.Bind;
        var Template = feather.annotations.Template;
        var removeFromArray = feather.arrays.removeFromArray;
        var SelectableTreeLabel = (function (_super) {
            __extends(SelectableTreeLabel, _super);
            function SelectableTreeLabel(label, selected, type) {
                var _this = _super.call(this) || this;
                _this.label = label;
                _this.selected = selected;
                _this.type = type;
                SelectableTreeLabel_1.labels.push(_this);
                return _this;
            }
            SelectableTreeLabel_1 = SelectableTreeLabel;
            SelectableTreeLabel.prototype.init = function () {
                this.render();
            };
            SelectableTreeLabel.prototype.click = function () {
                var _this = this;
                this.selected = true;
                this.triggerUp('root-type-selected', this.type);
                SelectableTreeLabel_1.labels.forEach(function (l) {
                    if (l !== _this) {
                        l.selected = false;
                    }
                });
            };
            SelectableTreeLabel.prototype.nodeSelected = function (node) {
                if (node) {
                    this.selected = false;
                }
            };
            SelectableTreeLabel.prototype.markup = function () {
                return ("<p class=\"menu-label clickable\" {{selected}}>\n                <span class=\"icon is-small\">\n                    <i class=\"fa fa-angle-double-right\"></i>\n                </span>\n                {{label}}\n            </p>");
            };
            SelectableTreeLabel.prototype.cleanUp = function () {
                _super.prototype.cleanUp.call(this);
                removeFromArray(SelectableTreeLabel_1.labels, [this]);
            };
            SelectableTreeLabel.labels = [];
            __decorate([
                Bind()
            ], SelectableTreeLabel.prototype, "selected", void 0);
            __decorate([
                Bind()
            ], SelectableTreeLabel.prototype, "label", void 0);
            __decorate([
                On({ event: 'tap' })
            ], SelectableTreeLabel.prototype, "click", null);
            __decorate([
                Subscribe('defocus-other-nodes')
            ], SelectableTreeLabel.prototype, "nodeSelected", null);
            __decorate([
                Template()
            ], SelectableTreeLabel.prototype, "markup", null);
            SelectableTreeLabel = SelectableTreeLabel_1 = __decorate([
                Construct({ selector: 'selectable-tree-label', attributes: ['label', 'selected', 'type'] })
            ], SelectableTreeLabel);
            return SelectableTreeLabel;
            var SelectableTreeLabel_1;
        }(GestureWidget));
        components.SelectableTreeLabel = SelectableTreeLabel;
    })(components = quill.components || (quill.components = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var TreeNode = feather.ui.tree.TreeNode;
    var On = feather.event.On;
    var Scope = feather.event.Scope;
    var isDef = feather.functions.isDef;
    var DropPostion;
    (function (DropPostion) {
        DropPostion["inside"] = "inside";
        DropPostion["above"] = "above";
        DropPostion["below"] = "below";
    })(DropPostion = quill.DropPostion || (quill.DropPostion = {}));
    var NODE_DATA_TYPE = 'quill/node-id';
    var CustomTreeNode = (function (_super) {
        __extends(CustomTreeNode, _super);
        function CustomTreeNode() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = function () { return "" + _this.value.id; };
            return _this;
        }
        CustomTreeNode.prototype.init = function (el) {
            el.setAttribute('draggable', 'true');
            el.setAttribute('tabindex', '-1');
        };
        CustomTreeNode.prototype.dragstart = function (ev) {
            ev.dataTransfer.setData(NODE_DATA_TYPE, this.id());
        };
        CustomTreeNode.prototype.dragover = function (ev) {
            var relY = ev.clientY - this.element.getBoundingClientRect().top;
            if (relY < 6) {
                this.element.setAttribute('data-dragover', DropPostion.above);
            }
            else if (relY > 18) {
                this.element.setAttribute('data-dragover', DropPostion.below);
            }
            else {
                this.element.setAttribute('data-dragover', DropPostion.inside);
            }
        };
        CustomTreeNode.prototype.dragleave = function () {
            var _this = this;
            setTimeout(function () {
                return _this.element.removeAttribute('data-dragover');
            }, 30);
        };
        CustomTreeNode.prototype.drop = function (ev) {
            var id = ev.dataTransfer.getData(NODE_DATA_TYPE);
            this.dragleave();
            if (id) {
                this.triggerUp('node-drop', {
                    from: parseInt(id, 10),
                    to: parseInt(this.id(), 10),
                    position: this.element.getAttribute('data-dragover'),
                    open: this.children.length > 0 && this.open
                });
            }
        };
        CustomTreeNode.prototype.add = function (node, index) {
            if (isDef(index)) {
                this.children.splice(index, 0, node);
            }
            else {
                this.children.push(node);
            }
            node.parent = this;
        };
        CustomTreeNode.toTreeNode = function (n) {
            var tn = new CustomTreeNode(n.name, n, quill.iconFor(n.type));
            (_a = tn.children).push.apply(_a, n.children.map(function (n) {
                var child = CustomTreeNode.toTreeNode(n);
                child.parent = tn;
                return child;
            }));
            return tn;
            var _a;
        };
        __decorate([
            On({ event: 'dragstart', scope: Scope.Direct })
        ], CustomTreeNode.prototype, "dragstart", null);
        __decorate([
            On({ event: 'dragover', scope: Scope.Direct, preventDefault: true })
        ], CustomTreeNode.prototype, "dragover", null);
        __decorate([
            On({ event: 'dragleave', scope: Scope.Direct })
        ], CustomTreeNode.prototype, "dragleave", null);
        __decorate([
            On({ event: 'drop', scope: Scope.Direct })
        ], CustomTreeNode.prototype, "drop", null);
        return CustomTreeNode;
    }(TreeNode));
    quill.CustomTreeNode = CustomTreeNode;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Template = feather.annotations.Template;
    var On = feather.event.On;
    var GestureWidget = feather.ui.events.GestureWidget;
    var NotFoundPage = (function (_super) {
        __extends(NotFoundPage, _super);
        function NotFoundPage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NotFoundPage.prototype.backButtonClicked = function () {
            this.route('/');
        };
        NotFoundPage.prototype.loginPage = function () {
            return "\n            <scroll-pane class=\"grow\">\n                <div class=\"small-info-page\">\n                  <h1 key=\"ui.page.notfound.title\"/>\n                  <p key=\"ui.page.notfound.body\"/>\n                  <div class=\"form-components\">\n                    <div class=\"block has-text-right\">\n                        <a class=\"button is-primary back-action\" key=\"ui.page.notfound.button\"/>\n                    </div>\n                  </div>\n                </div>\n            </scroll-pane>\n            ";
        };
        __decorate([
            On({ event: 'tap', selector: '.back-action', preventDefault: true })
        ], NotFoundPage.prototype, "backButtonClicked", null);
        __decorate([
            Template('default')
        ], NotFoundPage.prototype, "loginPage", null);
        return NotFoundPage;
    }(GestureWidget));
    quill.NotFoundPage = NotFoundPage;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
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
            var el = this.element.querySelector('.navbar-toggle');
            el.classList.toggle('is-active');
            var menu = this.element.querySelector('.navbar-menu');
            menu.classList.toggle('is-active');
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
            return "\n            <nav class=\"navbar\" role=\"navigation\" aria-label=\"main navigation\">\n              <div class=\"navbar-brand\">\n                <a class=\"navbar-item\" href=\"/\" id=\"logo\">\n                    <img src=\"/assets/images/quill.svg\" alt=\"Quill Logo\">\n                    <span>Quill</span><span>{{project.name}}</span>\n                </a>\n                <div class=\"navbar-burger navbar-toggle\">\n                  <span></span>\n                  <span></span>\n                  <span></span>\n                </div>\n              </div>\n              <div class=\"navbar-menu\">\n                <div class=\"navbar-end\">\n                    <a class=\"navbar-item logout\">Logout <span class=\"username\">{{user.firstname}}</span></a>\n                    <a class=\"navbar-item\">Documentation</a>\n                    <div  class=\"navbar-item\">\n                        <p class=\"control has-icons-right\" id=\"search\">\n                          <input class=\"input\" type=\"text\" placeholder=\"Search...\">\n                          <Icon name=\"search\" align-right=\"right\"></Icon>\n                        </p>\n                    </div>\n                </div>\n              </div>\n            </nav>\n            ";
        };
        __decorate([
            On({ event: 'tap', selector: '.navbar-toggle' })
        ], Navigation.prototype, "toggle", null);
        __decorate([
            On({ event: 'tap', selector: 'a.logout' })
        ], Navigation.prototype, "logoutClicked", null);
        __decorate([
            Rest({ url: '/signout', headers: quill.headers })
        ], Navigation.prototype, "doLogout", null);
        __decorate([
            Subscribe('xhr-failure-401')
        ], Navigation.prototype, "logoutFailed", null);
        __decorate([
            Template()
        ], Navigation.prototype, "markup", null);
        Navigation = __decorate([
            Construct({ selector: 'navigation', singleton: true })
        ], Navigation);
        return Navigation;
    }(GestureWidget));
    quill.Navigation = Navigation;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Template = feather.annotations.Template;
    var Bind = feather.observe.Bind;
    var Subscribe = feather.hub.Subscribe;
    var Rest = feather.xhr.Rest;
    var Method = feather.xhr.Method;
    var isDef = feather.functions.isDef;
    var removeFromArray = feather.arrays.removeFromArray;
    var AjaxWidget = quill.components.AjaxWidget;
    var dummyProject = {
        id: 0,
        name: '',
        structure: [],
        schema: []
    };
    var ProjectPage = (function (_super) {
        __extends(ProjectPage, _super);
        function ProjectPage(projectId) {
            var _this = _super.call(this) || this;
            _this.nodes = [];
            _this.schemaNodes = [];
            _this.project = dummyProject;
            _this.currentRootType = 'structure';
            _this.newNode = {
                name: 'New node',
                sort: 0
            };
            _this.id = function () { return _this.projectId; };
            _this.projectId = projectId;
            return _this;
        }
        ProjectPage.prototype.init = function () {
            quill.Progress.start();
            this.fetchProject();
        };
        ProjectPage.prototype.fetchProject = function (project) {
            this.project = project;
            (_a = this.nodes).splice.apply(_a, [0, this.nodes.length].concat(project.structure.map(quill.CustomTreeNode.toTreeNode)));
            quill.Progress.stop();
            var _a;
        };
        ProjectPage.prototype.nodeDeselected = function (node) {
            this.currentTreeNode = undefined;
        };
        ProjectPage.prototype.nodeSelected = function (node) {
            node.element.focus();
            this.currentTreeNode = node;
            this.triggerDown('defocus-other-nodes', node);
        };
        ProjectPage.prototype.rootTypeSelected = function (type) {
            this.currentRootType = type;
            this.currentTreeNode = undefined;
            this.triggerDown('defocus-other-nodes');
        };
        ProjectPage.prototype.nodeAction = function (action) {
            switch (action) {
                case 'node-add': {
                    quill.Progress.start();
                    if (isDef(this.currentTreeNode)) {
                        this.createChildNode();
                    }
                    else {
                        this.createNode();
                    }
                    break;
                }
                case 'node-edit': {
                    this.currentTreeNode.focusAndEdit();
                    break;
                }
                case 'node-delete': {
                    this.deleteNode();
                    break;
                }
            }
        };
        ProjectPage.prototype.createChildNode = function (node) {
            quill.Progress.stop();
            var newNode = quill.CustomTreeNode.toTreeNode(node);
            this.currentTreeNode.add(newNode);
            this.currentTreeNode.open = true;
            this.currentTreeNode.selected = false;
            newNode.focusAndEdit();
        };
        ProjectPage.prototype.createNode = function (node) {
            quill.Progress.stop();
            var newNode = quill.CustomTreeNode.toTreeNode(node);
            this.nodes.push(newNode);
            newNode.focusAndEdit();
        };
        ProjectPage.prototype.deleteNode = function () {
            var node = this.currentTreeNode;
            var nodes = isDef(node.parent) ? node.parent.children : this.nodes;
            removeFromArray(nodes, [node]);
            this.currentTreeNode = undefined;
            this.triggerDown('defocus-other-nodes');
        };
        ProjectPage.prototype.renameNodeCall = function () {
            quill.Progress.stop();
        };
        ProjectPage.prototype.editNode = function (node) {
            quill.Progress.start();
            this.renameNode = { name: node.text };
            this.renameNodeCall();
        };
        ProjectPage.prototype.moveNodeCall = function () {
            quill.Progress.stop();
            var mn = this.moveNode;
            var allNodes = this.allNodes(this.nodes);
            var from = allNodes.find(function (n) { return n.id() === mn.from; });
            var to = allNodes.find(function (n) { return n.id() === mn.to; });
            var nodes = isDef(from.parent) ? from.parent.children : this.nodes;
            var toNodes = isDef(to.parent) ? to.parent.children : this.nodes;
            removeFromArray(nodes, [from]);
            if (mn.position === quill.DropPostion.inside) {
                var position = nodes.indexOf(to);
                to.add(from, position + 1);
            }
            else {
                var index = toNodes.indexOf(to) + (mn.position === quill.DropPostion.below ? 1 : 0);
                toNodes.splice(index, 0, from);
            }
        };
        ProjectPage.prototype.dragNode = function (drop) {
            quill.Progress.start();
            this.moveNode = __assign({}, drop);
            this.moveNodeCall();
        };
        ProjectPage.prototype.projectPage = function () {
            return "\n            <panel class=\"fullscreen v-flex\">\n                <navigation class=\"no-grow\"></navigation>\n                <horizontal-split class=\"grow\" id=\"app-split\">\n                  <sidebar class=\"v-flex\">\n                    <tree-actions></tree-actions>\n                    <scroll-pane class=\"grow\">\n                      <aside class=\"menu\">\n                        <selectable-tree-label label=\"Structure\" selected={true} type=\"structure\"></selectable-tree-label>\n                        <ul class=\"tree-view is-marginless\" {{nodes}}></ul>\n                        <selectable-tree-label label=\"Schemas\" selected={false} type=\"schema\"></selectable-tree-label>\n                        <ul class=\"tree-view is-marginless\" {{schemaNodes}}></ul>\n                      </aside>\n                    </scroll-pane>\n                  </sidebar>\n                  <section class=\"v-flex\">\n                    <scroll-pane class=\"grow\">\n                    </scroll-pane>\n                  </section>\n                </horizontal-split>\n                <footer class=\"no-grow\"/>\n            </panel>";
        };
        ProjectPage.prototype.allNodes = function (nodes) {
            return [].concat.apply([], nodes.map(quill.flattenTree));
        };
        __decorate([
            Bind()
        ], ProjectPage.prototype, "nodes", void 0);
        __decorate([
            Bind()
        ], ProjectPage.prototype, "schemaNodes", void 0);
        __decorate([
            Bind({ bequeath: true })
        ], ProjectPage.prototype, "project", void 0);
        __decorate([
            Rest({ url: '/projects/{{projectId}}', headers: quill.headers })
        ], ProjectPage.prototype, "fetchProject", null);
        __decorate([
            Subscribe('node-defocused')
        ], ProjectPage.prototype, "nodeDeselected", null);
        __decorate([
            Subscribe('node-focused')
        ], ProjectPage.prototype, "nodeSelected", null);
        __decorate([
            Subscribe('root-type-selected')
        ], ProjectPage.prototype, "rootTypeSelected", null);
        __decorate([
            Subscribe('node-action')
        ], ProjectPage.prototype, "nodeAction", null);
        __decorate([
            Rest({ url: '/node/{{currentTreeNode.id}}', method: Method.POST, body: 'newNode', headers: quill.headers })
        ], ProjectPage.prototype, "createChildNode", null);
        __decorate([
            Rest({ url: '/projects/{{projectId}}/{{currentRootType}}', method: Method.POST, body: 'newNode', headers: quill.headers })
        ], ProjectPage.prototype, "createNode", null);
        __decorate([
            Rest({ url: '/node/{{currentTreeNode.id}}', method: Method.DELETE, headers: quill.headers })
        ], ProjectPage.prototype, "deleteNode", null);
        __decorate([
            Rest({ url: '/node/{{currentTreeNode.id}}/rename', method: Method.PUT, body: 'renameNode', headers: quill.headers })
        ], ProjectPage.prototype, "renameNodeCall", null);
        __decorate([
            Subscribe('node-edited')
        ], ProjectPage.prototype, "editNode", null);
        __decorate([
            Rest({ url: '/node/{{moveNode.from}}/move', method: Method.PUT, body: 'moveNode', headers: quill.headers })
        ], ProjectPage.prototype, "moveNodeCall", null);
        __decorate([
            Subscribe('node-drop')
        ], ProjectPage.prototype, "dragNode", null);
        __decorate([
            Template()
        ], ProjectPage.prototype, "projectPage", null);
        return ProjectPage;
    }(AjaxWidget));
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
            _this.identifierConfig = {
                label: 'ui.signin.identifier',
                name: 'signin.identifier',
                placeholder: 'john@freemail.com',
                icon: 'envelope-o',
                autofocus: true,
                onChange: function (l) { return _this.credentials.identifier = l; }
            };
            _this.passwordConfig = {
                label: 'ui.signin.password',
                name: 'signin.password',
                icon: 'lock',
                type: 'password',
                onChange: function (p) { return _this.credentials.password = p; }
            };
            _this.firstnameConfig = {
                label: 'ui.signup.firstname',
                icon: 'user-o',
                name: 'signup.firstname',
                placeholder: 'John',
                onChange: function (p) { return _this.signup.firstname = p; }
            };
            _this.lastnameConfig = {
                label: 'ui.signup.lastname',
                icon: 'user-o',
                name: 'signup.lastname',
                placeholder: 'Smith',
                onChange: function (p) { return _this.signup.lastname = p; }
            };
            _this.emailConfig = {
                label: 'ui.signup.email',
                name: 'signup.email',
                icon: 'envelope-o',
                placeholder: 'john@mail.com',
                onChange: function (p) { return _this.signup.email = p; }
            };
            _this.signupPasswordConfig = {
                label: 'ui.signup.password',
                name: 'signup.password',
                icon: 'lock',
                onChange: function (p) { return _this.signup.password = p; }
            };
            _this.forgotPasswordConfig = {
                label: 'ui.forgot-password.email',
                name: 'forgot-password.identifier',
                icon: 'envelope-o',
                onChange: function (p) { return _this.forgotPassword.identifier = p; }
            };
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
            this.route('/ ');
            quill.Progress.stop();
        };
        LoginPage.prototype.unauthorized = function (err) {
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
            ToastManager.showToast(new Toast('ui.forgot-password.email-sent.title', 'ui.forgot-password.email-sent.message', Theme.Info));
            this.route('/login');
        };
        LoginPage.prototype.loginPage = function () {
            return "\n            <scroll-pane class=\"grow\">\n                <div class=\"login\">\n                    <tabs>\n                      <div class=\"form-components\" title=\"ui.login.tabs.login\" icon=\"key\" active>\n                        <Text config=\"{identifierConfig}\"/>\n                        <Text config=\"{passwordConfig}\"/>\n                        <div class=\"block has-text-right\">\n                            <a class=\"button is-primary login-action\" key=\"ui.signin.button\"/>\n                        </div>\n                      </div>\n                      <div class=\"form-components\" title=\"ui.login.tabs.signup\" icon=\"pencil-square-o\">\n                        <Text config=\"{firstnameConfig}\"/>\n                        <Text config=\"{lastnameConfig}\"/>\n                        <Text config=\"{emailConfig}\"/>\n                        <Text config=\"{signupPasswordConfig}\"/>\n                        <div class=\"block has-text-right\">\n                             <a class=\"button is-primary signup-action\" key=\"ui.signup.button\"/>\n                        </div>\n                      </div>\n                      <div class=\"form-components\" title=\"ui.login.tabs.forgot-password\" icon=\"unlock\">\n                        <html-fragment html-key=\"ui.forgot-password.info\"></html-fragment>\n                        <Text config=\"{forgotPasswordConfig}\"/>\n                        <div class=\"block has-text-right\">\n                             <a class=\"button is-primary forgot-password-action\" key=\"ui.forgot-password.button\"/>\n                        </div>\n                      </div>\n                  </tabs>\n                </div>\n            </scroll-pane>\n            ";
        };
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
            Template('default')
        ], LoginPage.prototype, "loginPage", null);
        return LoginPage;
    }(AjaxForm));
    quill.LoginPage = LoginPage;
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
    var Toast = feather.ui.toast.Toast;
    var ToastManager = feather.ui.toast.ToastManager;
    var PassordChangePage = (function (_super) {
        __extends(PassordChangePage, _super);
        function PassordChangePage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.newPassword = {
                id: quill.getQueryStringParam('id')
            };
            _this.changePasswordInfo = 'ui.change-password.info';
            _this.passwordConfig = {
                label: 'ui.change-password.password',
                name: 'new-password.password',
                icon: 'lock',
                type: 'password',
                onChange: function (p) { return _this.newPassword.password = p; }
            };
            _this.passwordRepeatConfig = {
                label: 'ui.change-password.password-repeat',
                name: 'new-password.passwordRepeat',
                icon: 'lock',
                type: 'password',
                onChange: function (p) { return _this.newPassword.passwordRepeat = p; }
            };
            return _this;
        }
        PassordChangePage.prototype.init = function () {
            quill.removeToken();
        };
        PassordChangePage.prototype.submitClicked = function () {
            quill.Progress.start();
            this.doPasswordChange();
        };
        PassordChangePage.prototype.doPasswordChange = function () {
            quill.Progress.stop();
            this.route('/login');
            ToastManager.showToast(new Toast('ui.change-password.success.title', 'ui.change-password.success.message', Theme.Error));
        };
        PassordChangePage.prototype.unauthorized = function (err, xhr) {
            quill.Progress.stop();
            ToastManager.showToast(new Toast('ui.change-password.fail.title', 'ui.change-password.fail.message', Theme.Error));
            this.route('/login');
        };
        PassordChangePage.prototype.loginPage = function () {
            return "\n            <scroll-pane class=\"grow\">\n                <div class=\"change-password\">\n                  <p key=\"ui.change-password.info\"/>\n                  <div class=\"form-components\">\n                    <Text config=\"{passwordConfig}\"/>\n                    <Text config=\"{passwordRepeatConfig}\"/>\n                    <div class=\"block has-text-right\">\n                        <a class=\"button is-primary change-action\" key=\"ui.change-password.button\"/>\n                    </div>\n                  </div>\n                </div>\n            </scroll-pane>\n            ";
        };
        __decorate([
            Bind()
        ], PassordChangePage.prototype, "changePasswordInfo", void 0);
        __decorate([
            On({ event: 'tap', selector: '.change-action' })
        ], PassordChangePage.prototype, "submitClicked", null);
        __decorate([
            Rest({ url: '/account/new-password', method: Method.PUT, body: 'newPassword', headers: quill.headers })
        ], PassordChangePage.prototype, "doPasswordChange", null);
        __decorate([
            Subscribe('xhr-failure-401')
        ], PassordChangePage.prototype, "unauthorized", null);
        __decorate([
            Template('default')
        ], PassordChangePage.prototype, "loginPage", null);
        return PassordChangePage;
    }(AjaxForm));
    quill.PassordChangePage = PassordChangePage;
})(quill || (quill = {}));
var feather;
(function (feather) {
    var ui;
    (function (ui) {
        var Construct = feather.annotations.Construct;
        var Template = feather.annotations.Template;
        var Bind = feather.observe.Bind;
        var On = feather.event.On;
        var Subscribe = feather.hub.Subscribe;
        var GestureWidget = feather.ui.events.GestureWidget;
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
                this.disabled = typeof node === 'undefined';
            };
            TreeActions.prototype.buttonClicked = function (ev, el) {
                this.triggerUp('node-action', el.getAttribute('action'));
            };
            TreeActions.prototype.markup = function () {
                return "\n            <div class=\"level is-mobile is-marginless\">\n              <div class=\"level-left\">\n                 <a class=\"button is-small\" action=\"node-add\"><Icon name=\"plus\"></Icon></a>\n                 <a class=\"button is-small\" action=\"node-edit\" {{disabled}}><Icon name=\"pencil\"></Icon></a>\n              </div>\n              <div class=\"level-right\">\n                 <a class=\"button is-small\" action=\"node-delete\" {{disabled}}><Icon name=\"trash-o\"/></a>\n              </div>\n            </div>";
            };
            __decorate([
                Bind()
            ], TreeActions.prototype, "disabled", void 0);
            __decorate([
                Subscribe('defocus-other-nodes')
            ], TreeActions.prototype, "nodeSelected", null);
            __decorate([
                On({ event: 'tap', selector: 'a[action]:not([disabled])' })
            ], TreeActions.prototype, "buttonClicked", null);
            __decorate([
                Template()
            ], TreeActions.prototype, "markup", null);
            TreeActions = __decorate([
                Construct({ selector: 'tree-actions' })
            ], TreeActions);
            return TreeActions;
        }(GestureWidget));
        ui.TreeActions = TreeActions;
    })(ui = feather.ui || (feather.ui = {}));
})(feather || (feather = {}));
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
            return "";
        };
        __decorate([
            Template()
        ], Content.prototype, "markup", null);
        Content = __decorate([
            Construct({ selector: 'content' })
        ], Content);
        return Content;
    }(GestureWidget));
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
    var setDeepValue = feather.objects.setDeepValue;
    var QuillApplication = (function (_super) {
        __extends(QuillApplication, _super);
        function QuillApplication() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pages = [];
            _this.user = null;
            _this.translations = {};
            return _this;
        }
        QuillApplication.prototype.init = function () {
            this.fetchTranslations();
        };
        QuillApplication.prototype.fetchTranslations = function (translations) {
            var _this = this;
            translations.messages
                .forEach(function (c) {
                return setDeepValue(_this.translations, c.key, c.value);
            });
            this.render();
        };
        QuillApplication.prototype.checkLogin = function (resp) {
            this.user = resp;
            this.route("/project/" + this.user.lastProject);
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
                this.goToPage(new quill.ProjectPage(params.id));
            }
        };
        QuillApplication.prototype.loginPage = function () {
            this.goToPage(new quill.LoginPage());
        };
        QuillApplication.prototype.notFoundPage = function () {
            this.goToPage(new quill.NotFoundPage());
        };
        QuillApplication.prototype.changePasswordPage = function () {
            this.goToPage(new quill.PassordChangePage());
        };
        QuillApplication.prototype.goToPage = function (page) {
            this.pages.splice(0, 1, page);
        };
        QuillApplication.prototype.homePage = function () {
            this.checkLogin();
        };
        QuillApplication.prototype.applicationHTML = function () {
            return "<progress-bar></progress-bar>\n                    <panel class=\"fullscreen v-flex\" {{pages}}></panel>\n                    <localization translations={translations}/>\n            ";
        };
        __decorate([
            Bind()
        ], QuillApplication.prototype, "pages", void 0);
        __decorate([
            Bind({ bequeath: true })
        ], QuillApplication.prototype, "user", void 0);
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
            Route('/404')
        ], QuillApplication.prototype, "notFoundPage", null);
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
        return QuillApplication;
    }(Widget));
    quill.QuillApplication = QuillApplication;
})(quill || (quill = {}));
feather.start();
//# sourceMappingURL=quill.js.map