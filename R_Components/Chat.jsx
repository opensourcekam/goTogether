const React = require('react')

const Chat = () => (
  <section>
    <article>
      <ul class="msgs"></ul>
      <div class="newMsg">
        <textarea type="text" autofill="false" autocorrect="true" cols="60" rows="1" onkeyup="textAreaAdjust(this)" style="overflow:hidden"></textarea>
      </div>
    </article>
  </section>
)

module.exports = Chat
