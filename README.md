stf-input-list-filter Directive (list filtration). 
============================================================================================================================

Directive for filtering list of items for Angular1. You can easy take list of objects, choose value of property for comparison, input text in the input control and you get the appropriate filtered list of objects.

### Атрибути
- [x]  listSource       - collection
- [x]  listFiltered     - output filtered collection
- [x]  filterterKeys    - array of key with name of field. It is the fields  which will compare  with inputed value ``` key ``` or ``` key.subKey ``` and etc. ``` filtered-keys="['key', 'key.subKey']" ```
- [x]  placeholder      - placeholder
- [x]  ngModel          - ngModel

### Installing 
```sh
npm install --save stf-input-list-filter
```


### Example using

```javascript

    import "stf-input-list-filter/src/input-list-filter.scss";
    import { InputListFilterDirective } from "stf-input-list-filter";

    angular.module("app", ["pascalprecht.translate",])
    .constant('STF_INPUT_LIST_FILTER_THROTTLE_TIME', 100) // throtle  time of reaction on editing
    .directive('stfInputListFilter', InputListFilterDirective.Factory)
    ;
```

```
<stf-input-list-filter ng-model="value" placeholder="Filter" list-source="$ctrl.addresses" limit="50" list-filtered="$ctrl.addressFiltered" filterter-keys="['description']"></stf-input-list-filter>

<ul>
    <li ng-repeat="address in $ctrl.addressFiltered  track by address.id">{{address.description}}</li>
</ul>
```
