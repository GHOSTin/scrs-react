import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Professions } from '../../api/professions/professions';
import ProfessionsPage from '../pages/ProfessionsPage';

const ProfessionsPageContainer = withTracker( () => {
    const profHandler = Meteor.subscribe('professions');
    const loading = !profHandler.ready();
    const professions = Professions.find({});
    const listExists = !loading && !!professions;
    return {
        loading,
        listExists: listExists,
        professions: listExists ? professions.fetch() : [],
    };
})(ProfessionsPage);

export default ProfessionsPageContainer;
