/**
 * Tells a preview deploy apart from the live site.
 *
 * Amplify sets AWS_BRANCH on every build; amplify.yml copies it into
 * NEXT_PUBLIC_DEPLOY_BRANCH so it survives into the bundle. Anything that is
 * not the `main` branch is treated as a preview.
 *
 * The default is deliberately "production". A missing variable means local
 * development or an unchanged build config, and the failure mode we care about
 * is the live site going noindex — that would cost real traffic. A preview
 * getting indexed is the milder mistake and is caught by the branch check.
 */
const PRODUCTION_BRANCH = 'main'

export const DEPLOY_BRANCH = process.env.NEXT_PUBLIC_DEPLOY_BRANCH ?? ''

/** True on any Amplify branch that is not production. False locally. */
export const IS_PREVIEW = DEPLOY_BRANCH !== '' && DEPLOY_BRANCH !== PRODUCTION_BRANCH
