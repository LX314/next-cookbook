import Link from 'next/link'
import Head from 'next/head'
import { theme } from '../theme/theme'
import Base from './base'

// const layoutStyle = {
//   margin: 20,
//   padding: 20,
//   border: "1px solid #ddd"
// };

const Mobile = ({ children, title = '' }) => {
  return (
    <Base>
      <Head>
        <meta key="charSet" charSet="utf-8" />
        {/* <meta key="viewport" name="viewport" content="minimal-ui" /> */}
        {/* Use minimum-scale=1 to enable GPU rasterization */}
        <meta
          key="viewport"
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        {/* PWA primary color */}
        <meta
          key="theme-color"
          name="theme-color"
          content={theme.palette.primary.main}
        />
        <title>{title}</title>
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          |
          <Link href="/about">
            <a>About</a>
          </Link>
          |
        </nav>
      </header>
      {children}
    </Base>
  )
}

export default Mobile
