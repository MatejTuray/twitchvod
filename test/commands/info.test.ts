import {expect, test} from '@oclif/test'
let chai = require('chai')
let chaiHttp = require('chai-http')
require('dotenv').config()

describe('info', () => {
  test
    .stdout()
    .command(['info', '402207468'])
    .it('runs info without an error', ctx => {
      expect(ctx.stdout).to.not.contain('Error')
    })
})
