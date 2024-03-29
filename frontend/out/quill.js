var quill;
(function (quill) {
    var Keys;
    (function (Keys) {
        Keys[Keys["ENTER"] = 13] = "ENTER";
    })(Keys = quill.Keys || (quill.Keys = {}));
    var MultilineEditor;
    (function (MultilineEditor) {
        MultilineEditor["normal"] = "normal";
        MultilineEditor["richtext"] = "richtext";
        MultilineEditor["markdown"] = "markdown";
    })(MultilineEditor = quill.MultilineEditor || (quill.MultilineEditor = {}));
    var NumberEditor;
    (function (NumberEditor) {
        NumberEditor["input"] = "input";
        NumberEditor["slider"] = "slider";
    })(NumberEditor = quill.NumberEditor || (quill.NumberEditor = {}));
    var BooleanEditor;
    (function (BooleanEditor) {
        BooleanEditor["checkbpx"] = "checkbox";
        BooleanEditor["switch"] = "switch";
    })(BooleanEditor = quill.BooleanEditor || (quill.BooleanEditor = {}));
})(quill || (quill = {}));
var keys;
(function (keys_1) {
    keys_1.Key = {
        Left: ['Left', 'ArrowLeft'],
        Right: ['Right', 'ArrowRight'],
        Up: ['Up', 'ArrowUp'],
        Down: ['Down', 'ArrowDown'],
        Esc: ['Esc', 'Escape'],
        Enter: ['Enter', 'Return'],
        Plus: ['+Equal', '+'],
        C: ['C', 'KeyC'],
    };
    keys_1.isKey = function (ev) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        var flat = [].concat.apply([], keys);
        return !!flat.find(function (k) {
            var code = ev.code || ev.key;
            if (k.charAt(0) === '+' && k.length > 1) {
                return ev.shiftKey && k.substr(1).toLocaleLowerCase() === code.toLowerCase();
            }
            return k.toLocaleLowerCase() === code.toLowerCase();
        });
    };
})(keys || (keys = {}));
var quill;
(function (quill) {
    var TreeNodeIcon = feather.ui.tree.TreeNodeIcon;
    var findClippedParent = feather.ui.findClippedParent;
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
            case 'boolean':
                return TreeNodeIcon.boolean;
            default:
                return TreeNodeIcon.config;
        }
    };
    quill.flattenTree = function (node) {
        return (_a = [node]).concat.apply(_a, node.children.map(quill.flattenTree));
        var _a;
    };
    quill.scrollElementIntoView = function (el) {
        var scroll = findClippedParent(el), scrollRect = scroll.getBoundingClientRect(), rect = el.getBoundingClientRect();
        if (rect.top <= scrollRect.top || rect.bottom >= scrollRect.bottom) {
            el.scrollIntoView();
        }
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
    var modal;
    (function (modal_1) {
        var Template = feather.annotations.Template;
        var Construct = feather.annotations.Construct;
        var GestureWidget = feather.ui.events.GestureWidget;
        var Subscribe = feather.hub.Subscribe;
        var Widget = feather.core.Widget;
        var Bind = feather.observe.Bind;
        var On = feather.event.On;
        var isKey = keys.isKey;
        var Key = keys.Key;
        var ModalWidget = (function (_super) {
            __extends(ModalWidget, _super);
            function ModalWidget() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.successButton = function () { return 'ui.modal.ok'; };
                _this.cancelButton = function () { return 'ui.modal.cancel'; };
                return _this;
            }
            ModalWidget.prototype.escKey = function (ev) {
                if (isKey(ev, Key.Esc)) {
                    this.triggerUp('close-modal');
                }
            };
            __decorate([
                On({ event: 'keydown' })
            ], ModalWidget.prototype, "escKey", null);
            return ModalWidget;
        }(Widget));
        modal_1.ModalWidget = ModalWidget;
        var ModalManager = (function (_super) {
            __extends(ModalManager, _super);
            function ModalManager() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.modal = [];
                _this.showing = false;
                _this.title = 'ui.modal.title';
                _this.successButton = 'ui.modal.ok';
                _this.cancelButton = 'ui.modal.cancel';
                _this.toActive = function (showing) { return showing ? 'is-active' : undefined; };
                return _this;
            }
            ModalManager.prototype.init = function () {
                this.render();
            };
            ModalManager.prototype.closeCall = function () {
                this.close();
            };
            ModalManager.prototype.show = function (modal) {
                this.lastFocussedElement = document.activeElement;
                this.modal.splice(0, this.modal.length, modal);
                this.title = modal.getTitle();
                this.successButton = modal.successButton();
                this.cancelButton = modal.cancelButton();
                this.showing = true;
                modal.element.setAttribute('tabindex', '-1');
                modal.element.focus();
            };
            ModalManager.prototype.close = function () {
                this.showing = false;
                if (this.lastFocussedElement) {
                    this.lastFocussedElement.focus();
                }
            };
            ModalManager.prototype.closeButtons = function () {
                this.close();
            };
            ModalManager.prototype.okClicked = function () {
                this.triggerDown('ok-clicked');
            };
            ModalManager.prototype.markup = function () {
                return "<div class=\"modal {{showing:toActive}}\">\n              <div class=\"modal-background\"/>\n              <div class=\"modal-card is-small\">\n                <header class=\"modal-card-head\">\n                  <p class=\"modal-card-title\">{{title:translate}}</p>\n                  <button class=\"delete\" aria-label=\"close\"/>\n                </header>\n                <section class=\"modal-card-body is-small\" {{modal}}/>\n                <footer class=\"modal-card-foot\">\n                  <button class=\"button is-inverted ok\">{{successButton:translate}}</button>\n                  <button class=\"button is-inverted cancel\">{{cancelButton:translate}}</button>\n                </footer>\n              </div>\n            </div>";
            };
            __decorate([
                Bind()
            ], ModalManager.prototype, "modal", void 0);
            __decorate([
                Bind()
            ], ModalManager.prototype, "showing", void 0);
            __decorate([
                Bind()
            ], ModalManager.prototype, "title", void 0);
            __decorate([
                Bind()
            ], ModalManager.prototype, "successButton", void 0);
            __decorate([
                Bind()
            ], ModalManager.prototype, "cancelButton", void 0);
            __decorate([
                Subscribe('close-modal')
            ], ModalManager.prototype, "closeCall", null);
            __decorate([
                Subscribe('show-modal')
            ], ModalManager.prototype, "show", null);
            __decorate([
                Subscribe('close-modal'),
                On({ event: 'mousedown', selector: '.modal-background' })
            ], ModalManager.prototype, "close", null);
            __decorate([
                On({ event: 'click', selector: 'button.cancel,button.delete' })
            ], ModalManager.prototype, "closeButtons", null);
            __decorate([
                On({ event: 'click', selector: 'button.ok' })
            ], ModalManager.prototype, "okClicked", null);
            __decorate([
                Template()
            ], ModalManager.prototype, "markup", null);
            ModalManager = __decorate([
                Construct({ selector: 'modal-manager', singleton: true })
            ], ModalManager);
            return ModalManager;
        }(GestureWidget));
        modal_1.ModalManager = ModalManager;
    })(modal = quill.modal || (quill.modal = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var modal;
    (function (modal) {
        var Template = feather.annotations.Template;
        var ProjectConfig = (function (_super) {
            __extends(ProjectConfig, _super);
            function ProjectConfig(project) {
                var _this = _super.call(this) || this;
                _this.project = project;
                return _this;
            }
            ProjectConfig.prototype.getTitle = function () {
                return 'ui.modal.project-config.title';
            };
            ProjectConfig.prototype.markup = function () {
                return "<div class=\"\">Project Config</div>";
            };
            __decorate([
                Template()
            ], ProjectConfig.prototype, "markup", null);
            return ProjectConfig;
        }(modal.ModalWidget));
        modal.ProjectConfig = ProjectConfig;
    })(modal = quill.modal || (quill.modal = {}));
})(quill || (quill = {}));
var quill;
(function (quill) {
    var modal;
    (function (modal) {
        var Template = feather.annotations.Template;
        var TreeNodeIcon = feather.ui.tree.TreeNodeIcon;
        var Subscribe = feather.hub.Subscribe;
        var Rest = feather.xhr.Rest;
        var Method = feather.xhr.Method;
        var parentTabs = {
            string: 'tab.string',
            text: 'tab.string',
            number: 'tab.number',
            fraction: 'tab.number',
            date: 'tab.date',
            datetime: 'tab.date',
            boolean: 'tab.boolean',
            list: 'tab.list',
            enum: 'tab.list',
        };
        var NodeConfigModal = (function (_super) {
            __extends(NodeConfigModal, _super);
            function NodeConfigModal(node, nodeConfig, configured) {
                var _this = _super.call(this) || this;
                _this.multilineRadioConfig = {
                    label: 'ui.modal.node-config.multi-line.type',
                    name: 'multiline-type',
                    radios: [
                        { key: 'ui.modal.node-config.multi-line.normal',
                            value: quill.MultilineEditor.normal },
                        { key: 'ui.modal.node-config.multi-line.richtext',
                            value: quill.MultilineEditor.richtext },
                        { key: 'ui.modal.node-config.multi-line.markdown',
                            value: quill.MultilineEditor.markdown }
                    ],
                    onChange: function (value) {
                        _this.nodeConfig.multiline.editor = value;
                    }
                };
                _this.node = node;
                _this.nodeConfig = nodeConfig;
                _this.configured = configured;
                return _this;
            }
            NodeConfigModal.prototype.init = function (el) {
                this.triggerDown('tab-key-activate', this.nodeConfig.nodeType);
                var parentTab = parentTabs[this.nodeConfig.nodeType];
                if (parentTab !== this.nodeConfig.nodeType) {
                    this.triggerDown('tab-key-activate', parentTab);
                }
            };
            NodeConfigModal.prototype.okClicked = function () {
                this.saveConfig();
            };
            NodeConfigModal.prototype.saveConfig = function (conf) {
                this.configured(conf);
                this.triggerUp('close-modal');
            };
            NodeConfigModal.prototype.getTitle = function () {
                return 'ui.modal.node-config.title';
            };
            NodeConfigModal.prototype.activateTab = function (tab) {
                var tabKey = tab.getTabKey();
                if (!/^tab\..*$/.test(tabKey)) {
                    this.nodeConfig.nodeType = tabKey;
                }
                else {
                    this.nodeConfig.nodeType =
                        tab.container.querySelector('[tab-key]:not([hidden])').getAttribute('tab-key');
                }
            };
            NodeConfigModal.prototype.markup = function () {
                return "\n            <tabs tabs-class=\"is-boxed\">\n                " + this.textTab() + "\n                " + this.numberTab() + "\n                " + this.dateTab() + "\n                " + this.boolTab() + "\n                " + this.listTab() + "\n            </tabs>";
            };
            NodeConfigModal.prototype.listTab = function () {
                return "\n            <div title=\"ui.modal.node-config.tabs.list\"\n                 tab-key=\"tab.list\"\n                 icon=" + TreeNodeIcon.array + ">\n                 <tabs class=\"vertical\">\n                    " + this.infiniteList() + "\n                    " + this.enumeration() + "\n                </tabs>\n            </div>";
            };
            NodeConfigModal.prototype.infiniteList = function () {
                return "\n            <div title=\"ui.modal.node-config.list.title\"\n                 icon=\"database\"\n                 tab-key=\"list\" active>\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.enumeration = function () {
                return "\n            <div title=\"ui.modal.node-config.enumeration.title\"\n                 tab-key=\"enum\"\n                 icon=\"list-alt\">\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.boolTab = function () {
                return "\n            <div title=\"ui.modal.node-config.tabs.boolean\"\n                 tab-key=\"boolean\"\n                 icon=" + TreeNodeIcon.boolean + "></div>";
            };
            NodeConfigModal.prototype.dateTab = function () {
                return "\n            <div title=\"ui.modal.node-config.tabs.date\"\n                 tab-key=\"tab.date\"\n                 icon=" + TreeNodeIcon.date + ">\n                <tabs class=\"vertical\">\n                    " + this.date() + "\n                    " + this.datetime() + "\n                </tabs>\n            </div>";
            };
            NodeConfigModal.prototype.date = function () {
                return "\n            <div title=\"ui.modal.node-config.date.title\"\n                 tab-key=\"date\"\n                 icon=\"calendar\" active>\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.datetime = function () {
                return "\n            <div title=\"ui.modal.node-config.datetime.title\"\n                  tab-key=\"datetime\"\n                 icon=\"clock-o\">\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.numberTab = function () {
                return "\n                <div title=\"ui.modal.node-config.tabs.number\"\n                     tab-key=\"tab.number\"\n                     icon=" + TreeNodeIcon.number + ">\n                    <tabs class=\"vertical\">\n                        " + this.integer() + "\n                        " + this.fractions() + "\n                    </tabs>\n                </div>";
            };
            NodeConfigModal.prototype.integer = function () {
                return "\n            <div title=\"ui.modal.node-config.integer.title\"\n                 tab-key=\"number\"\n                 icon=\"thermometer\" active>\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.fractions = function () {
                return "\n            <div title=\"ui.modal.node-config.fraction.title\"\n                 tab-key=\"fraction\"\n                 icon=\"pie-chart\">\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.textTab = function () {
                return "\n            <div title=\"ui.modal.node-config.tabs.text\"\n                 tab-key=\"tab.string\"\n                 icon=" + TreeNodeIcon.text + " active>\n                <tabs class=\"vertical\">\n                    " + this.singleLine() + "\n                    " + this.multiLine() + "\n                </tabs>\n            </div>";
            };
            NodeConfigModal.prototype.singleLine = function () {
                return "\n            <div title=\"ui.modal.node-config.single-line.title\"\n                 tab-key=\"string\"\n                 icon=\"font\" active>\n                ABC\n            </div>";
            };
            NodeConfigModal.prototype.multiLine = function () {
                return "\n            <div title=\"ui.modal.node-config.multi-line.title\"\n                 tab-key=\"text\"\n                 icon=\"align-justify\">\n                <RadioSet config={multilineRadioConfig}\n                          selected={nodeConfig.multiline.editor}/>\n            </div>";
            };
            __decorate([
                Subscribe('ok-clicked')
            ], NodeConfigModal.prototype, "okClicked", null);
            __decorate([
                Rest({ url: '/node/{{node.id}}/configure', method: Method.PUT, body: 'nodeConfig', headers: quill.headers })
            ], NodeConfigModal.prototype, "saveConfig", null);
            __decorate([
                Subscribe('activate-tab')
            ], NodeConfigModal.prototype, "activateTab", null);
            __decorate([
                Template()
            ], NodeConfigModal.prototype, "markup", null);
            return NodeConfigModal;
        }(modal.ModalWidget));
        modal.NodeConfigModal = NodeConfigModal;
    })(modal = quill.modal || (quill.modal = {}));
})(quill || (quill = {}));
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
    var Construct = feather.annotations.Construct;
    var ScrollPane = feather.ui.ScrollPane;
    var On = feather.event.On;
    var Scope = feather.event.Scope;
    var Subscribe = feather.hub.Subscribe;
    var ScrollSpy = (function (_super) {
        __extends(ScrollSpy, _super);
        function ScrollSpy() {
            var _this = _super.call(this) || this;
            _this.receivers = [];
            return _this;
        }
        ScrollSpy.prototype.registerReceiver = function (sr) {
            this.receivers.push(sr);
            this.onScroll();
        };
        ScrollSpy.prototype.onScroll = function () {
            var y = this.element.scrollTop;
            this.receivers.forEach(function (sr) { return sr.scrollTo(y); });
        };
        __decorate([
            Subscribe('register-scroll-receiver')
        ], ScrollSpy.prototype, "registerReceiver", null);
        __decorate([
            On({ event: 'scroll', scope: Scope.Direct })
        ], ScrollSpy.prototype, "onScroll", null);
        ScrollSpy = __decorate([
            Construct({ selector: 'scroll-spy', attributes: ['sync'], singleton: true })
        ], ScrollSpy);
        return ScrollSpy;
    }(ScrollPane));
    quill.ScrollSpy = ScrollSpy;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Construct = feather.annotations.Construct;
    var ScrollPane = feather.ui.ScrollPane;
    var ScrollReceiver = (function (_super) {
        __extends(ScrollReceiver, _super);
        function ScrollReceiver() {
            return _super.call(this) || this;
        }
        ScrollReceiver.prototype.init = function (el) {
            this.triggerSingleton('register-scroll-receiver', this);
        };
        ScrollReceiver.prototype.scrollTo = function (y) {
            this.element.scrollTop = y;
        };
        ScrollReceiver = __decorate([
            Construct({ selector: 'scroll-receiver' })
        ], ScrollReceiver);
        return ScrollReceiver;
    }(ScrollPane));
    quill.ScrollReceiver = ScrollReceiver;
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
            AjaxWidget.prototype.requestUnauthorized = function (err) {
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
    var TreeNode = feather.ui.tree.TreeNode;
    var Template = feather.annotations.Template;
    var ValueNode = (function (_super) {
        __extends(ValueNode, _super);
        function ValueNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ValueNode.prototype.markup = function () {
            return '<li></li>';
        };
        __decorate([
            Template()
        ], ValueNode.prototype, "markup", null);
        return ValueNode;
    }(TreeNode));
    quill.ValueNode = ValueNode;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Widget = feather.core.Widget;
    var Template = feather.annotations.Template;
    var Rest = feather.xhr.Rest;
    var Bind = feather.observe.Bind;
    var Subscribe = feather.hub.Subscribe;
    var VersionValues = (function (_super) {
        __extends(VersionValues, _super);
        function VersionValues(version) {
            var _this = _super.call(this) || this;
            _this.version = version;
            return _this;
        }
        VersionValues.prototype.nodesInitialized = function (nodes) {
            return __awaiter(this, void 0, void 0, function () {
                var version;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.loadVersionValue()];
                        case 1:
                            version = _a.sent();
                            console.log(version);
                            return [2];
                    }
                });
            });
        };
        VersionValues.prototype.loadVersionValue = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2];
            }); });
        };
        VersionValues.prototype.markup = function () {
            return "\n             <li class=\"v-flex\">\n                <div class=\"level version-header no-grow\">\n                    <div class=\"level-left\">\n                        <span class=\"level-item\">\n                            <span class=\"icon is-small\"><Icon name=\"book\"/></span>\n                            <span class=\"version-name\">{{version.name}}</span>\n                        </span>\n                    </div>\n                    <div class=\"level-right\">\n                        <a class=\"button is-small tooltip\"\n                           action=\"version-github\"\n                           tooltip=\"ui.tooltip.version.github\">\n                            <Icon name=\"github\" icon-class=\"is-small\"/>\n                        </a>\n                        <a class=\"button is-small tooltip\"\n                           action=\"version-download\"\n                           tooltip=\"ui.tooltip.version.json-download\">\n                            <Icon name=\"download\" icon-class=\"is-small\"/>\n                        </a>\n                        <a class=\"button is-small tooltip\"\n                           action=\"version-configure\"\n                           tooltip=\"ui.tooltip.version.configure\">\n                            <Icon name=\"cog\" icon-class=\"is-small\"/>\n                        </a>\n                    </div>\n                </div>\n                <scroll-receiver class=\"grow\">\n                    Nu Bass \u00A0<br>Nichol Cumbie \u00A0<br>Lenna Piercy \u00A0<br>See Aispuro \u00A0<br>\n                    Sophie Troyer \u00A0<br>Bryan Cool \u00A0<br>Sylvia Mabe \u00A0<br>Hue Keele \u00A0<br>\n                    Kaylee Speaks \u00A0<br>Milda Costin \u00A0<br>Jennie Dietrich \u00A0<br>Reanna Leanos \u00A0<br>\n                    Ruby Dehn \u00A0<br>Asa Estes \u00A0<br>Tennie Steverson \u00A0<br>Despina Schnur \u00A0<br>\n                    Lakeisha Getman \u00A0<br>Mara Heng \u00A0<br>Carroll Down \u00A0<br>Florencio Fazzino \u00A0<br>\n                    Hailey Causey \u00A0<br>Babara Friscia \u00A0<br>Chanell Stgermain \u00A0<br>Annette Deangelis \u00A0<br>\n                    Sulema Pulley \u00A0<br>Kylee Penman \u00A0<br>Ariel Pridgen \u00A0<br>Mitch Granado \u00A0<br>\n                    Vernia Dates \u00A0<br>Darnell Pablo \u00A0<br>Anneliese Alderman \u00A0<br>Brad Dahl \u00A0<br>\n                    Valentin Amburgey \u00A0<br>Kemberly Pelzer \u00A0<br>Ronald Boney \u00A0<br>Adah Boateng \u00A0<br>\n                    Marcelina Alls \u00A0<br>Felicia Guss \u00A0<br>Linn Mershon \u00A0<br>Chere Scioneaux \u00A0<br>\n                    Madalyn Glisson \u00A0<br>Kimberely Hagwood \u00A0<br>Roxanne Ouimet \u00A0<br>Annalisa Armagost \u00A0<br>\n                    Doris Troy \u00A0<br>Angeline Shelor \u00A0<br>Zada Manjarrez \u00A0<br>Marvella Ritch \u00A0<br>\n                    Larisa Burruel \u00A0<br>Margrett Canino \u00A0<br><br>\n                </scroll-receiver>\n            </li>";
        };
        __decorate([
            Bind()
        ], VersionValues.prototype, "version", void 0);
        __decorate([
            Subscribe('visible-nodes')
        ], VersionValues.prototype, "nodesInitialized", null);
        __decorate([
            Rest({ url: '/values/version/{{version.id}}', headers: quill.headers })
        ], VersionValues.prototype, "loadVersionValue", null);
        __decorate([
            Template()
        ], VersionValues.prototype, "markup", null);
        return VersionValues;
    }(Widget));
    quill.VersionValues = VersionValues;
})(quill || (quill = {}));
var quill;
(function (quill) {
    var Widget = feather.core.Widget;
    var Construct = feather.annotations.Construct;
    var Template = feather.annotations.Template;
    var Subscribe = feather.hub.Subscribe;
    var Bind = feather.observe.Bind;
    var ValueEditor = (function (_super) {
        __extends(ValueEditor, _super);
        function ValueEditor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.versionValues = [];
            return _this;
        }
        ValueEditor.prototype.init = function (el) {
            this.render();
        };
        ValueEditor.prototype.markup = function () {
            return "<ul class=\"grow h-flex\" {{versionValues}}></ul>";
        };
        ValueEditor.prototype.projectLoaded = function (project) {
            (_a = this.versionValues).splice.apply(_a, [0, this.versionValues.length].concat(project.versions.map(function (version) { return new quill.VersionValues(version); })));
            var _a;
        };
        __decorate([
            Bind({})
        ], ValueEditor.prototype, "versionValues", void 0);
        __decorate([
            Template()
        ], ValueEditor.prototype, "markup", null);
        __decorate([
            Subscribe('project-loaded')
        ], ValueEditor.prototype, "projectLoaded", null);
        ValueEditor = __decorate([
            Construct({ selector: 'value-editor' })
        ], ValueEditor);
        return ValueEditor;
    }(Widget));
    quill.ValueEditor = ValueEditor;
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
    var NodeIcon;
    (function (NodeIcon) {
        NodeIcon[NodeIcon["string"] = 'fa-font'] = "string";
        NodeIcon[NodeIcon["text"] = 'fa-align-justify'] = "text";
        NodeIcon[NodeIcon["number"] = 'fa-thermometer'] = "number";
        NodeIcon[NodeIcon["fraction"] = 'fa-pie-chart'] = "fraction";
        NodeIcon[NodeIcon["date"] = 'fa-calendar'] = "date";
        NodeIcon[NodeIcon["datetime"] = 'fa-clock'] = "datetime";
        NodeIcon[NodeIcon["boolean"] = 'fa-toggle-on'] = "boolean";
        NodeIcon[NodeIcon["list"] = 'fa-database'] = "list";
        NodeIcon[NodeIcon["enum"] = 'fa-list-alt'] = "enum";
    })(NodeIcon = quill.NodeIcon || (quill.NodeIcon = {}));
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
        CustomTreeNode.prototype.blur = function (ev) {
            this.element.focus();
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
        CustomTreeNode.prototype.hasChildren = function () {
            return this.children.length > 0;
        };
        CustomTreeNode.prototype.allParentsOpen = function () {
            var p = this.parent;
            while (p) {
                if (!p.open) {
                    return false;
                }
                p = p.parent;
            }
            return true;
        };
        CustomTreeNode.toTreeNode = function (n) {
            var tn = new CustomTreeNode(n.name, n, NodeIcon[n.type]);
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
            On({ event: 'blur', selector: 'input', scope: Scope.Direct })
        ], CustomTreeNode.prototype, "blur", null);
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
    var Rest = feather.xhr.Rest;
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Navigation.prototype.init = function () {
            this.render();
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
        Navigation.prototype.projectSettings = function () {
            this.triggerUp('open-project-settings');
        };
        Navigation.prototype.markup = function () {
            return "\n            <nav class=\"navbar\" role=\"navigation\" aria-label=\"main navigation\">\n              <div class=\"navbar-brand\">\n                <a class=\"navbar-item\" href=\"/\" id=\"logo\">\n                    <img src=\"/assets/images/quill.svg\" alt=\"Quill Logo\">\n                    <span>Quill</span>\n                    <span>{{project.name}}</span>\n                </a>\n              </div>\n              <div class=\"navbar-end\">\n                <a class=\"navbar-item settings\"><Icon name=\"cog\"/>Settings</span></a>\n                <a class=\"navbar-item logout\"><Icon name=\"sign-out\"/>Logout <span class=\"username\">{{user.firstname}}</span></a>\n                <div  class=\"navbar-item\">\n                <p class=\"control has-icons-right\" id=\"search\">\n                  <input class=\"input\" type=\"text\" placeholder=\"Search...\">\n                  <Icon name=\"search\" align-right=\"right\"/>\n                </p>\n                </div>\n              </div>\n            </nav>\n            ";
        };
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
            On({ event: 'click', selector: 'a.settings', preventDefault: true })
        ], Navigation.prototype, "projectSettings", null);
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
    var On = feather.event.On;
    var matches = feather.dom.selectorMatches;
    var isDef = feather.functions.isDef;
    var removeFromArray = feather.arrays.removeFromArray;
    var AjaxWidget = quill.components.AjaxWidget;
    var NodeConfigModal = quill.modal.NodeConfigModal;
    var ProjectConfig = quill.modal.ProjectConfig;
    var isKey = keys.isKey;
    var Key = keys.Key;
    var dummyProject = {
        id: 0,
        name: '',
        structure: [],
        schema: [],
        versions: []
    };
    var ProjectPage = (function (_super) {
        __extends(ProjectPage, _super);
        function ProjectPage(projectId) {
            var _this = _super.call(this) || this;
            _this.nodes = [];
            _this.schemaNodes = [];
            _this.project = dummyProject;
            _this.loading = true;
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
            this.fetchProject();
        };
        ProjectPage.prototype.fetchProject = function (project) {
            this.project = project;
            (_a = this.nodes).splice.apply(_a, [0, this.nodes.length].concat(project.structure.map(quill.CustomTreeNode.toTreeNode)));
            this.triggerDown('project-loaded', project);
            this.triggerDown('visible-nodes', this.getVisibleNodes());
            this.loading = false;
            var _a;
        };
        ProjectPage.prototype.openProjectSettings = function () {
            this.triggerSingleton('show-modal', new ProjectConfig(this.project));
        };
        ProjectPage.prototype.nodeDeselected = function () {
            this.currentTreeNode = undefined;
            this.triggerDown('defocus-other-nodes');
        };
        ProjectPage.prototype.nodeSelected = function (node) {
            node.element.focus();
            this.currentTreeNode = node;
            this.currentTreeNode.selected = true;
            this.triggerDown('defocus-other-nodes', node);
        };
        ProjectPage.prototype.nodeOpened = function (node) {
            console.log(node);
        };
        ProjectPage.prototype.nodeClosed = function (node) {
            console.log(node);
        };
        ProjectPage.prototype.rootTypeSelected = function (type) {
            this.currentRootType = type;
            this.currentTreeNode = undefined;
            this.triggerDown('defocus-other-nodes');
        };
        ProjectPage.prototype.nodeAction = function (action) {
            switch (action) {
                case 'node-add': {
                    this.addNode();
                    break;
                }
                case 'node-edit': {
                    this.currentTreeNode.focusAndEdit();
                    break;
                }
                case 'node-configure': {
                    this.configureNode();
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
            var from = this.findNode(allNodes, mn.from);
            var to = this.findNode(allNodes, mn.to);
            var nodes = isDef(from.parent) ? from.parent.children : this.nodes;
            var toNodes = isDef(to.parent) ? to.parent.children : this.nodes;
            removeFromArray(nodes, [from]);
            if (mn.position === quill.DropPostion.inside) {
                var position = nodes.indexOf(to);
                to.add(from, position + 1);
                to.open = true;
            }
            else {
                var index = toNodes.indexOf(to) + (mn.position === quill.DropPostion.below ? 1 : 0);
                toNodes.splice(index, 0, from);
            }
        };
        ProjectPage.prototype.nodeConfigured = function (conf) {
            console.log(conf);
        };
        ProjectPage.prototype.dragNode = function (drop) {
            quill.Progress.start();
            this.moveNode = __assign({}, drop);
            this.moveNodeCall();
        };
        ProjectPage.prototype.configureNode = function (config) {
            this.triggerSingleton('show-modal', new NodeConfigModal(this.currentTreeNode, config, this.nodeConfigured));
        };
        ProjectPage.prototype.addNode = function () {
            quill.Progress.start();
            if (isDef(this.currentTreeNode)) {
                this.createChildNode();
            }
            else {
                this.createNode();
            }
        };
        ProjectPage.prototype.keyEvent = function (ev) {
            var _this = this;
            if (isDef(this.currentTreeNode) &&
                isKey(ev, Key.C, Key.Plus, Key.Left, Key.Right, Key.Up, Key.Down, Key.Enter) &&
                matches(document.activeElement, 'li.tree-node')) {
                ev.preventDefault();
                if (isKey(ev, Key.Plus)) {
                    this.addNode();
                }
                if (isKey(ev, Key.C)) {
                    this.configureNode();
                }
                if (isKey(ev, Key.Left)) {
                    this.currentTreeNode.openNode(false);
                }
                if (isKey(ev, Key.Right)) {
                    this.currentTreeNode.openNode(true);
                }
                if (isKey(ev, Key.Down, Key.Up)) {
                    var visibleNodes = this.getVisibleNodes();
                    var dir = isKey(ev, Key.Down) ? 1 : -1;
                    var nextNode = visibleNodes[visibleNodes.findIndex(function (v) { return v === _this.currentTreeNode; }) + dir];
                    if (nextNode) {
                        this.nodeSelected(nextNode);
                        var el = this.element.querySelector('.tree-node > .selected');
                        quill.scrollElementIntoView(el);
                    }
                }
                if (isKey(ev, Key.Enter)) {
                    this.currentTreeNode.focusAndEdit();
                }
            }
        };
        ProjectPage.prototype.projectPage = function () {
            return "\n            <panel class=\"fullscreen v-flex\">\n                <navigation class=\"no-grow\"/>\n                <horizontal-split class=\"grow\" id=\"app-split\">\n                  <sidebar class=\"v-flex\">\n                    <tree-actions/>\n                    <scroll-spy class=\"grow\" {{loading}}>\n                      <aside class=\"menu\">\n                        <selectable-tree-label label=\"Structure\" selected={true} type=\"structure\"/>\n                        <ul class=\"tree-view is-marginless\" {{nodes}}/>\n                        <selectable-tree-label label=\"Schemas\" selected={false} type=\"schema\"/>\n                        <ul class=\"tree-view is-marginless\" {{schemaNodes}}/>\n                      </aside>\n                    </scroll-spy>\n                  </sidebar>\n                  <section class=\"v-flex value-section\">\n                     <value-editor class=\"grow v-flex\"/>\n                  </section>\n                </horizontal-split>\n                <footer class=\"no-grow app-footer\"/>\n            </panel>";
        };
        ProjectPage.prototype.getVisibleNodes = function () {
            return this
                .allNodes(this.nodes)
                .filter(function (n) { return !n.parent || n.allParentsOpen(); });
        };
        ProjectPage.prototype.allNodes = function (nodes) {
            return [].concat.apply([], nodes.map(quill.flattenTree));
        };
        ProjectPage.prototype.findNode = function (nodes, id) {
            return nodes.find(function (n) { return parseInt(n.id(), 10) === id; });
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
            Bind()
        ], ProjectPage.prototype, "loading", void 0);
        __decorate([
            Rest({ url: '/projects/{{projectId}}', headers: quill.headers })
        ], ProjectPage.prototype, "fetchProject", null);
        __decorate([
            Subscribe('open-project-settings')
        ], ProjectPage.prototype, "openProjectSettings", null);
        __decorate([
            Subscribe('node-defocused')
        ], ProjectPage.prototype, "nodeDeselected", null);
        __decorate([
            Subscribe('node-focused')
        ], ProjectPage.prototype, "nodeSelected", null);
        __decorate([
            Subscribe('node-opened')
        ], ProjectPage.prototype, "nodeOpened", null);
        __decorate([
            Subscribe('node-closed')
        ], ProjectPage.prototype, "nodeClosed", null);
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
            Subscribe('node-configured')
        ], ProjectPage.prototype, "nodeConfigured", null);
        __decorate([
            Subscribe('node-drop')
        ], ProjectPage.prototype, "dragNode", null);
        __decorate([
            Rest({ url: '/node/{{currentTreeNode.id}}/configure', method: Method.GET, headers: quill.headers })
        ], ProjectPage.prototype, "configureNode", null);
        __decorate([
            On({ event: 'keydown', selector: '.tree-view' })
        ], ProjectPage.prototype, "keyEvent", null);
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
        LoginPage.prototype.requestUnauthorized = function (err) {
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
            return "\n            <scroll-pane class=\"grow\">\n                <div class=\"login\">\n                    <tabs>\n                      <div class=\"form-components\" title=\"ui.login.tabs.login\" icon=\"key\" active>\n                        <Text config=\"{identifierConfig}\"/>\n                        <Text config=\"{passwordConfig}\"/>\n                        <div class=\"block has-text-right\">\n                            <a class=\"button is-primary login-action\" key=\"ui.signin.button\"/>\n                        </div>\n                      </div>\n                      <div class=\"form-components\" title=\"ui.login.tabs.signup\" icon=\"pencil-square-o\">\n                        <Text config=\"{firstnameConfig}\"/>\n                        <Text config=\"{lastnameConfig}\"/>\n                        <Text config=\"{emailConfig}\"/>\n                        <Text config=\"{signupPasswordConfig}\"/>\n                        <div class=\"block has-text-right\">\n                             <a class=\"button is-primary signup-action\" key=\"ui.signup.button\"/>\n                        </div>\n                      </div>\n                      <div class=\"form-components\" title=\"ui.login.tabs.forgot-password\" icon=\"unlock\">\n                        <html-fragment html-key=\"ui.forgot-password.info\"/>\n                        <Text config=\"{forgotPasswordConfig}\"/>\n                        <div class=\"block has-text-right\">\n                             <a class=\"button is-primary forgot-password-action\" key=\"ui.forgot-password.button\"/>\n                        </div>\n                      </div>\n                  </tabs>\n                </div>\n            </scroll-pane>\n            ";
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
        ], LoginPage.prototype, "requestUnauthorized", null);
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
                return "\n            <div class=\"level is-mobile is-marginless tree-actions\">\n              <div class=\"level-left\">\n                 <a class=\"button is-small tooltip\"\n                    action=\"node-add\"\n                    tooltip=\"ui.tooltip.tree-actions.add\">\n                    <Icon name=\"plus\" icon-class=\"is-small\"/>\n                 </a>\n                 <a class=\"button is-small tooltip\"\n                    action=\"node-edit\"\n                    tooltip=\"ui.tooltip.tree-actions.rename\" {{disabled}}>\n                    <Icon name=\"pencil\" icon-class=\"is-small\"/>\n                 </a>\n                 <a class=\"button is-small tooltip\"\n                    action=\"node-configure\"\n                    tooltip=\"ui.tooltip.tree-actions.configure\" {{disabled}}>\n                    <Icon name=\"cog\" icon-class=\"is-small\"/>\n                 </a>\n              </div>\n              <div class=\"level-right\">\n                 <a class=\"button is-small tooltip\"\n                    action=\"node-delete\"\n                    tooltip=\"ui.tooltip.tree-actions.delete\" {{disabled}}>\n                    <Icon name=\"trash-o\" icon-class=\"is-small\"/>\n                 </a>\n              </div>\n            </div>";
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
            return "<progress-bar></progress-bar>\n                    <panel class=\"fullscreen v-flex\" {{pages}}></panel>\n                    <localization translations={translations}/>\n                    <modal-manager/>";
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