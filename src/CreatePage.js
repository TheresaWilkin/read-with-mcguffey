import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { Header, Directions } from './Common';
class CreatePage extends React.Component {

  state = {
    number: '',
    imageUrl: '',
    words: [],
    story: '',
    comprehension: '',
    review: false,
    religious: false,
  }

  render() {
    return (
        <section>
          <Header text="Add a New Lesson" />
          <Directions text="Fill in the information below to add a new lesson to the reader from which you have just navigated. You can find a link to the full Eclectic Readers below. The submit button will appear when you have added all required information." />
          <a href="https://www.gutenberg.org/ebooks/author/5671">Link to McGuffey's Eclectic Readers</a>
          <div style={{maxWidth: 400, margin: '0 auto'}} className=''>
            {this.state.imageUrl &&
              <img
                src={this.state.imageUrl}
                alt=''
              />}
              <input
                value={this.state.number}
                placeholder='Lesson Number (ie, the first lesson in the reader is "1")'
                type="number"
                onChange={e => this.setState({number: e.target.value})}
                required
              />
            <input
              type="text"
              value={this.state.imageUrl}
              placeholder='Image Url (upload the image to Cloudinary or a similar hosting site)'
              onChange={e => this.setState({imageUrl: e.target.value})}
              required
            />
            <input
              type="text"
              value={this.state.words.join(',')}
              placeholder='Word list (comma-separated)'
              onChange={e => this.setState({words: e.target.value.split(',')})}
            />
            <textarea
              value={this.state.story}
              placeholder='Lesson Text/Story.'
              onChange={e => this.setState({story: e.target.value})}
              required
            />
            <textarea
              value={this.state.comprehension}
              placeholder='Comprehension questions.'
              onChange={e => this.setState({comprehension: e.target.value})}
            />
              <label>
                Lesson contains religious content:
                <input
                  name="religious"
                  type="checkbox"
                  checked={this.state.religious}
                  onChange={e => this.setState({religious: e.target.checked})} />
              </label>
              <div />
              <br/>
              <label>
                Lesson is a review lesson:
                <input
                  name="review"
                  type="checkbox"
                  checked={this.state.review}
                  onChange={e => this.setState({review: e.target.checked})} />
              </label>
            <br />
            {this.state.number &&
              this.state.imageUrl &&
              this.state.story &&
              <button
                className='continue'
                onClick={this.handlePost}
              >
                Submit
              </button>}
          </div>
        </section>
    )
  }

  handlePost = async () => {
    const {number, imageUrl, comprehension, words, story, review, religious} = this.state
    const { reader } = this.props.match.params;
    await this.props.createLessonMutation({variables: {number: parseInt(number), imageUrl, words, story: story.replace(/\n/g, '\\n'), comprehension: comprehension.replace(/\n/g, '\\n'), review, religious, reader}})
    this.props.history.replace('/')
  }

}

const CREATE_LESSON_MUTATION = gql`
  mutation CreateLessonMutation($number: Int!, $imageUrl: String!, $words: [String!], $story: String!, $review: Boolean, $religious: Boolean, $comprehension: String, $reader: ID!) {
    createLesson(number: $number, imageUrl: $imageUrl, words: $words, story: $story, review: $review, religious: $religious, comprehension: $comprehension, readerId: $reader) {
      id
      number
      imageUrl
      words
      story
      review
      religious,
      reader {
        id
      }
    }
  }
`

const CreatePageWithMutation = graphql(CREATE_LESSON_MUTATION, {name: 'createLessonMutation'})(CreatePage)
export default withRouter(CreatePageWithMutation)
