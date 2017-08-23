import angular from 'angular';

// Create the module where our functionality can attach to
let featureDetailModule = angular.module('app.feature-detail', []);

// Include our UI-Router config settings
import FeatureDetailConfig from './feature-detail.config';
featureDetailModule.config(FeatureDetailConfig);

// Controllers
import FeatureDetailCtrl from './feature-detail.controller';
featureDetailModule.controller('FeatureDetailCtrl', FeatureDetailCtrl);

import Comment from './components/comment/comment.component';
featureDetailModule.component('comment', Comment);

import Status from './components/status/status.component';
featureDetailModule.component('status', Status);

export default featureDetailModule;