import React from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { Header, Loading, Directions } from './Common';

class Lessons extends React.Component {
  isReligious({ religious }) {
    return religious ? '(Religious)' : '';
  }

  render() {
    const { allLessons } = this.props.allLessonsQuery;

    return (
      <div>
        <Header text={allLessons ? allLessons[0].reader.title : 'Reader'} />
        <Directions text="Begin by attempting the first lesson. If the student is unable to complete the first lesson, the student is not prepared for this reader." />
        { this.props.allLessonsQuery.loading ? <Loading /> : (<ul>
          {allLessons && allLessons.map(lesson => (
            <li key={lesson.id}>
              <a href={`/lesson/${lesson.id}`}>
                Lesson {lesson.number} {this.isReligious(lesson)} {lesson.review && '-- Review'}
              </a>
            </li>
          ))}
        </ul>)}
        <a href={`/${this.props.match.params.reader}/new`}>You can help this project by adding new lessons to the {allLessons ? allLessons[0].reader.title : 'Reader'}.</a>
      </div>
    )
  }
}

const LESSON_QUERY = gql`
  query LessonQuery($id: ID!) {
    allLessons(orderBy: number_ASC, filter: {
    reader: { id: $id },
  }) {
    number,
    religious,
    id,
    review,
    reader {
      title
    }
  }
  }
`

const LessonsWithGraphQL = compose(
  graphql(LESSON_QUERY, {
    name: 'allLessonsQuery',
    // see documentation on computing query variables from props in wrapper
    // http://dev.apollodata.com/react/queries.html#options-from-props
    options: ({match}) => ({
      variables: {
        id: match.params.reader,
      },
    }),
  })
)(Lessons)

export default withRouter(LessonsWithGraphQL)
