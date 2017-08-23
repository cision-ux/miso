export default class LabelService {
  constructor($firebaseArray, $firebaseObject) {
    'ngInject';

    this._$firebaseObject = $firebaseObject;

    this._productsRef = firebase.database().ref('products');
    this._products = $firebaseArray(this._productsRef);

    this._locationsRef = firebase.database().ref('locations');
    this._locations = $firebaseArray(this._locationsRef);

    this._labelsRef = firebase.database().ref('labels');
    this._labels = $firebaseArray(this._labelsRef);

  }

  addLocation(name, description, labels) {
    return this._locations.$add({
      displayName: name,
      description: description || null,
      labels: labels || null
    })
  }

  addLabel(name, description) {
    return this._labels.$add({
      displayName: name,
      description: description || null
    })
  }

  addLabelToLocation(object) {
    return this.getLocation(object.location).$loaded().then(
      (location) => {
        angular.forEach(object.labels, (label) => {
          if (location.labels.indexOf(label) === -1) {
            location.labels.push(label)
          }
        })
        location.$save();
      }
    )
  }

  getLocation(id) {
    return this._$firebaseObject(this._locationsRef.child(id))
  }

  getLabel(id) {
    return this._$firebaseObject(this._labelsRef.child(id))
  }

}