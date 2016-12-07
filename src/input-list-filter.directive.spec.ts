import {InputListFilterDirective} from "./input-list-filter.directive";
interface IInputListFilterEnvironmentScope extends angular.IScope
{
    list: IItem[];
    filteredList: IItem[];
}

interface IItem{
    description: string;
    object: IItemObject;
}

interface IItemObject
{
    key: string;
}


describe('directive: input-list-filter', function () {
    let $compile: ng.ICompileService,
        scope: IInputListFilterEnvironmentScope,
        directiveUsage: string = `
<np-input-list-filter placeholder="{{::('NP_INVOICES_EDIT.FIND_ADDRESS'| translate)}}"
    list-source="list"
    list-filtered="filteredList"
    filterter-keys="['description', 'object.key']"></np-input-list-filter>
`;

    angular
        .module('input-list-filter_app', ["pascalprecht.translate"])
        .constant('NP_INPUT_LIST_FILTER_THROTTLE_TIME', 0)

        .directive('npInputListFilter', InputListFilterDirective.Factory)
    ;

    beforeEach(angular.mock.module('input-list-filter_app'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should render init data right", function () {
        scope.list = [
            {
                description: "pen",
                object: {
                    key: "tits"
                }
            },{
                description: "tpen",
                object: {
                    key: "tits"
                }
            },{
                description: "big",
                object: {
                    key: "pencil"
                }
            },
            {
                description: "big",
                object: {
                    key: "kill"
                }
            },

            {
                description: "git",
                object: {
                    key: "bigger"
                }
            },
            {
                description: "git",
                object: {
                    key: "git"
                }
            },{
                description: "git",
                object: {
                    key: "git"
                }
            },{
                description: "git",
                object: {
                    key: "git"
                }
            },{
                description: "git",
                object: {
                    key: "git"
                }
            },{
                description: "git",
                object: {
                    key: "git"
                }
            },{
                description: "git",
                object: {
                    key: "git"
                }
            },{
                description: "git",
                object: {
                    key: "git"
                }
            },
        ];

        scope.filteredList = [];

        const element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(scope.filteredList.length).toEqual(10);
        element.find('input').val('pen').keyup();;
        scope.$digest();
        expect(scope.filteredList.length).toEqual(3);
    });
});