import * as Arkvatar from 'arkvatar-ts';

export default {
    methods: {
        async getArkvatar(address) {
            const data = await Arkvatar.show(address);

            if (data.status === 200) {
                if (data.data.url) {
                    return data.data.url;
                }
            }
            if (data.response.status === 404) {
                return "https://arkvatars.s3.eu-west-3.amazonaws.com/arkvatars/public/ALhWkv1uGfujoVdRRiaFzrKzCwJvPkz7hi.png";
            }
        },
    }
}