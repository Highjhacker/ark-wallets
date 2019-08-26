export default {
    methods: {
        async makeToast(content, icon, className) {
            return this.$toasted.show(content, {
                icon: {
                    name: icon
                },
                theme: "bubble",
                position: "bottom-right",
                duration: 5000,
                className: className
            });
        },
    }
}