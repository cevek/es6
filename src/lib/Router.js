import {v, Component} from './V.js';
var scrollData = {};
var activeUrl;
var exclMark = false;
var html5History = false;
export function go(url) {
    if (html5History) {
        history.pushState(null, null, url);
        for (var i = 0; i < allRouters.length; i++) {
            var router = allRouters[i];
            router.changeUrl();
        }
    }
    else {
        location.hash = (exclMark ? '!' : '') + url;
    }
    scrollData[location.href] = 0;
}

var allRouters = [];
export class Router extends Component {
    activeComponent;
    activeProps;
    routes = [];
    emptyRoute;

    constructor(props) {
        super(props);
        allRouters.push(this);
    }

    componentDidMount() {
        console.log("componentDidMount");
        window.addEventListener(html5History ? 'popstate' : 'hashchange', ()=> {
            this.changeUrl();
        });
        window.addEventListener('scroll', ()=> {
            if (activeUrl === location.href) {
                scrollData[activeUrl] = window.scrollY;
            }
        });
        this.prepareRoutes(this.props.children);
        this.changeUrl();
    }

    changeUrl() {
        console.log("changeUrl");
        activeUrl = location.href;
        this.changeRoute();
        this.forceUpdate();
    }

    componentDidUpdate() {
        window.scrollTo(0, scrollData[activeUrl] || 0);
    }

    changeRoute() {
        var url = '';
        if (html5History) {
            url = location.pathname;
        }
        else {
            url = location.hash.substr(1);
            if (exclMark && url[0] == '!') {
                url = url.substring(1);
            }
        }

        this.activeComponent = this.emptyRoute;
        for (var i = 0; i < this.routes.length; i++) {
            var {route, handler} = this.routes[i];
            var params = route.check(url);
            if (params) {
                this.activeComponent = handler;
                this.activeProps = params;
            }
        }
    }

    prepareRoutes(children) {
        console.log("prepareRoutes", children);
        this.routes = [];
        for (var i = 0; i < children.length; i++) {
            var handler = children[i].props.handler;
            var path = children[i].props.path;
            var route = path;
            if (typeof path == 'string') {
                if (path === '*') {
                    this.emptyRoute = handler;
                    return;
                }
                else {
                    route = new Route(path);
                }
            }
            this.routes.push({route: route, handler: handler});
        }
    }

    componentWillReceiveProps(newProps) {
        this.prepareRoutes(newProps.children);
        this.changeRoute();
    }

    render() {
        console.log("Router render", v(this.activeComponent));
        return this.root(this.activeComponent ? v(this.activeComponent, {params: this.activeProps}) : null);
    }
}

export class Route {
    regexp;
    names;
    url;

    constructor(url) {
        url = '/' + url.replace(/(^\/+|\/+$)/g, '');
        url = url === '/' ? url : url + '/';
        this.url = url;
        var v;
        var reg = /:([^\/]+)/g;
        var names = [];
        while (v = reg.exec(url))
            names.push(v[1]);
        this.names = names;
        this.regexp = new RegExp('^' + url.replace(/(:([^\/]+))/g, '([^\/]+)') + '?$');
    }

    check(url) {
        var m;
        if (m = this.regexp.exec(url)) {
            var params = {};
            for (var j = 0; j < this.names.length; j++) {
                params[this.names[j]] = m[j + 1];
            }
            return params;
        }
        return null;
    }

    toUrl(params) {
        var url = this.url;
        for (var key in params) {
            var reg = /:([^\/]+)/g;
            url = url.replace(new RegExp(':' + key + '(/|$)'), params[key] + '$1');
        }
        return url;
    }

    goto(params){
        go(this.toUrl(params));
    }

}

export class Page extends Component {

}
