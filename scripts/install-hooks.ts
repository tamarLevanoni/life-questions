export {};
// Production installs and CI must not require a development-only Husky binary.
if (process.env.CI || process.env.HUSKY === '0' || process.env.NODE_ENV === 'production') process.exit(0);
const { default: husky } = await import('husky');
const message = husky();
if (message) console.log(message);
