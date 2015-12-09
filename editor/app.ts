import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';
import {MapEditor} from './components/map/editor';
import {LoginForm} from './components/login/form';
import {RuleEditor} from './components/rules/editor';
import {RuleEditorToolbar} from './components/toolbar/toolbar';
import {Profile} from './components/profile/profile';


let appTemplate = require<string>('./app.html');
let appCss = require<Webpack.Scss>('./app.scss');

@Component({
    selector: 'app'
})
@View({
    templateUrl: appTemplate,
    styles: [appCss.toString()],
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, RuleEditorToolbar]
})
@RouteConfig([
    { path: '/login', component: LoginForm, as: 'Login' },
    { path: '/map-editor', component: MapEditor, as: 'MapEditor' },
    { path: '/rule-editor', component: RuleEditor, as: 'ScriptEditor' },
    { path: '/profile', component: Profile, as: 'Profile' },
    { path: '/', redirectTo: '/login', as: 'Home' }
])
export class App {
    router: Router;
    location: Location;

    constructor(router: Router, location: Location) {
        this.router = router;
        this.location = location;
    }

    shouldLimitWidth(): boolean {
        return this.location.path() === '/login';
    }
}
