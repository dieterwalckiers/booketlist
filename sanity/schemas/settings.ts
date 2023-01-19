const settings = {
    name: 'settings',
    type: 'document',
    title: 'Settings',
    fields: [
        {
            name: 'logo',
            type: 'image',
            title: 'Logo',
        },
    ],
    preview: {
        prepare() {
            return {
                title: 'Settings',
            }
        }
    }
}
export default settings