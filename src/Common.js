import React from 'react';

export class Directions extends React.Component {
  state = {
    hide: false,
  };
  render() {
    const { text } = this.props;
    return (
      <section className="directions" onClick={() => this.setState({ hide: !this.state.hide })}>
        <strong>Directions {this.state.hide ? '\u25B6' : '\u25BC'}</strong>
        {!this.state.hide && <p><i>{text}</i></p>}
      </section>
    );
  }
}

export const FlashCard = ({ item, handleAnswer}) => (
  <main>
    <Directions text="Have the student read the text in the card, helping them if needed. Then mark whether they needed help." />
    <section className="item">
      <h2>{item.split('\\n').map(function(item, i) {
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
      <button className="correct" onClick={() => handleAnswer(true)}>Read Independently</button>
      <button className="incorrect" onClick={() => handleAnswer(false)}>Needed Help</button>
    </section>
  </main>
);

export const LearnNew = ({ item, text, handleContinue }) => (
  <main>
    <Directions text="Have the student read the card. If they cannot, read the text below the card aloud." />
    <section className="item">
      <h2>{item}</h2>
    </section>
    <section>
      <p><i>{text}</i></p>
    </section>
    <section>
      <button className="continue" onClick={handleContinue}>Continue</button>
    </section>
  </main>
);

export const Header = ({ text }) => (
  <header>
    <h1>{text}</h1>
  </header>
);

export const Loading = () => (
  <div className="loader"></div>
);
