import React from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter} from 'react-router-dom'
import gql from 'graphql-tag'
import {
  Header,
  FlashCard,
  LearnNew,
  Loading,
  Directions
} from './Common';
import {
  LETTERS,
  LETTERS_PRACTICE,
  WORDS,
  WORDS_PRACTICE,
  STORY,
  COMPREHENSION,
  PICTURE,
  RETRY,
} from './Constants';

const lessonChanged = (oldProps, newProps) =>
  oldProps.lessonQuery.Lesson !== newProps.lessonQuery.Lesson;

class Lesson extends React.Component {
  constructor() {
    super();
    this.state = {
      words: [],
      letters: [],
      stage: LETTERS,
      index: 0,
      error: ''
    };
    this.handleContinue = this.handleContinue.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (lessonChanged(this.props, nextProps)) {
      if (nextProps.lessonQuery.Lesson == null) {
        this.setState({ error: 'Lesson not found.' });
        return;
      }
      let stage = LETTERS;
      if (!nextProps.lessonQuery.Lesson.letters.length) {
        stage = WORDS;
        if (!nextProps.lessonQuery.Lesson.words.length) {
          stage = STORY;
        }
      }
      this.setState({
        words: nextProps.lessonQuery.Lesson.words || [],
        letters: nextProps.lessonQuery.Lesson.letters || [],
        stage,
      });
    }
  }

  render() {
    if (this.props.lessonQuery.loading) {
      return <div><Header text="Lesson" /><Loading /></div>;
    }

    const { Lesson } = this.props.lessonQuery;
    if (!Lesson) {
      return (
        <div>
          <p>Error! {this.state.error}</p>
          <a href="/">Return to home?</a>
        </div>
      );
    }
    return (
      <div>
        {this.renderHeader()}
        {this.renderMain(Lesson)}
      </div>
    );
  }

  handleContinue() {
    const { index, stage, letters, words } = this.state;
    if (stage === LETTERS) {
      if (index + 1 < letters.length) {
        this.setState({ index: this.state.index + 1 });
      } else {
        this.setState({ index: 0, stage: LETTERS_PRACTICE });
      }
    } else {
      if (index + 1 < words.length) {
        this.setState({ index: this.state.index + 1 });
      } else {
        this.setState({ index: 0, stage: WORDS_PRACTICE });
      }
    }
  }

  handleAnswer(isCorrect) {
    const { stage, letters, words } = this.state;
    if (stage === LETTERS_PRACTICE) {
      if (isCorrect) {
        if (letters.length <= 1) {
          this.setState({ stage: WORDS });
        }
        this.setState({ letters: letters.slice(1) });
      } else {
        this.setState({ letters: [ ...letters.slice(1), letters[0] ]});
      }
    } else if (stage === WORDS_PRACTICE) {
      if (isCorrect) {
        if (words.length <= 1) {
          this.setState({ stage: STORY });
        }
        this.setState({ words: words.slice(1) });
      } else {
        this.setState({ words: [ ...words.slice(1), words[0] ]});
      }
    } else if (stage === STORY){
      if (isCorrect) {
        this.setState({ stage: COMPREHENSION });
      } else {
        this.setState({ stage: RETRY });
      }
    } else if (stage === COMPREHENSION) {
      if (isCorrect) {
        this.setState({ stage: PICTURE });
      } else {
        this.setState({ stage: RETRY });
      }
    }
  }

  renderHeader() {
    switch (this.state.stage) {
      case LETTERS:
        return <Header text="Learning New Letters" />;
      case LETTERS_PRACTICE:
        return <Header text="Practicing New Letters" />;
      case WORDS:
        return <Header text="Learning New Words" />;
      case WORDS_PRACTICE:
        return <Header text="Practicing New Words" />;
      case STORY:
        return <Header text="Reading the Story" />;
      case COMPREHENSION:
        return <Header text="Comprehending the Story" />;
      case PICTURE:
        return <Header text="Lesson Completed" />;
      case RETRY:
        return <Header text="Try Again Tomorrow" />;
      default:
        return <p>Error, please refresh page.</p>
    }
  }

