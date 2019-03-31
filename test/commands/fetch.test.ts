import {expect, test} from '@oclif/test'
require('dotenv').config()
const {exec} = require('child_process')
const path = require('path')

const executeCommand = (
  args: string[],
  done: {(stderr: any, stdout: any): void; (arg0: any, arg1: any): void}
) => {
  args.unshift(
    'node',
    path.resolve(path.join(__dirname, '..', '..', 'bin', 'run'))
  )

  exec(args.join(' '), (err: any, stdout: any, stderr: any) => {
    done(stderr, stdout)
  })
}

describe('fetch', () => {
  test
    .stdout()
    .command(['fetch', '402207468'])
    .it('runs fetch without an error', ctx => {
      expect(ctx.stdout).to.contain('Fetching video links')
    })
  it('should return stderr - too few args', done => {
    executeCommand(['fetch'], (stderr: any, stdout: any) => {
      expect(stderr).to.contain('Error: Missing 1 required arg:')
      expect(stderr).to.contain('vod  Link to twitch VOD url or ID')
      expect(stderr).to.contain('See more help with --help')
      expect(stdout).to.equal('')
      done()
    })
  })
  it('should return VOD not found', done => {
    executeCommand(['fetch', '1'], (stderr: any, stdout: any) => {
      expect(stdout).to.contain('StatusCodeError: 404')
      expect(stdout).to.contain('VOD not found')
      done()
    })
  })
})
after(done => {
  done()
  process.exit(0)
})
