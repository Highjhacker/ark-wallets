import merge from 'lodash/merge'

const mixins = [
    require('./toast').default,
    require('./clipboard').default,
    require('./delegates').default
];

export default merge(...mixins)
