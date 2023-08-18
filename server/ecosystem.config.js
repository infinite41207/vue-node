module.exports = {
    apps: [
        {
            name: 'synergy',
            script: 'app.js',
            watch: true,
            instances: 'max',
            exec_node: 'cluster',
            env: {},
        },
    ],
};
