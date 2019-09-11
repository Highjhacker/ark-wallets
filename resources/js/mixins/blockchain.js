export default {
    methods: {
        async getDelegateData(endpoint, publicKey) {
            return await axios.get(`${endpoint}delegates/${publicKey}`);
        },

        async getDelegateShare(type, delegateUsername) {
            if (type === 'Ark') {
                return await axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.arkdelegates.io/api/delegates/${delegateUsername}`);
            } else {
                return {
                    data: {
                        'payout_percentage': 'Unknown',
                        'payout_interval': 'Unknown'
                    }
                };
            }
        },

        async getWalletBalanceAndDelegatePublicKey(endpoint, address) {
            const request = await axios.get(`${endpoint}wallets/${address}`);

            return [request.data.data.balance, request.data.data.vote];
        },

        async getExplorerForType(type) {
            const explorers = [
                { 'type': 'Ark', 'url': 'https://explorer.ark.io/' },
                { 'type': 'Qredit', 'url': 'https://explorer.qredit.io/' }
            ];

            return explorers.find(match => match.type === type)
        },

        async getApiForType(type) {
            const apis = [
                { 'type': 'Ark', 'url': 'https://api.ark.land/api/' },
                { 'type': 'Qredit', 'url': 'https://api.qreditnode.com/api/' }
            ];

            return apis.find(match => match.type === type)
        },

        async queryApi(type, address) {
            try {
                const api = await this.getApiForType(type);

                return await axios.get(`${api.url}wallets/${address}`);
            } catch (error) {
                this.isProcessing = false;
                return await this.makeToast("Invalid type for the submitted Cryptocurrency.", "exclamation-triangle", "error");
            }
        },
    }
}