import { Meteor } from 'meteor/meteor';
import { makeExecutableSchema } from "graphql-tools";
import {Profession2Student, Students} from "../students/students";

const typeDefs = [`
  type Student {
    _id: String
    name: String
    speciality: String
    year: Int
    isArchive: Boolean
  }
  
  type Query {
    students: [Student]
  }
  
  type Mutation {
    insertStudent(_id: String, name: String!, speciality: String!, year: Int!, isArchive: Boolean!): Student
  }
  
  schema {
    query: Query
  }
  
`];

const resolvers = {
  Query: {
    students(root, args, context) {
      const query = {};
      const options = {
      };
      return Students.find(query, options).fetch();
    },
  },

  Mutation: {
    insertStudent(root, args, context) {
      return Promise
        .resolve()
        .then(function () {
          const profession2student = Profession2Student.find({
              studentId: args._id,
            },
            { sort: { createAt: 1 }}).fetch();
        })
        .then(function () {
          let studentData = {
            name: args.name,
            speciality: args.speciality,
            year: args.year,
            isArchive: false
          };

          if (args._id) {
            studentData._id = args._id;
          }

          studentData._id = Students.insert(messageData);

          return studentData;
        });
    },
  },

  /*Subscription: {
    professions(root, args, context) {
      return Profession2Student.find({
          studentId: args._id,
        },
        { sort: { createAt: 1 }});
    },
  },*/

  Student: {
    _id: (student) => student._id,
    name: (student) => student.name,
    speciality: (student) => student.speciality,
    year: (student) => student.year,
    isArchive: (student) => student.isArchive,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export { schema, typeDefs, resolvers };