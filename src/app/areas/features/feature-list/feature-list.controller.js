class FeatureListCtrl {
    constructor(
        $http,
        $q,
        $localStorage,
        FeatureService,
        AccountService,
        $filter
    ) {
        'ngInject';

        this._FeatureService = FeatureService;
        this.$localStorage = $localStorage;
        this._AccountService = AccountService;
        this._$filter = $filter;
    }

    $onInit() {
        this.features = this._FeatureService._features;

        this.features.$loaded().then(features => {
            angular.forEach(features, feature => {
                feature.accountsMeta = [];
                feature.totalValue = 0;
                feature.averageValue = 0;
                angular.forEach(feature.accounts, account => {
                    this._AccountService
                        .getAccount(account.accountKey)
                        .then(curAccount => {
                            feature.accountsMeta.push(curAccount);
                            feature.totalValue += parseInt(curAccount.value);
                            feature.averageValue =
                                feature.totalValue /
                                parseInt(feature.accounts.length);
                        });
                });
            });
            
            // this.filterFeatures();
        });

        this.searchFeatures = '';
        // set default
        if (typeof this.getTablePrefs() === 'undefined') {
            this.resetTablePrefs();
        } else {
            this.tablePrefs = {
                type: this.getTablePrefs().type,
                reverse: this.getTablePrefs().reverse,
                width: this.getTablePrefs().width,
                columns: this.getTablePrefs().columns
            };
        }
    }

    changeColumnSort(col, reverse) {
        this.tablePrefs.reverse = false;
        if (this.tablePrefs.type === col) {
            this.tablePrefs.reverse = !reverse;
        } else {
            this.tablePrefs.reverse = false;
            this.tablePrefs.type = col;
        }
        this.setTablePrefs(this.tablePrefs);
    }

    changeTableWidth(width) {
        this.tablePrefs.width = width;
        this.setTablePrefs(this.tablePrefs);
    }

    changeColumnVisibility(column, key) {
        this.setTablePrefs(this.tablePrefs);
    }

    setTablePrefs(prefs) {
        this.$localStorage.tablePrefsSaved = prefs;
    }

    getTablePrefs() {
        return this.$localStorage.tablePrefsSaved;
    }

    resetTablePrefs() {
        this.tablePrefs = {
            type: 'dateCreated',
            reverse: true,
            width: 'container',
            columns: {
                status: {
                    id: 'status',
                    display: true,
                    displayName: 'Status'
                },
                location: {
                    id: 'location',
                    display: true,
                    displayName: 'Location'
                },
                labels: {
                    id: 'labels',
                    display: true,
                    displayName: 'Labels'
                },
                summary: {
                    id: 'subject',
                    display: true,
                    displayName: 'Summary'
                },
                originalRequester: {
                    id: 'accountsMeta[0].name',
                    display: true,
                    displayName: 'Original Requester'
                },
                date: {
                    id: 'dateCreated',
                    display: true,
                    displayName: 'Date'
                },
                totalValue: {
                    id: 'totalValue',
                    display: true,
                    displayName: 'Total Value',
                    thAlign: 'text-right'
                },
                averageValue: {
                    id: 'averageValue',
                    display: false,
                    displayName: 'Average Value',
                    thAlign: 'text-right'
                }
            }
        };
        this.searchFeatures = '';
        this.setTablePrefs(this.tablePrefs);
    }

    updateFilters(filterParams) {
        this.filterParams = filterParams;
        this.filterFeatures();
    }

    filterFeatures() {
        this.filteredFeatures = this._$filter('featuresFilter')(
            this.features,
            this.filterParams
        );
    }
}

export default FeatureListCtrl;
