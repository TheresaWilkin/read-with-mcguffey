import React from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Header, Directions, Loading } from './Common';

class Readers extends React.Component {
  render() {
    return (
      <main>
        <Header text="McGuffey's Eclectic Readers" />
        <Directions text="To determine if a reader is suitable for a student, have the student attempt the first lesson. If the student is unable to complete the lesson, the reader is too hard. In cases where the Primer is too difficult, some students will find it beneficial to work with a basic phonics program (such as 'Teach Your Child to Read in 100 Easy Lessons') before beginning McGuffey's Readers. Note that while the Primer begins at a similar level to the First Reader, the First Reader moves more quickly." />
        {this.props.allReadersQuery.loading ? <Loading /> : (<ul>
          {this.props.allReadersQuery.allReaders && this.props.allReadersQuery.allReaders.map(reader =>
            <li key={reader.id}>
              <a href={`/${reader.id}`}>{reader.title}</a>
            </li>
          )}
        </ul>
      )}
      </main>
    )
  }
}

const ALL_READERS_QUERY = gql`
  query AllReadersQuery {
    allReaders(orderBy: order_ASC) {
      id,
      title
    }
  }
`

const ReadersWithQuery = graphql(ALL_READERS_QUERY, {
  name: 'allReadersQuery',
  options: {
    fetchPolicy: 'network-only',
  },
})(Readers)

export default ReadersWithQuery;
