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

export function romanNumeralize(number) {
  let romanNumeral = '';
  let remainder = number;
  const hundreds = Math.floor(remainder / 100);
  remainder %= 100;
  for (let i = 0; i < hundreds; i++) {
    romanNumeral += 'C';
  }
  let tens = Math.floor(remainder / 10);
  remainder %= 10;
  if (tens === 9) {
    romanNumeral += 'XC';
  } else if (tens === 4) {
    romanNumeral += 'XL';
  } else {
    if (tens >= 5) {
      romanNumeral += 'L';
      tens -= 5;
    }
    for (let i = 0; i < tens; i++) {
      romanNumeral += 'X';
    }
  }
  let ones = Math.floor(remainder / 1);
  if (ones === 9) {
    romanNumeral += 'IX';
  } else if (ones === 4){
    romanNumeral += 'IV';
  } else {
    if (ones >= 5) {
      romanNumeral += 'V';
      ones -= 5;
    }
    for (let i = 0; i < ones; i++) {
      romanNumeral += 'I';
    }
  }
  return romanNumeral;
}
