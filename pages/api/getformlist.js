export default async function handler(req, res) {
    try {
        return res.status(200).json([
            {
                text: '___',
                value: ')',
            },
            {
                text: '__fsfd_',
                value: 'sdif',
            },
            {
                text: '__dksfh_',
                value: ')kch',
            },
            {
                text: '__fskdfjsfd_',
                value: 'sdivdkbjf',
            },
        ]);
    } catch (err) {
        console.log(err);
        return res.status(500).json({});
    }
}
