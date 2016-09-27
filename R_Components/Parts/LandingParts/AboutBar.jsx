const React = require('react')
const Card = require('./Card')

const AboutBar = () => (
  <article className="cardWell">
    <Card action="Centralize." actionText="Imagine all of your travel plans in one place. Adventerous vacations start with simple ideas." />
    <Card action="Plan." actionText="LetsGo, the smart travel assistant. Designs the perfect trip for you and your friends." />
    <Card action="Go!" actionText="It's just about that time! Are you all ready yet? Don't worry have the perfect trip for you. Let's Go!" />
  </article>
)

module.exports = AboutBar
