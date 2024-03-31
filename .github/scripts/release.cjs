// @ts-check

/** @param {import('github-script').AsyncFunctionArguments} args */
module.exports = async ({ context, github }) => {
  const { PACKAGE_NAME, PACKAGE_VERSION } = process.env;
  if (!PACKAGE_NAME) {
    throw new Error(`Environment variable must be defined: 'PACKAGE_NAME'`);
  } else if (!PACKAGE_VERSION) {
    throw new Error(`Environment variable must be defined: 'PACKAGE_VERSION'`);
  }
  await github.rest.repos.createRelease({
    body: 'Please download the appropriate binary for your system and move it somewhere in your path.',
    draft: true,
    name: `${PACKAGE_NAME} v${PACKAGE_VERSION}`,
    owner: context.repo.owner,
    prerelease: PACKAGE_VERSION.split('-').length > 1,
    repo: context.repo.repo,
    tag_name: `${PACKAGE_NAME}-v${PACKAGE_VERSION}`
  });
};
