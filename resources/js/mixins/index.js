import merge from 'lodash/merge'

const mixins = [
    require('./arkvatar').default,
    require('./blockchain').default,
    require('./clipboard').default,
    require('./toast').default,
];

export default merge(...mixins)