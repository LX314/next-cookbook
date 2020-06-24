import React, { useEffect, useState } from 'react'
import { useGet, usePost, post, get } from '../../plugins/api'
import { Button } from 'antd'

// import VLeftSession from '@/components/star/v-left-session'
// import VStarredList from '@/components/star/v-starred-list'
import VLeftSession from '../../components/star/v-left-session'
import VStarredList from '../../components/star/v-starred-list'
import { useRouter } from 'next/router'

// import MockUserInfo from '@/model/mock/lx314'
// import MockStarredList from '@/model/mock/starred'
import MockUserInfo from '../../model/mock/lx314'
import MockStarredList from '../../model/mock/starred'
import GitHub from '../../plugins/github'
// export const config = { amp: true };

const ClientID = 'bce5a494a0aaf5e10b2d'
const ClientSecret = 'fbfa526d1ec6c7bbec98373ac5bf6eaac15f4efc'
const GitHubToken = {
  access_token: '468509e9474a965f14ddd75aea9c076557e79459',
  scope: 'gist,repo,user',
  token_type: 'bearer',
}
// const a = {
//   client_id: 'bce5a494a0aaf5e10b2d',
//   client_secret: 'fbfa526d1ec6c7bbec98373ac5bf6eaac15f4efc',
//   code: '39fec70ced9c9e7e2d0d',
//   scope: 'repo,gist,user',
// }
const Page = (props) => {
  const [starredData, setStarredData] = useState({
    list: null,
  })
  useEffect(() => {
    window.t = {
      me: this,
      GitHub,
      check,
      test,
    }
    window.GitHub = GitHub
    loadData(0, 10)
  }, [])
  //   const { data, error } = useGet({ url: 'https://api.github.com/users/lx314' })
  //   const { data, error } = useGet({
  //     url: 'https://github.com/login/oauth/authorize',
  //     params: {
  //       client_id: ClientID,
  //       redirect_uri: 'http://localhost:3003/star',
  //       // login: '',
  //       scope: 'repo,gist,user',
  //       // state: '',
  //       // allow_signup: '',
  //     },
  //   })

  // const router = useRouter()
  // const { data, error } = usePost(
  //   router.query.code
  //     ? {
  //         url: 'https://github.com/login/oauth/access_token',
  //         params: {
  //           client_id: ClientID,
  //           client_secret: ClientSecret,
  //           code: router.query.code || '',
  //           scope: 'repo,gist,user',
  //           // redirect_uri: '',
  //           // state: '',
  //         },
  //       }
  //     : null,
  // )
  const data = MockUserInfo
  //   const { data, error } = useGet('https://api.github.com/users/lx314', {
  //     headers: {
  //       Authorization: `token ${GitHubToken.access_token}`,
  //     },
  //   })
  const test = () => {
    const t = get(
      'https://api.github.com/users/LX314/starred',
      {
        page: 1,
      },
      {
        headers: {
          // Accept: 'application/vnd.github.v3.star+json',
        },
      },
    )
      .then((res) => {
        return res.data || []
      })
      .then((list) => {
        console.log('List: ', list)
      })
  }
  const loadStarredList = (page) => {
    console.log('------------------------->Next: ', page)
    get(
      'https://api.github.com/users/LX314/starred',
      {
        page,
      },
      {
        headers: {
          // Accept: 'application/vnd.github.v3.star+json',
        },
      },
    )
      .then((res) => {
        const { data = [], headers = {} } = res
        const link = headers.link
        if (!link) {
          return { list: data }
        }
        const prev = link.replace(
          /^[\s\S]*?page=([0-9]{1,})>; rel="prev"[\s\S]*$/,
          '$1',
        )
        const next = link.replace(
          /^[\s\S]*?page=([0-9]{1,})>; rel="next"[\s\S]*$/,
          '$1',
        )
        const first = link.replace(
          /^[\s\S]*?page=([0-9]{1,})>; rel="first"[\s\S]*$/,
          '$1',
        )
        const last = link.replace(
          /^[\s\S]*?page=([0-9]{1,})>; rel="last"[\s\S]*$/,
          '$1',
        )
        const page_info = {
          prev: parseInt(prev),
          next: parseInt(next),
          first: parseInt(first),
          last: parseInt(last),
        }
        return { list: data, next: page_info.next }
      })
      .then(({ list, next }) => {
        insertRepoList(list).then((res) => {
          console.log('insertRepoList Result: ', res)
          if (next) {
            loadStarredList(next)
          }
        })
      })
  }

  const check = () => {
    const link = `<https://api.github.com/user/8361463/starred?page=22>; rel="prev", <https://api.github.com/user/8361463/starred?page=24>; rel="next", <https://api.github.com/user/8361463/starred?page=41>; rel="last", <https://api.github.com/user/8361463/starred?page=1>; rel="first"`
    for (let item of link.matchAll(
      /(?=[\s\S]*?page=)([0-9]{1,})(?=>; rel="(first|last)"[\s\S]*)/g,
    )) {
      console.log('Item: ', item)
    }
  }

  const insertUserList = (list = []) => {
    insertData({
      type: 'user',
      list: list,
    })
  }
  const insertLicenseList = (list = []) => {
    insertData({
      type: 'license',
      list: list,
    })
  }
  const insertRepoList = (list = []) => {
    insertData({
      type: 'repo',
      list: list,
    })
  }
  const insertData = ({ type = '', list = [] }) => {
    if (!list || list.length <= 0) {
      return Promise.resolve()
    }
    return post({
      url: 'http://0.0.0.0:3003/api/github/repo/insert',
      params: { type, list },
    })
  }
  const loadData = (from, to) => {
    return post({
      url: 'http://0.0.0.0:3003/api/github/repo/list',
      params: { type: 'repo', from, to },
    }).then(({ data }) => {
      setStarredData((t) => ({ ...t, list: data || [] }))
    })
  }
  return (
    <>
      <session className="v-session-star">
        <session className="v-session-left">
          <VLeftSession data={data} />
        </session>
        <session className="v-session-middle">
          <a href="https://github.com/login/oauth/authorize?client_id=bce5a494a0aaf5e10b2d&scope=repo,gist,user">
            Login
          </a>
          <section className="v-test-section">
            <button onClick={loadStarredList.bind(this, 1)}>
              Load Starred List
            </button>
            <button onClick={insertRepoList}>Insert Repo</button>
            <button onClick={insertLicenseList}>Insert License</button>
            <button onClick={insertUserList}>Insert User</button>
          </section>
          {starredData.list && <VStarredList list={starredData.list} />}
        </session>
        <session className="v-session-right">right</session>
      </session>
      <style jsx>{`
        .v-session-star {
          display: flex;
          justify-content: stretch;
          align-items: stretch;
        }
        .v-session-left {
          flex: 1 1 20%;
        }
        .v-session-middle {
          flex: 1 1 25%;
        }
        .v-session-right {
          flex: 1 1 55%;
        }
      `}</style>
    </>
  )
}

// Page.propTypes = {}
// export const getStaticPaths = async () => { return { paths, fallback: true }; }
// export const getStaticProps = async ({ params, preview, previewData }) => { return { props: { } }; }
// export const getServerSideProps = async ({ params, req, res, query, preview, previewData }) => {}
// Page.getInitialProps = async ({ req }) => {}

export default Page
