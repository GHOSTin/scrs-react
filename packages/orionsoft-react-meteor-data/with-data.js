import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { withTracker } from 'meteor/react-meteor-data';

export default function (getMeteorData, opts) {
  return function (ComposedComponent) {
    //return createContainer(Object.assign({ getMeteorData }, opts), ComposedComponent)
    return withTracker(Object.assign({ getMeteorData }, opts))(ComposedComponent)
  }
}