  renderMain(Lesson) {
    switch (this.state.stage) {
      case LETTERS:
        return this.renderLetter();
      case LETTERS_PRACTICE:
        return this.renderLetterPractice();
      case WORDS:
        return this.renderWord();
      case WORDS_PRACTICE:
        return this.renderWordPractice();
      case STORY:
        return this.renderStory(Lesson.story);
      case COMPREHENSION:
        return this.renderComprehension(Lesson, this.handleAnswer);
      case PICTURE:
        return this.renderPicture(Lesson);
      case RETRY:
        return this.renderRetry(Lesson);
      default:
        return <p>Error, please refresh page.</p>
    }
  }

  renderLetter() {
    const { letters, index } = this.state;
    if (!letters[index]) {
      console.log(letters)
      return <p>Error, {index}, {letters.map(l => <p>{l}</p>)}</p>;
    }
    return (
      <LearnNew
        item={letters[index].letter}
        text={`This letter says "${letters[index].letter}" (as in "${letters[index].example}"). What does this letter say?`}
        handleContinue={this.handleContinue}
      />);
  }
  renderLetterPractice() {
    return (
      <FlashCard
        item={this.state.letters[0].letter}
        handleAnswer={this.handleAnswer}
      />);
  }
  renderWord() {
    const { words, index } = this.state;
    return (
      <LearnNew
        item={words[index]}
        text={`This word is "${words[index]}". What is this word?`}
        handleContinue={this.handleContinue}
      />);
  }
  renderWordPractice() {
    return (
      <FlashCard
        item={this.state.words[0]}
        handleAnswer={this.handleAnswer}
      />);
  }
  renderStory(story) {
    return (
      <FlashCard
        item={story}
        handleAnswer={this.handleAnswer}
      />);
  }
  renderComprehension(lesson, handleAnswer) {
    const text = lesson.comprehension || "1. What happened in the lesson? \\n 2. What do you expect to see in the picture?";
    return (
      <main>
        <Directions text="Ask the student the questions below, and mark whether the student was able to answer the questions sensibly." />
        <section className="item">
          <h2>{text.split('\\n').map(function(item, i) {
            return (
              <span key={i}>
                {item}
                <div className="space" />
                <br/>
              </span>
            )
          })}</h2>
        </section>
        <section>
          <button className="correct" onClick={() => handleAnswer(true)}>Answered Logically</button>
          <button className="incorrect" onClick={() => handleAnswer(false)}>Struggled to Answer</button>
        </section>
      </main>
    );
  }
  renderPicture(lesson) {
    return (
      <div className="result">
        <img src={lesson.imageUrl} alt={`Lesson ${lesson.number}`} />
        <h2>Congratulations!</h2>
        <p>Let's read the next lesson tomorrow.</p>
        <a href={`/${lesson.reader.id}`}>Return to {lesson.reader.title}</a>
      </div>
    );
  }
  renderRetry(lesson) {
    return (
      <div className="result">
        <h2>You worked hard today!</h2>
        <p>Let's read this lesson again tomorrow.</p>
        <a href={`/${lesson.reader.id}`}>Return to {lesson.reader.title}</a>
      </div>
  );
  }
}

const LESSON_QUERY = gql`
  query LessonQuery($id: ID!) {
    Lesson(id: $id) {
       number,
       imageUrl,
       words,
       story,
       comprehension,
       letters {
         example,
         letter
       },
       reader {
         title,
         id
       },
       id
     }
  }
`

const LessonWithGraphQL = compose(
  graphql(LESSON_QUERY, {
    name: 'lessonQuery',
    // see documentation on computing query variables from props in wrapper
    // http://dev.apollodata.com/react/queries.html#options-from-props
    options: ({match}) => ({
      variables: {
        id: match.params.id,
      },
    }),
  })
)(Lesson)

export default withRouter(LessonWithGraphQL)
