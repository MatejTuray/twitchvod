import {expect, test} from '@oclif/test'
import * as chai from 'chai'
import chaiHttp = require('chai-http')

import executeCommand from '../utils/executeCommand'

chai.use(chaiHttp)
require('dotenv').config()
const client: string = process.env.TWITCH_CLIENT as string

describe('info', () => {
  it('should not work with invalid ID', done => {
    chai
      .request('https://api.twitch.tv/kraken/videos/')
      .get('1')
      .set('Client-ID', client)
      .end((err: any, res: any) => {
        expect(res).to.have.status(404)
        expect(res.text).to.contain('Vod with ID 1 not found')
        done()
      })
  })
  it('should not work with invalid ID - command test', done => {
    executeCommand(['info', '1'], (stderr: any, stdout: any) => {
      expect(stdout).to.contain('Error: Request failed with status code 404')
      expect(stdout).to.contain('Unable to find video with this ID')
      done()
    })
  })
  it('should return a video from shroud', done => {
    chai
      .request('https://api.twitch.tv/kraken/videos/')
      .get('402207468')
      .set('Client-ID', client)
      .end((err: any, res: any) => {
        expect(res).to.have.status(200)
        expect(res.text).to.contain('shroud')
        done()
      })
  })
  test
    .stdout()
    .command(['info', '402207468'])
    .it('runs info without an error', ctx => {
      expect(ctx.stdout).to.not.contain('Error')
    })
  test
    .stdout()
    .command(['info'])
    .it('should not work without VOD id', ctx => {
      expect(ctx.stdout).to.contain('Error: No url or video id provided')
      expect(ctx.stdout).to.contain(
        'Run the command with --help flag to learn more'
      )
    })
})
describe('fetch', () => {
  test
    .stdout()
    .command(['fetch', '402207468'])
    .it('runs fetch without an error', ctx => {
      expect(ctx.stdout).to.not.contain('Error')
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
