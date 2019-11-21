import React from 'react'
import { NextPage } from 'next'

const Error: NextPage<{statusCode: number | undefined}> = ({statusCode}) => (
  <p>{statusCode ? `An error ${statusCode} occurred on server.` : `An error occurred on client!`}</p>
)

Error.getInitialProps = async ({res, err}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return {statusCode}
}

export default Error
