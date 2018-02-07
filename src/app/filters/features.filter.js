export default function featuresFilter() {
    'ngInject';

    return (features, filterParams) => {
        let output = [];

        angular.forEach(features, feature => {
            let statusMatch = false;
            let labelMatch = false;
            let locationMatch = false;
            let activeStatusMatch = false;

            // check status
            if (filterParams.status.indexOf(feature.status) > -1) {
                statusMatch = true;
            }

            // check label
            for (let label of filterParams.labels) {
                if (label === 'undefined') {
                    if (!feature.labels) {
                        labelMatch = true;
                        break;
                    }
                }
                if (feature.labels && feature.labels.indexOf(label.$id) > -1) {
                    labelMatch = true;
                    break;
                }
            }

            // check location
            for (let location of filterParams.locations) {
                if (location === 'undefined') {
                    if (!feature.location) {
                        locationMatch = true;
                        break;
                    }
                }
                if (
                    feature.location &&
                    feature.location.indexOf(location.$id) > -1
                ) {
                    locationMatch = true;
                    break;
                }
            }

            // check archive
            if (filterParams.viewArchived === true) {
                if (feature.activeState > 0) {
                    activeStatusMatch = true;
                }
            } else if (feature.activeState > 1) {
                activeStatusMatch = true;
            }

            if (
                statusMatch &&
                labelMatch &&
                locationMatch &&
                activeStatusMatch
            ) {
                output.push(feature);
            }
        });

        return output;
    };
}
