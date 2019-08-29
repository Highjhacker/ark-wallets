export default {
    methods: {
        async getDelegateData(endpoint, publicKey) {
            const request = await axios.get(`${endpoint}delegates/${publicKey}`);

            return request;
        },

        async getDelegateShare(type, delegateUsername) {
            if (type === 'Ark') {
                const response = await axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.arkdelegates.io/api/delegates/${delegateUsername}`);

                return response;
            } else {
                return {
                    data: {
                        'payout_percentage': 'Unknown',
                        'payout_interval': 'Unknown'
                    }
                };
            }
        },
    }
}