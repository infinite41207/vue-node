import axios from 'axios'


export const getPhoto = async () => {
    const getOption = {
        method: 'get',
        url: `/getPhotoForDeliveryNoted`,
        headers: { 'Content-Type': 'application/json' },
    }
    try {
        const photos = await axios(getOption)
        return photos
    }catch (e) {
        return []
    }

}