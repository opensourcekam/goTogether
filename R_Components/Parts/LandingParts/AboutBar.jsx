const React = require('react')
const Card = require('./Card')

const AboutBar = () => (
  <section className="cardWell">
    <Card action="Centralize." actionText="Imagine all of your travel plan's in one place. An adventerous vacation startd with a simple idea. Let us help you gather your ideas." />
    <Card action="Plan." actionText="LetsGo, designed to be your smart travel assistant. Design the perfect trip for you and your friends." />
    <Card action="Go!" actionText="It just about that time! Are you all ready yet? Don't worry have the perfect trip for you. Let's Go!" />
  </section>
)

module.exports = AboutBar
