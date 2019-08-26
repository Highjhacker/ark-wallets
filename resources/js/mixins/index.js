import merge from 'lodash/merge'

const mixins = [
    require('./toast').default,
    require('./clipboard').default
];

export default merge(...mixins)
