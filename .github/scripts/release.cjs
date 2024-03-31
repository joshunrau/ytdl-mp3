// @ts-check

/**
 * Create a draft release and return the ID
 * @param {Pick<import('github-script').AsyncFunctionArguments, "context" | "github">} args
 * @param {{ packageName: string, packageVersion: string }} options
 * @returns {Promise<number>}
 */
async function createRelease({ context, github }, { packageName, packageVersion }) {
  if (!packageName) {
    throw new Error("Option 'packageName' must be defined");
  } else if (!packageVersion) {
    throw new Error("Option 'packageVersion' must be defined");
  }
  const { data } = await github.rest.repos.createRelease({
    body: 'Please download the appropriate binary for your system and move it somewhere in your path.',
    draft: true,
    name: `${packageName} v${packageVersion}`,
    owner: context.repo.owner,
    prerelease: packageVersion.split('-').length > 1,
    repo: context.repo.repo,
    tag_name: `${packageName}-v${packageVersion}`
  });
  return data.id;
}

module.exports = {
  createRelease
};
