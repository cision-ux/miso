class FiltersCtrl {
    constructor(LabelService, $scope) {
        'ngInject';

        this._LabelService = LabelService;
        this._$scope = $scope;
    }

    $onInit() {
        this.loading = true;

        this.filterParams = {
            status: [],
            locations: [],
            labels: [],
            viewArchived: false
        };

        this.filterParams.status = [
            {
                displayName: 'Received',
                checked: true
            },
            {
                displayName: 'Under Review',
                checked: true
            },
            {
                displayName: 'Moved to Backlog',
                checked: true
            },
            {
                displayName: 'Released',
                checked: true
            },
            {
                displayName: 'Closed',
                checked: true
            }
        ];

        // build locations
        this._LabelService._locations.$loaded(locations => {
            let activeLocations = [];
            locations.filter(location => {
                if (!location.deleted) {
                    activeLocations.push(location);
                }
            });
            let filterLocations = activeLocations.map(location => {
                location.checked = true;
                return location;
            });
            this.filterParams.locations = filterLocations;
            this.filterParams.locations.push({
                $id: 'undefined',
                checked: true
            });
            this.updateFilters({ filterParams: this.filterParams });
        });

        // build labels
        this._LabelService._labels.$loaded(labels => {
            let filterLabels = labels.map(label => {
                label.checked = true;
                return label;
            });
            this.filterParams.labels = filterLabels;
            this.filterParams.labels.push({
                $id: 'undefined',
                checked: true
            });
            this.updateFilters({ filterParams: this.filterParams });
        });
    }

    toggleStatus(statusName) {
        let matchIdx = null;

        for (let [idx, status] of this.filterParams.status.entries()) {
            if (status.displayName === statusName) {
                matchIdx = idx;
                break;
            }
        }

        if (matchIdx !== null) {
            this.filterParams.status[matchIdx].checked = !this.filterParams
                .status[matchIdx].checked;
        }

        this.updateFilters({ filterParams: this.filterParams });
    }

    toggleLabel(labelId) {
        let matchIdx = null;

        for (let [idx, label] of this.filterParams.labels.entries()) {
            if (label.$id === labelId) {
                matchIdx = idx;
                break;
            }
        }
        if (matchIdx !== null) {
            this.filterParams.labels[matchIdx].checked = !this.filterParams
                .labels[matchIdx].checked;
        }

        this.updateFilters({ filterParams: this.filterParams });
    }

    toggleLocation(locationId) {
        let matchIdx = null;

        for (let [idx, location] of this.filterParams.locations.entries()) {
            if (location.$id === locationId) {
                matchIdx = idx;
                    break;
                }
            }
        if (matchIdx !== null) {
            this.filterParams.locations[matchIdx].checked = !this.filterParams
                .locations[matchIdx].checked;
        }

        this.updateFilters({ filterParams: this.filterParams });
    }

    toggleViewArchived() {
        this.filterParams.viewArchived = !this.filterParams.viewArchived;
        this.updateFilters({ filterParams: this.filterParams });
    }

    checkAll(filterType) {
        angular.forEach(
            this.filterParams[filterType],
            filter => (filter.checked = true)
        );
        this.updateFilters({ filterParams: this.filterParams });
    }

    uncheckAll(filterType) {
        angular.forEach(
            this.filterParams[filterType],
            filter => (filter.checked = false)
        );
        this.updateFilters({ filterParams: this.filterParams });
    }

    setFiltersToCachedParams() {
        this.filterParams = this.cachedFilterParams;
    }

    resetFiltersToDefault() {
        this.filterParams = {
            status: [],
            labels: [],
            locations: [],
            viewArchived: false
        };

        this.filterParams.status = this.statusList.slice(0);
        this.checkAllLabels();

        this.checkAllLocations();
        this.resetFilterExpiration();
    }

    $onChanges(changes) {
        if (changes.cachedFilterParams && !changes.cachedFilterParams.previousValue) {
            this.setFiltersToCachedParams();
        }

        if (changes.expiredFilters && changes.expiredFilters.currentValue) {
            this.resetFiltersToDefault();
        }
    }
}

let Filters = {
    bindings: {
        resetFilters: '&',
        expiredFilters: '<',
        resetFilterExpiration: '&',
        cachedFilterParams: '<',
        updateFilters: '&'
    },
    controller: FiltersCtrl,
    templateUrl: 'components/list-helpers/filters/filters.html'
};

export default Filters;
