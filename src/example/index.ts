import { ExampleAppComponent } from './example-app.component';
import "../input-list-filter.scss";
import "./example.scss";
import { InputListFilterDirective } from "../index";

angular.module("app", ["pascalprecht.translate",])
    .constant('STF_INPUT_LIST_FILTER_THROTTLE_TIME', 100) // throtle  time of reaction on editing
    .component('exampleApp', new ExampleAppComponent())
    .directive('stfInputListFilter', InputListFilterDirective.Factory)
    ;


angular.bootstrap(document, ["app"], {
    strictDi: true
});  