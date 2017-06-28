/**
 * Created by oleg on 14.06.2016.
 */
import * as angular from "angular";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import * as _ from "lodash";

export interface IScopeInputListFilter extends angular.IScope {
    listSource: any[];
    listFiltered: any[];
    filterterKeys: any[],
    placeholder: string,
    limit: number,
    model: string,
}

export class InputListFilterDirective implements angular.IDirective {
    public template: string = `<input placeholder="{{::placeholder}}" ng-model="model" type="search" class="np-input-list-filter _md-text" >`;
    public restrict: string = 'E';
    public scope: any = {
        listSource: '<',
        listFiltered: '=',
        placeholder: '@',
        filterterKeys: '<',
        limit: "<"
    };
    require = '?ngModel';

    constructor(protected $translate: angular.translate.ITranslateService, protected _NP_INPUT_LIST_FILTER_THROTTLE_TIME: number) {

    }

    link(scope: IScopeInputListFilter, element: JQuery, attrs, ngModel: angular.INgModelController) {
        let jqInput = element.find('input');
        let observableInput: Observable<any> = Observable.fromEvent(<any>jqInput, 'keyup').throttleTime(this._NP_INPUT_LIST_FILTER_THROTTLE_TIME);

        if (!_.isArray(scope.listFiltered)) {
            scope.listFiltered = [];
        }

        scope.$watchCollection(() => scope.listSource, () => {
            this.filterList(<string>jqInput.val() || null, scope);
        });


        let inputSubscription = observableInput.subscribe((event: any) => {
            this.filterList(<string>jqInput.val(), scope);

            if(ngModel){
                ngModel.$setViewValue(jqInput.val());
            } else{
            
            scope.$applyAsync();
            }
        });

        let ngModelInputSubscriber = Observable.create(function (observer) {
            if (ngModel) {
                ngModel.$formatters.push(
                    (val) => {
                        if (val !== undefined)
                            observer.next(val);
                        return val;
                    }
                );

                let index = ngModel.$formatters.length - 1;

                return function () {
                    ngModel.$formatters.splice(index, 1);
                }
            }
        })
            .throttleTime(this._NP_INPUT_LIST_FILTER_THROTTLE_TIME)
            .subscribe((val) => {
                scope.model = val;
                this.filterList(val, scope);
                scope.$applyAsync();
            });
        ;

        scope.$on('$destroy', () => {
            inputSubscription.unsubscribe();
            ngModelInputSubscriber.unsubscribe();
        });
    }

    public static Factory($translate: angular.translate.ITranslateService, NP_INPUT_LIST_FILTER_THROTTLE_TIME: number) {
        return new InputListFilterDirective($translate, NP_INPUT_LIST_FILTER_THROTTLE_TIME);
    }

    public filterList(text: string, scope: IScopeInputListFilter) {
        if (_.isString(text))
            text = text.trim().toLocaleLowerCase();
        if (!text || !scope.listSource || !scope.listSource.length || !scope.filterterKeys) {
            if (!text) {
                scope.listFiltered.length = 0;
                scope.listFiltered.push(...scope.listSource);

                if (scope.listFiltered.length > (scope.limit || 10))
                    scope.listFiltered.length = (scope.limit || 10);
            }

            return;
        }
        scope.listFiltered.length = 0;
        let words: string[] = text.split(/[.| |,|\-|:]/);
        let filtered: any[] = scope.listSource;
        _.each(words, (world: string) => {
            filtered = _.filter(filtered,
                (object: Object) => {
                    let result: boolean;
                    _.each(scope.filterterKeys, (keyObject: string) => {
                        let val: any = _.get(object, keyObject);
                        if (_.isString(val)) {
                            val = val.toLocaleLowerCase();
                            if (val && _.isString(val) && val.indexOf(world) !== -1) {
                                result = true;
                                return !result;
                            } else if (val && _.isString(val) && val.indexOf(world) === -1) {
                                result = false;
                            }
                        }
                    });

                    return result;
                });
        });
        scope.listFiltered.push(...filtered);

        if (scope.listFiltered.length > (scope.limit || 10))
            scope.listFiltered.length = (scope.limit || 10);
    }
}

InputListFilterDirective.Factory.$inject = ['$translate', "STF_INPUT_LIST_FILTER_THROTTLE_TIME"];