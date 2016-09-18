const React = require('react')

const Chat = () => (
  <section>
    <article>
      <ul className='msgs' />
      <div className='newMsg'>
        <textarea type='text' autofill='false' autocorrect='true' cols='60' rows='1' onkeyup='textAreaAdjust(this)' style='overflow:hidden' />
      </div>
    </article>
  </section>
)

module.exports = Chat
