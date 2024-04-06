export { Page }

import { css } from '../../utils/emotion'
import { Counter } from './Counter'

function Page() {
  const style = css({
    padding: "1rem",
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'red',
    }
  });

  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
        <li className={style}>
          @emotion/css SSR!!
        </li>
      </ul>
    </>
  )
}
