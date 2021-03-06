class FeedbackCreateCtrl {
    constructor(
        AccountService,
        FeatureService,
        $state,
        profile,
        currentAuth,
        LabelService
    ) {
        'ngInject';

        this._$state = $state;

        this._AccountService = AccountService;
        this._FeatureService = FeatureService;
        this._LabelService = LabelService;
        this._currentAuth = currentAuth;
        this._profile = profile;

        this.productLocations = [];
        this.locationLabels = [];

        // Toggle selection for a label
        this.toggleSelection = function toggleSelection(label) {
            var idx = this.featureForm.labels.indexOf(label);

            // Is currently selected
            if (idx > -1) {
                this.featureForm.labels.splice(idx, 1);
            } else {
                // Is newly selected
                this.featureForm.labels.push(label);
            }
        };
    }

    getProductLocations() {
        this._LabelService
            .getProduct(this.featureForm.product)
            .$loaded()
            .then(product => {
                this.productLocations = [];
                product.locations.forEach(locationId => {
                    this._LabelService
                        .getLocation(locationId)
                        .$loaded()
                        .then(location => {
                            this.productLocations.push(location);
                        });
                });
            });
    }

    getLocationLabels() {
        this._LabelService
            .getLocation(this.featureForm.location)
            .$loaded()
            .then(location => {
                this.locationLabels = [];
                location.labels.forEach(labelId => {
                    this._LabelService
                        .getLabel(labelId)
                        .$loaded()
                        .then(label => {
                            this.locationLabels.push(label);
                        });
                });
            });
    }

    submitFeature() {
        this._FeatureService
            .add(
                this.featureForm,
                this._currentAuth,
                this.accountForm.selectedAccounts
            )
            .then(
                () => {
                    this._$state.go('app.feature-list');
                },
                err => {
                    this.featureForm.isSubmitting = false;
                    console.log(err);
                }
            );
    }

    addFeature() {
        if (this.featureForm.labelOther) {
            this._LabelService
                .addLabel(this.featureForm.labelOther)
                .then(newLabel => {
                    this.featureForm.labels = newLabel.key;
                    this.submitFeature();
                });
        } else {
            this.submitFeature();
        }
    }
}

export default FeedbackCreateCtrl;
