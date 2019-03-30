import { expect, test } from "@oclif/test";

describe("info", () => {
  test
    .stdout()
    .command(["info", "402207468"])
    .it("runs info", ctx => {
      expect(ctx.stdout).to.not.contain("error");
    });
});

describe("fetch", () => {
  test
    .stdout()
    .command(["info", "402207468"])
    .it("runs fetch", ctx => {
      expect(ctx.stdout).to.not.contain("error");
    });
});
