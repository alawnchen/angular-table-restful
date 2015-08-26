    angular.module("angular-table").directive("atTable", ["$filter", '$q', '$rootScope', '$compile', function ($filter, $q, $rootScope, $compile) {
        return {
            restrict: "AC",
            scope: true,
            compile: function (element, attributes, transclude) {
                var table, tc;

                var trElement = angular.element(element.find('tbody').find('tr'));

                if ('ng-click' in trElement[0].attributes) {
                    trElement[0].attributes['ng-click'].value = trElement[0].attributes['ng-click'].value.concat('; markSelected(item)');
                } else {
                    trElement.attr('ng-click', 'markSelected(item)');
                }

                trElement.attr('ng-class', "{'table-selected-row' : item == atConfig.selectedItem}");

                tc = new TableConfiguration(element, attributes);
                table = new Table(element, tc);
                table.compile();
                return {
                    post: function ($scope, $element, $attributes) {
                        table.post($scope, $element, $attributes, $filter, $q, $rootScope);

                        $scope.markSelected = function (item) {
                            if (this.atConfig.selectedItem != item) {
                                this.atConfig.selectedItem = item;
                                return;
                            }

                            this.atConfig.selectedItem = undefined;
                        };

                        if ($attributes.atNoScroll == undefined) {
                            var scroll = angular.element('<div class="table-scroll"></div>');
                            $element.before(scroll);
                            scroll.append($element);
                            $element.find('.scrolled-pagination').insertAfter(scroll).addClass('text-center');
                        }

                        // destroy
                        // se escopo destruido remove eventos
                        $scope.$on('$destroy', function () {

                        });
                    }
                };
            }
        };
    }]);

    angular.module("angular-table").directive("atAttribute", [function () {
        return {
            restrict: "A",
            compile: function (element, attributes, transclude) {
                var attribute;
                attribute = element.attr("at-attribute");
                if (!attribute) {
                    throw "at-attribute specified without value: " + (element.html());
                }
                if (element.children().length == 0) {
                    if (attributes.atFilter) {
                        return element.append("{{item." + attribute + " | " + attributes.atFilter + "}}");
                    } else {
                        return element.append("{{item." + attribute + "}}");
                    }
                }
            }
        };
    }]);