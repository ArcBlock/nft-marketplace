/* eslint-disable react/prop-types */
const React = require('react');
const { LocaleProvider } = require('@arcblock/ux/lib/Locale/context');
const Layout = require('./src/components/layout').default;
const Provider = require('./src/components/provider').default;
const { translations } = require('./src/libs/locale');

exports.wrapPageElement = ({ element, props }) => (
  <LocaleProvider
    locale={props.pageContext.locale}
    translations={translations}
    originalPath={props.pageContext.originalPath}>
    <Layout {...props}>{element}</Layout>
  </LocaleProvider>
);
exports.wrapRootElement = ({ element }) => <Provider>{element}</Provider>;
